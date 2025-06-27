from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
import requests
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import AllowAny

import json
from .models import Movie, MoviComment
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(env_file=str(BASE_DIR / ".env"))


import requests
from bs4 import BeautifulSoup
import re

class TorrentScraper:
    def __init__(self):
        self.yts_api_url = "https://yts.mx/api/v2/list_movies.json"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def search_torrent(self, query, year=None):
        try:
            params = {
                'query_term': query,
                'limit': 20,
                'sort_by': 'seeds',
                'order_by': 'desc'
            }
            if year:
                params['query_term'] = f"{query} {year}"
            
            print(f"Searching YTS API for: {params['query_term']}")
            
            response = requests.get(self.yts_api_url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            print(f"YTS API response status: {data.get('status')}")
            
            if data.get('status') == 'ok' and data.get('data', {}).get('movies'):
                results = []
                movies = data['data']['movies']
                print(f"Found {len(movies)} movies from YTS")
                
                for movie in movies:
                    if movie.get('torrents'):
                        for torrent in movie['torrents']:
                            torrent_hash = torrent.get('hash', '')
                            if torrent_hash:
                                magnet = f"magnet:?xt=urn:btih:{torrent_hash}&dn={requests.utils.quote(movie['title'])}&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80"
                                
                                results.append({
                                    'name': f"{movie['title']} ({movie.get('year', 'Unknown')}) [{torrent.get('quality', 'Unknown')}]",
                                    'url': movie.get('url', ''),
                                    'magnet': magnet,
                                    'seeds': torrent.get('seeds', 0),
                                    'leeches': torrent.get('peers', 0),
                                    'size': torrent.get('size', 'Unknown')
                                })
                
                print(f"Generated {len(results)} torrent results")
                return sorted(results, key=lambda x: x['seeds'], reverse=True)
            
            print("No movies found in YTS response")
            return []
            
        except Exception as e:
            print(f"Error searching YTS API: {str(e)}")
            return []

    def get_magnet_link(self, torrent_url):
        return None

    def is_3d_torrent(self, torrent_name):
        torrent_name_lower = torrent_name.lower()
        
        three_d_indicators = [
            '3d', 
            'sbs',
            'hsbs',
            'tab',
            'htab',
            'ou',
            'anaglyph',
            'stereoscopic',
            '3-d',
            '.3d.',
            ' 3d ',
            '[3d]',
            '(3d)',
            'imax.3d',
            'hsou',
        ]
        
        for indicator in three_d_indicators:
            if indicator in torrent_name_lower:
                print(f"====> Filtering out 3D torrent: {torrent_name} (matched: {indicator})")
                return True
        
        return False

    def find_best_match(self, title, year=None, min_seeds=1):
        results = self.search_torrent(title, year)
        if not results:
            print("No search results found")
            return None
        
        # Filter by minimum seeds
        filtered_results = [r for r in results if r['seeds'] >= min_seeds]
        print(f"Found {len(filtered_results)} results with >= {min_seeds} seeds")
        
        # Filter out 3D torrents (never stream 3D content)
        non_3d_results = [r for r in filtered_results if not self.is_3d_torrent(r['name'])]
        print(f"Found {len(non_3d_results)} non-3D results after filtering 3D torrents")
        
        filtered_results = non_3d_results
        
        if year:
            # Try to find exact match with year
            year_pattern = re.compile(rf'\b{year}\b')
            exact_matches = [r for r in filtered_results if year_pattern.search(r['name'])]
            if exact_matches:
                print(f"Found exact year match: {exact_matches[0]['name']}")
                return exact_matches[0]
        
        # Return highest seeded result if no exact match
        if filtered_results:
            print(f"Returning best match: {filtered_results[0]['name']}")
            return filtered_results[0]
        
        print("No suitable non-3D matches found - all available torrents are 3D")
        return None


api_view(["GET"])
@permission_classes([AllowAny])
def movie_list(request):
    if request.method == "GET":
        try:
            url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
            headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {env('TMDB_API_KEY')}",
            }

            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            movies = data
            if not movies:
                return JsonResponse(
                    {"error": "No movies found in the response"}, status=404
                )
            return JsonResponse({"movies": movies}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)


