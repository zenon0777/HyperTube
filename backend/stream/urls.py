from django.urls import path
from . import views

urlpatterns = [
    path('', views.stream_torrent, name='stream_torrent'),
    path('init/', views.init_torrent_file, name='init_stream_torrent'),
    path('movie/', views.stream_stored_movie, name='stream_stored_movie'),
    path('movies/list/', views.list_stored_movies, name='list_stored_movies'),
]
