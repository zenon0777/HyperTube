from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
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
        self.base_url = "https://1337x.to"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }

    def search_torrent(self, query, year=None):
        search_query = f"{query} {year}" if year else query
        search_url = f"{self.base_url}/search/{search_query}/1/"
        
        try:
            response = requests.get(search_url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            results = []
            for row in soup.select('tbody tr'):
                name_cell = row.select_one('td.name')
                if not name_cell:
                    continue
                
                link = name_cell.select_one('a:nth-of-type(2)')
                if not link:
                    continue
                
                seeds = row.select_one('td.seeds').text
                leeches = row.select_one('td.leeches').text
                size = row.select_one('td.size').text
                
                # Get magnet link from torrent page
                torrent_url = self.base_url + link['href']
                magnet = self.get_magnet_link(torrent_url)
                
                results.append({
                    'name': link.text,
                    'url': torrent_url,
                    'magnet': magnet,
                    'seeds': int(seeds),
                    'leeches': int(leeches),
                    'size': size
                })
            
            # Sort by seeds descending
            return sorted(results, key=lambda x: x['seeds'], reverse=True)
            
        except Exception as e:
            print(f"Error searching torrents: {str(e)}")
            return []

    def get_magnet_link(self, torrent_url):
        try:
            response = requests.get(torrent_url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            magnet_link = soup.select_one('a[href^="magnet:?"]')
            return magnet_link['href'] if magnet_link else None
        except Exception as e:
            print(f"Error getting magnet link: {str(e)}")
            return None

    def find_best_match(self, title, year=None, min_seeds=10):
        results = self.search_torrent(title, year)
        if not results:
            return None
        
        # Filter by minimum seeds
        results = [r for r in results if r['seeds'] >= min_seeds]
        
        if year:
            # Try to find exact match with year
            year_pattern = re.compile(rf'\b{year}\b')
            exact_matches = [r for r in results if year_pattern.search(r['name'])]
            if exact_matches:
                return exact_matches[0]
        
        # Return highest seeded result if no exact match
        return results[0] if results else None


def test_scraper(request):
    scraper = TorrentScraper()
    torrent = scraper.find_best_match("Your Fault", 2024)
    if torrent:
        print(f"Found: {torrent['name']}")
        print(f"Magnet: {torrent['magnet']}")
        return JsonResponse({"torrent": torrent}, status=200)
    return JsonResponse({"error": "No torrent found"}, status=404)

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

@csrf_exempt
def movie_detail(request, id):
    if request.method == "GET":
        try:
            base_url = f"https://yts.mx/api/v2/movie_details.json"
            query_params = {"movie_id": id}
            query_string = "&".join(
                f"{key}={value}" for key, value in query_params.items()
            )
            url = f"{base_url}?{query_string}"

            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            movie = data.get("data", {}).get("movie", {})
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
