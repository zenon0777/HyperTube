from django.urls import path
from . import views

urlpatterns = [
    path('', views.stream_torrent, name='stream_torrent'),
]
