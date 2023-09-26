from django.urls import path

from .views import AuthURL, IsAuthenticated, spotify_callback

urlpatterns = [
    path('get-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-auth', IsAuthenticated.as_view())
]