@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def search_torrents(request):
    scraper = TorrentScraper()
    title = request.GET.get("title", "")
    year = request.GET.get("year", None)
    
    print(f"Searching for: {title} ({year})")
    
    torrent = scraper.find_best_match(
        title=title,
        year=year,
    )
    if torrent:
        print(f"Found: {torrent['name']}")
        print(f"Magnet: {torrent['magnet']}")
        return JsonResponse({"torrent": torrent}, status=200)
    
    print("No torrent found")
    return JsonResponse({"error": "No torrent found"}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_as_watched(request, movie_id):
    try:
        movie = Movie.objects.get(movie_id=movie_id)
    except Movie.DoesNotExist:
        Movie.objects.create(movie_id=movie_id, is_watched=True)
        return JsonResponse(
            {"success": True, "message": "Movie not found, created new entry"},
            status=200
        )

    movie.is_watched = True
    movie.save()

    return JsonResponse(
        {"success": True, "message": "Movie marked as watched"},
        status=200
    )
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_is_movoie_watched(request, movie_id):
    if not movie_id:
        return JsonResponse(
            {"success": False, "error": "movie_id is required"},
            status=400
        )
    try:
        movie = Movie.objects.get(movie_id=movie_id)
    except Movie.DoesNotExist:
        return JsonResponse(
            {"success": True, "message": "Movie not found"},
            status=200
        )
    return JsonResponse(
        {"success": True, "is_watched": movie.is_watched},
        status=200
    )  

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_comment(request, movie_id):

    comment_text = request.data.get("comment", "").strip()
    if not comment_text:
        return JsonResponse(
            {"success": False, "error": "Comment text is required"},
            status= 400
        )

    try:
        movie = Movie.objects.get(movie_id=movie_id)
    except Movie.DoesNotExist:
        movie = Movie.objects.create(movie_id=movie_id)

    comment = MoviComment.objects.create(
        movie=movie,
        user=request.user,
        comment=comment_text
    )

    response_data = {
        "success": True,
        "message": "Comment added successfully",
        "comment": {
            "id": comment.id,
            "comment": comment.comment,
            "user": comment.user.username,
            "user_id": comment.user.id,
            "created_at": comment.created_at.isoformat(),
            "movie_id": movie.movie_id
        }
    }
    return JsonResponse(response_data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_movie_comments(request, movie_id):

    
    try:
        movie = Movie.objects.get(movie_id=movie_id)
    except Movie.DoesNotExist:
        return JsonResponse(
            {"success": True, "message": "Movie not in database"},
            status=200
        )
    comments_qs = (
        MoviComment.objects
        .select_related("user")
        .filter(movie=movie)
        .order_by("-created_at")
    )

    comments_data = []
    for comment in comments_qs:
        comments_data.append({
            "id": comment.id,
            "comment": comment.comment,
            "user": {
                "id": comment.user.id,
                "username": comment.user.username,
                "email": getattr(comment.user, "email", None),
                "profile_picture": getattr(comment.user, "profile_picture_url", None)
            },
            "created_at": comment.created_at.isoformat(),
            "updated_at": comment.updated_at.isoformat(),
        })

    return JsonResponse({
        "success": True,
        "movie_id": movie.movie_id,
        "comments_count": comments_qs.count(),
        "comments": comments_data
    }, status=200)

@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view (["GET"])
def tmdb_movie_list(request):
    if request.method == "GET":
        try:
            base_url = "https://api.themoviedb.org/3/discover/movie"

            query_params = request.GET.dict()
            query_params = request.GET.dict()
            query_params["api_key"] = env("TMDB_API_KEY", default="Key not found")
            query_string = "&".join(
                f"{key}={value}" for key, value in query_params.items()
            )
            url = f"{base_url}?{query_string}"
            headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {env('TMDB_API_KEY')}",
            }

            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            movies = data
            if not movies:
                return JsonResponse(
                    {"error": "No movies found in the response"}, status=404
                )
            return JsonResponse({"movies": movies}, status=200)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"TMDB API error: {str(e)}"}, status=500)
        except environ.ImproperlyConfigured:
            return JsonResponse(
                {"error": "Environment variable TMDB_API_KEY is not set"}, status=500
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)

