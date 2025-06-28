from django.db import models
from django.conf import settings


class Movie(models.Model):
    is_watched = models.BooleanField(default=False)
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    movie_id = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.movie_id

class MoviComment(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment #{self.id} by {self.user.username} on {self.movie.movie_id}"