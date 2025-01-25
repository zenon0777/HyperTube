from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
 
import requests
import environ
from pathlib import Path
from rest_framework.views import APIView

BASE_DIR = Path(__file__).resolve().parent.parent
from .models import Movie, Comment
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
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





class MovieProvider:
    @staticmethod
    def get_movie_details(movie_id, provider):
        if provider == "yts":
            return YTSProvider.get_movie(movie_id)
        elif provider == "tmdb":
            return TMDBProvider.get_movie(movie_id)
        raise ValueError("Invalid provider")

class YTSProvider:
    @staticmethod
    def get_movie(movie_id):
        url = f"https://yts.mx/api/v2/movie_details.json?movie_id={movie_id}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json().get("data", {}).get("movie", {})

class TMDBProvider:
    @staticmethod
    def get_movie(movie_id):
        url = f"https://api.themoviedb.org/3/movie/{movie_id}"
        headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {env('TMDB_API_KEY')}",
            }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
from rest_framework.permissions import AllowAny
class MovieDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            provider = request.GET.get('provider', 'yts')
            movie_data = MovieProvider.get_movie_details(id, provider)
            
            if not movie_data:
                return Response({"error": "No movie found"}, status=status.HTTP_404_NOT_FOUND)
                
            return Response({"movie": movie_data})
            
        except requests.exceptions.RequestException as e:
            return Response({"error": f"API error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class MovieCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get_movie(self, movie_id):
        try:
            return Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return None

    def get(self, request, movie_id=None):
        if movie_id:
            movie = self.get_movie(movie_id)
            if not movie:
                return Response([], status=status.HTTP_200_OK)

            comments = movie.comments.all()
            data = [{
                'id': comment.id,
                'comment': comment.content,
                'username': comment.user.username,
                'date': comment.created_at,
            } for comment in comments]
            return Response(data)
        else:
            # GET /comments
            comments = Comment.objects.all().order_by('-created_at')
            data = [{
                'id': comment.id,
                'comment': comment.content,
                'username': comment.user.username,
                'date': comment.created_at,
            } for comment in comments]
            return Response(data)

    def post(self, request, movie_id=None):
        if movie_id:
            movie = self.get_movie(movie_id)
            if not movie:
                try:
                    provider = request.data.get('provider', 'yts')
                    print("Provider:", provider)
                    
                    movie_data = MovieProvider.get_movie_details(movie_id, provider)
                    print("Movie Data:", movie_data)
                    
                    if movie_data:
                        movie_create_interface = {
                            'title': movie_data.get('title'),
                            'imdb_code': movie_data.get('imdb_code', ''),
                            'genre': movie_data.get('genre', 'Unknown'),
                            'year': movie_data.get('year', 0),
                            'is_watched': False,
                            'is_favorite': False,
                            'rating': movie_data.get('rating', 0.0)
                        }
                        movie = Movie.objects.create(id=movie_id, **movie_create_interface)
                except Exception as e:
                    return Response({'error': f"Error creating movie: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            content = request.data.get('content')
            if not content:
                return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                comment = Comment.objects.create(
                    movie=movie,
                    user=request.user,
                    content=content
                )
                return Response({
                    'id': comment.id,
                    'comment': comment.content,
                    'username': comment.user.username,
                    'date': comment.created_at
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': f"Error creating comment: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            content = request.data.get('content')
            movie_id = request.data.get('movie_id')
            if not content or not movie_id:
                return Response({'error': 'Content and movie_id are required'}, status=status.HTTP_400_BAD_REQUEST)

            movie = self.get_movie(movie_id)
            if not movie:
                return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

            try:
                comment = Comment.objects.create(
                    movie=movie,
                    user=request.user,
                    content=content
                )
                return Response({
                    'id': comment.id,
                    'comment': comment.content,
                    'username': comment.user.username,
                    'date': comment.created_at
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': f"Error creating comment: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_comment(self, comment_id, user):
        """
        Fetches a comment by its ID and checks if the user has permission to access it.
        """
        try:
            comment = Comment.objects.get(id=comment_id)
            if comment.user != user:
                raise PermissionError("You are not authorized to access this comment.")
            return comment
        except Comment.DoesNotExist:
            return None

    def get(self, request, comment_id):
        """
        GET /comments/:id
        Returns comment, author’s username, comment id, date posted.
        """
        comment = self.get_comment(comment_id, request.user)
        if not comment:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'id': comment.id,
            'comment': comment.content,
            'username': comment.user.username,
            'date': comment.created_at
        }, status=status.HTTP_200_OK)

    def patch(self, request, comment_id):
        """
        PATCH /comments/:id
        Expected data : comment, username
        """
        try:
            comment = self.get_comment(comment_id, request.user)
            if not comment:
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

            content = request.data.get('content')
            if not content:
                return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

            comment.content = content
            comment.save()
            return Response({
                'id': comment.id,
                'comment': comment.content,
                'username': comment.user.username,
                'date': comment.updated_at
            }, status=status.HTTP_200_OK)
        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, comment_id):
        """
        DELETE /comments/:id
        """
        try:
            comment = self.get_comment(comment_id, request.user)
            if not comment:
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

            comment.delete()
            return Response({'message': 'Comment deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
    # permission_classes = [IsAuthenticated]

    def get_comment(self, comment_id, user):
        """
        Fetches a comment by its ID and checks if the user has permission to access it.
        """
        try:
            comment = Comment.objects.get(id=comment_id)
            if comment.user != user:
                raise PermissionError("You are not authorized to access this comment.")
            return comment
        except Comment.DoesNotExist:
            return None

    def put(self, request, comment_id):
        """
        Updates an existing comment.
        """
        try:
            comment = self.get_comment(comment_id, request.user)
            if not comment:
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

            content = request.data.get('content')
            if not content:
                return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

            comment.content = content
            comment.save()
            return Response({
                'id': comment.id,
                'comment': comment.content,
                'username': comment.user.username,
                'date': comment.updated_at
            }, status=status.HTTP_200_OK)
        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, comment_id):
        """
        Deletes an existing comment.
        """
        try:
            comment = self.get_comment(comment_id, request.user)
            if not comment:
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

            comment.delete()
            return Response({'message': 'Comment deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except PermissionError as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)