from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(env_file=str(BASE_DIR / ".env"))

@csrf_exempt
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
def yts_movie_search(request):

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
def trending_tv_shows(request):
    if request.method == "GET":
        try:
            base_url = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US'
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
            tv_shows = data
            tv_show_list = tv_shows.get("results", [])
            if not tv_show_list:
                return JsonResponse(
                    {"error": "No TV shows found in the response"}, status=404
                )
            return JsonResponse({"tv_shows": tv_shows}, status=200)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"TMDB API error: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)

@csrf_exempt
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
