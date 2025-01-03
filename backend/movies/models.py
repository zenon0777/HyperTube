from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
class Movie(models.Model):
    title = models.CharField(max_length=255)
    imdb_code = models.CharField(max_length=255, default='')
    genre = models.CharField(max_length=255)
    year = models.IntegerField()
    is_watched = models.BooleanField(default=False)
    is_favorite = models.BooleanField(default=False)
    rating = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at'] 