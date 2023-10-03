import environ
import requests
from api.models import Room
from django.shortcuts import redirect, render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Vote
from .util import (  # generate_random_string,
    execute_spotify_api_request,
    is_spotify_authenticated,
    pause_song,
    play_song,
    skip_song,
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
        print(response, 'RESPONSE')
        print(data, "DATA")
        print(data.get('refresh_token'), "REFRESH")

        access_token = data.get('access_token')
        token_type = data.get('token_type')
        refresh_token = data.get('refresh_token')
        expires_in = data.get('expires_in')
        error = data.get('error')
        session_key = request.session.session_key

        update_or_create_user_tokens(session_key, access_token, refresh_token, expires_in, token_type)


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

        if room.exists():
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

        votes = len(Vote.objects.filter(room=room, song_id=song_id))

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        try:
            current_song = room.current_song

            if current_song != song_id:
                room.current_song = song_id
                room.save(update_fields=['current_song'])
                votes = Vote.objects.filter(room=room).delete()
            else:
             return Response({'Error': 'could not find current song'}, status=status.HTTP_404_NOT_FOUND)

        except requests.exceptions.RequestException as e:
            print("An error occurred:", e)
            return Response({ 'error': 'An error ocurred while requesting tokens'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PauseSong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
            vote.save()
        return Response({}, status=status.HTTP_204_NO_CONTENT)
