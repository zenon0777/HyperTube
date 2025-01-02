from django.urls import path
from . import views

urlpatterns = [
    path('', views.stream_torrent, name='stream_torrent'),
    path('init/', views.init_stream, name='init_stream'),
    path('init/torrent_file', views.init_torrent_file, name='init_stream_torrent'),
]

