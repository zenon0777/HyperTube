from django.urls import path
from . import views


urlpatterns = [
    path("tmdb_movie_list", views.tmdb_movie_list, name="TMDBlist_movies"),
    # path("tmdb_movie_detail/<int:id>", views.detail, name="detail_movie"),
    path("yts_movie_list", views.yts_movie_search, name="YTSlist_movie"),
]
