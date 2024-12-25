from django.urls import path
from .views import UserRegistrationView, UserLoginView, LogoutView, CookieTokenRefreshView

from .views import UserListView, UserManagementView

urlpatterns = [
	path('auth/register/', UserRegistrationView.as_view(), name='register'),
	path('auth/login/', UserLoginView.as_view(), name='login'),
	path('logout/', LogoutView.as_view(), name='logout'),
	path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),


	path('users/', UserListView.as_view(), name='user-list'),
	path('users/<int:id>/', UserManagementView.as_view(), name='user_manage'),

]