from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from movies.models import Movie


# Disable CSRF protection for this example (use cautiously in production)
@csrf_exempt
def list(request):
    if request.method == 'GET':
        try:
            # data = json.loads(request.body)
            movies = Movie.objects.all().values('id', 'title', 'genre')
            movies_list = []
            for movie in movies:
                movies_list.append(movie)
            response_data = {"data": movies_list}
            return JsonResponse(response_data, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"},
                            status=405)


def add(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON body
            # Process the data
            response_data = {"message": "Data received", "data": data}
            return JsonResponse(response_data, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    else:
        return JsonResponse({"error": "Only POST requests are allowed"},
                            status=405)
