from django.urls import path
from .views import UserRegistrationView, UserLoginView, LogoutView, CookieTokenRefreshView
from .views import UserListView, UserManagementView, UserProfileView
from .views import PasswordResetView, PasswordResetConfirmView, ChangePasswordView
from .oauth_views import OAuthLoginView, OAuthCallbackView

urlpatterns = [
	path('auth/register/', UserRegistrationView.as_view(), name='register'),
	path('auth/me/', UserProfileView.as_view(), name='profile'),
	path('auth/login/', UserLoginView.as_view(), name='login'),
	path('auth/logout/', LogoutView.as_view(), name='logout'),
	path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),

	path('auth/<str:provider>/', OAuthLoginView.as_view(), name='oauth_login'),
	path('auth/<str:provider>/callback/', OAuthCallbackView.as_view(), name='oauth_callback'),

	path('users/', UserListView.as_view(), name='user-list'),
	path('users/<int:id>/', UserManagementView.as_view(), name='user_manage'),

	path('password/reset/', PasswordResetView.as_view(), name='password-reset'),
	path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
	path('password/change/', ChangePasswordView.as_view(), name='change-password'),

]