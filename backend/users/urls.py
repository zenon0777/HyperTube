from django.urls import path
from .views import UserRegistrationView, UserLoginView, LogoutView, CookieTokenRefreshView



urlpatterns = [
	path('auth/register/', UserRegistrationView.as_view(), name='register'),
	path('auth/login/', UserLoginView.as_view(), name='login'),
	path('logout/', LogoutView.as_view(), name='logout'),
	path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
]