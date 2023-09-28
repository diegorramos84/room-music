import environ
import requests
from api.models import Room
from django.shortcuts import redirect, render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .util import (  # generate_random_string,
    execute_spotify_api_request,
    is_spotify_authenticated,
    update_or_create_user_tokens,
)

env = environ.Env()

env_file = '/music_controller/music_controller/.env'

environ.Env.read_env(env_file)


# endpoint to prepare URL for the frontend
class AuthURL(APIView):
    def get(self, request, format=None):
        # state = generate_random_string(16)
        scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        try:
            response = requests.get('https://accounts.spotify.com/authorize', params={
                'response_type': 'code',
                'client_id': env('CLIENT_ID'),
                'scope': scope,
                'redirect_uri': env('REDIRECT_URI'),
                # 'state': state
            })
            response.raise_for_status()
            url = response.url
        except requests.exceptions.RequestException as e:
            print("An error occurred:", e)
            return Response({ 'error': 'An error ocurred while fetching the authorization URL'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({ 'url': url }, status=status.HTTP_200_OK)


# Spotify callback to receive code & state

def spotify_callback(request, format=None):
    print('I HAVE BEEN CALLED!!!!')
    code = request.GET.get('code')
    error = request.GET.get('error')

    # with code we will request tokens to the spotify api endpoint
    try:
        response = requests.post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': env('REDIRECT_URI'),
            'client_id': env('CLIENT_ID'),
            'client_secret': env('CLIENT_SECRET')
        })
        response.raise_for_status()

        if not request.session.exists(request.session.session_key):
            request.session.create()
            request.session.modified = True

        data = response.json()

        access_token = data.get('access_token')
        token_type = data.get('token_type')
        refresh_token = data.get('refresh_token')
        expires_in = data.get('expires_in')
        error = data.get('error')
        session_key = request.session.session_key

        print(access_token, 'atoken')
        print(token_type, 'ttoken')
        print(refresh_token, 'rtoken')
        print(expires_in, 'expires')

        update_or_create_user_tokens(session_key, access_token, refresh_token, expires_in, token_type )


    except requests.exceptions.RequestException as e:
        print("An error occurred:", e)
        return Response({ 'error': 'An error ocurred while requesting tokens'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # redirect to frontend home (localhost for now)
    return redirect('http://127.0.0.1:5173')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        print(is_authenticated)
        return Response({ 'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)

        if room:
            room = room[0]
        else:
            return Response({'Error': 'could not find room'}, status=status.HTTP_404_NOT_FOUND)

        host = room.host
        endpoint = 'player/currently-playing'
        response = execute_spotify_api_request(host, endpoint)

        # item is what we are looking in the api response that holds info about the song
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        # format song artists
        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }


        return Response(song, status=status.HTTP_200_OK)
