from django.db import models


class Movie(models.Model):
    is_watched = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    comments = models.JSONField(default=list, blank=True)
    movie_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='movies'
    )

    def __str__(self):
        return self.movie_id
