import environ
from django.shortcuts import redirect, render
from requests import Request, post
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .util import (
    generate_random_string,
    is_spotify_authenticated,
    update_or_create_user_tokens,
)

env = environ.Env()

env_file = '/music_controller/music_controller/.env'

environ.Env.read_env(env_file)


# endpoint to prepare URL for the frontend
class AuthURL(APIView):
    def get(self, request, format=None):
        state = generate_random_string(16)
        scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'response_type': 'code',
            'client_id': env('CLIENT_ID'),
            'scope': scope,
            'redirect_uri': env('REDIRECT_URI'),
            'state': state
        }).prepare().url

        return Response({ 'url': url }, status=status.HTTP_200_OK)


# Spotify callback to receive code & state

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    # with code we will request tokens to the spotify api endpoint
    response = post('https://account.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': env('REDIRECT_URI'),
        'client_id': env('CLIENT_ID'),
        'client_secret': env('CLIENT_SECRET')
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()
        request.session.modified = True

    update_or_create_user_tokens(
        request.session.session_key,
        access_token,refresh_token,
        expires_in,
        token_type
        )
    # redirect to frontend home (localhost for now)
    return redirect('http://127.0.0.1:5173')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        print(is_authenticated)
        return Response({ 'status': is_authenticated}, status=status.HTTP_200_OK)
