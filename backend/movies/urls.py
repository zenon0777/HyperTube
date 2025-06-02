from django.urls import path
from . import views


urlpatterns = [
    path("tmdb_movie_list", views.tmdb_movie_list, name="TMDBlist_movies"),
    path("yts_movie_list", views.yts_movie_list, name="YTSlist_movie"),
    path("tmdb_multi_search", views.tmdb_multi_search, name="tmdb_multi_search"),
    path("trending_tv_shows", views.trending_tv_shows, name="trending_tv_shows"),
    path("trending_movies_tmdb_shows", views.top_movies_tmdb_shows, name="top_movies_tmdb_shows"),
    path("yts_movie_detail", views.yts_movie_detail, name="yts_movie_detail"),
    path("tmdb_movie_detail/<int:id>", views.tmdb_movie_detail, name="tmdb_movie_detail"),
    path("test_scraper", views.test_scraper, name="test_scraper"),
    path('<str:movie_id>/comments/add/', views.add_comment, name='add_comment'),
    path('<str:movie_id>/comments/', views.get_movie_comments, name='movie_comments'),
]