@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view (["GET"])
def yts_movie_list(request):
    if request.method == "GET":
        try:
            base_url = "https://yts.mx/api/v2/list_movies.json"
            query_params = request.GET.dict()
            query_string = "&".join(
                f"{key}={value}" for key, value in query_params.items()
            )
            url = f"{base_url}?{query_string}"

            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            movies = data.get("data", {})
            movie_list = movies.get("movies", [])
            if not movie_list:
                return JsonResponse(
                    {"error": "No movies found in the response"}, status=404
                )
            return JsonResponse({"data": movies}, status=200)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"YTS API error: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)

@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view (["GET"])
def top_movies_tmdb_shows(request):
    if request.method == "GET":
        try:
            base_url = 'https://api.themoviedb.org/3/movie'
            query_params = request.GET.dict()
            path = query_params.pop("path", None)
            query_params["api_key"] = env("TMDB_API_KEY", default="Key not found")  
            query_string = "&".join(
                f"{key}={value}" for key, value in query_params.items()
            )
            url = f"{base_url}/{path}?{query_string}" if path else f"{base_url}?{query_string}"
            headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {env('TMDB_API_KEY')}",
            }

            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            movies = data
            movie_list = movies.get("results", [])
            if not movie_list:
                return JsonResponse(
                    {"error": "No movies found in the response"}, status=404
                )
            return JsonResponse({"movies": movies}, status=200)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"TMDB API error: {str(e)}"}, status=500)
        except environ.ImproperlyConfigured:
            return JsonResponse(
                {"error": "Environment variable TMDB_API_KEY is not set"}, status=500
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)

