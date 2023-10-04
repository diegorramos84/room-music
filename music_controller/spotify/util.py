from datetime import timedelta

import environ
import requests
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response

from .models import SpotifyToken

env = environ.Env()

env_file = '/music_controller/music_controller/.env'

environ.Env.read_env(env_file)

# import random
# import string

#
# def generate_random_string(length):
#     letters = string.ascii_letters + string.digits
#     return ''.join(random.choice(letters) for i in range(length))


BASE_URL = 'https://api.spotify.com/v1/me/'

def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_key, access_token, refresh_token, expires_in, token_type):
    tokens = get_user_tokens(session_key)

    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'expires_in', 'token_type'])

    else:
        tokens = SpotifyToken(
            user=session_key,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
            token_type=token_type
        )
        tokens.save()

def is_spotify_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_key)
            print('TRYING TO REFRESH TOKENS')
        print('Auth is True')
        return True
    print('Auth is false')
    return False

def refresh_spotify_token(session_key):
    refresh_token = get_user_tokens(session_key).refresh_token
    print(refresh_token, 'REFRESH TOKEN')

    try:
        response = requests.post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': env('CLIENT_ID'),
            'client_secret': env('CLIENT_SECRET')
        })

        data = response.json()
        print(data, 'DATA')

        access_token = data.get('access_token')
        token_type = data.get('token_type')
        expires_in = data.get('expires_in')
    # removed refresh_token to be update as it stays the same
        update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", e)
        return Response({ 'error': 'An error ocurred while requesting tokens'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def execute_spotify_api_request(session_key, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_key)
    headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokens.access_token}

    if post_:
        try:
            requests.post(BASE_URL + endpoint, headers=headers)
        except:
            return {'Error': 'Issue with request'}

    if put_:
        try:
            requests.put(BASE_URL + endpoint, headers=headers)
        except:
            return {'Error': 'Issue with request'}

    try:
        response = requests.get(BASE_URL + endpoint, {}, headers=headers)
        return response.json()
    except:
        return {'Error': 'Issue with request'}


def play_song(session_key):
    return execute_spotify_api_request(session_key, "player/play", put_=True)

def pause_song(session_key):
    return execute_spotify_api_request(session_key, "player/pause", put_=True)

def skip_song(session_key):
    return execute_spotify_api_request(session_key, "player/next", post_=True)