@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view (["GET"])
def tmdb_multi_search(request):
    try:
        #  ?query=={query}
        base_url = "https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1"
        query_params = request.GET.dict()
        query_params["api_key"] = env("TMDB_API_KEY", default="Key not found")
        query_string = "&".join(f"{key}={value}" for key, value in query_params.items())
        url = f"{base_url}&{query_string}"
        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {env('TMDB_API_KEY')}",
        }
        print("here is the url ", url)
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        movies = data
        movie_list = movies.get("results", [])
        if not movie_list:
            return JsonResponse(
                {"error": "No movies found in the response"}, status=404
            )
        return JsonResponse({"movies": movies}, status=200)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"TMDB API error: {str(e)}"}, status=500)
    except environ.ImproperlyConfigured:
        return JsonResponse(
            {"error": "Environment variable TMDB_API_KEY is not set"}, status=500
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view (["GET"])
def yts_movie_detail(request):
    if request.method == "GET":
        try:
            base_url = env("YTS_API_BASE_URL", default="https://yts.mx/api/v2/")
            details_url = base_url + "movie_details.json"
            query_params = request.GET.dict()
            query_string = "&".join(
                f"{key}={value}" for key, value in query_params.items()
            )
            url = f"{details_url}?{query_string}"

            similar_url = f"{base_url}movie_suggestions.json?movie_id={query_params.get('movie_id', '')}"
            similar_response = requests.get(similar_url)
            similar_response.raise_for_status()
            similar_data = similar_response.json()
            if "data" in similar_data and "movies" in similar_data["data"]:
                similar_data = similar_data["data"]["movies"]
            else:
                similar_data = {}

            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            movie = data.get("data", {}).get("movie", {}) 
            if similar_data:
                movie["similar_movies"] = similar_data
            if not movie:
                return JsonResponse(
                    {"error": "No movie found for the given ID"}, status=404
                )
            return JsonResponse({"movie": movie}, status=200)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"YTS API error: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)


@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view (["GET"])
def tmdb_movie_detail(request, id):
    if request.method == "GET":
        try:
            base_url = env("TMDB_API_DETAILS_URL")
            base_url = base_url.format(id=id)
            query_params = request.GET.dict()
            query_string = "&".join(
                f"{key}={value}" for key, value in query_params.items()
            )
            url = f"{base_url}?{query_string}"
            headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {env('TMDB_API_KEY')}",
            }
            

            videos_url = base_url.split("?")[0] + "/videos"
            images_url = base_url.split("?")[0] + "/images"
            similar_url = base_url.split("?")[0] + "/similar"
            
            images_response = requests.get(images_url, headers=headers)
            images_response.raise_for_status()
            images_data = images_response.json()
                
            similar_response = requests.get(similar_url, headers=headers)
            similar_response.raise_for_status()
            similar_data = similar_response.json()
            
            videos_response = requests.get(videos_url, headers=headers)
            videos_response.raise_for_status()
            videos_data = videos_response.json()
           
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            movie = data
            movie["images"] = images_data
            movie["similar_movies"] = similar_data
            movie["videos"] = videos_data
            
            
            if not movie:
                return JsonResponse(
                    {"error": "No movie found for the given ID"}, status=404
                )
            return JsonResponse({"movie": movie}, status=200)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"TMDB API error: {str(e)}"}, status=500)
        except environ.ImproperlyConfigured:
            return JsonResponse(
                {"error": "Environment variable TMDB_API_KEY is not set"}, status=500
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_movie_detail(request, movie_id):
    if request.method == "GET":
        try:
            movie = Movie.objects.get(movie_id=movie_id)
            return JsonResponse({"movie": movie}, status=200)
        except Movie.DoesNotExist:
            return JsonResponse({"error": "Movie not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def comment_list(request):
    """
    List all comments or create a new comment.
    """
    if request.method == "GET":
        comments = MoviComment.objects.select_related("user").order_by("-created_at")[:20]
        data = [
            {
                "id": comment.id,
                "content": comment.comment,
                "author_username": comment.user.username,
                "date": comment.created_at,
            }
            for comment in comments
        ]
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        movie_id = request.data.get("movie_id")
        comment_text = request.data.get("comment")

        if not all([movie_id, comment_text]):
            return JsonResponse({"error": "movie_id and comment are required."}, status=400)

        movie, created = Movie.objects.get_or_create(movie_id=movie_id)

        comment = MoviComment.objects.create(
            movie=movie, user=request.user, comment=comment_text
        )

        return JsonResponse(
            {
                "id": comment.id,
                "content": comment.comment,
                "author_username": comment.user.username,
                "date": comment.created_at,
            },
            status=201,
        )


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def comment_detail(request, comment_id):
    """
    Retrieve, update or delete a comment instance.
    """
    comment = get_object_or_404(MoviComment, pk=comment_id)

    if request.method == "GET":
        data = {
            "id": comment.id,
            "comment": comment.comment,
            "author_username": comment.user.username,
            "date_posted": comment.created_at,
        }
        return JsonResponse(data)

    elif request.method == "PATCH":
        if comment.user != request.user:
            return JsonResponse({"error": "You are not authorized to edit this comment."}, status=403)
        
        comment_text = request.data.get("comment")
        if not comment_text:
            return JsonResponse({"error": "Comment content cannot be empty."}, status=400)
        
        comment.comment = comment_text
        comment.save()
        
        data = {
            "id": comment.id,
            "comment": comment.comment,
            "author_username": comment.user.username,
            "date_posted": comment.created_at,
        }
        return JsonResponse(data)

    elif request.method == "DELETE":
        if comment.user != request.user:
            return JsonResponse({"error": "You are not authorized to delete this comment."}, status=403)
        
        comment.delete()
        return JsonResponse(status=204)

