from django.urls import path
from .views import UserRegistrationView, UserLoginView, LogoutView, CookieTokenRefreshView
from .views import UserListView, UserManagementView
from .views import PasswordResetView, PasswordResetConfirmView, ChangePasswordView

urlpatterns = [
	path('auth/register/', UserRegistrationView.as_view(), name='register'),
	path('auth/login/', UserLoginView.as_view(), name='login'),
	path('logout/', LogoutView.as_view(), name='logout'),
	path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),

	path('users/', UserListView.as_view(), name='user-list'),
	path('users/<int:id>/', UserManagementView.as_view(), name='user_manage'),

	path('password/reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
	path('password/change/', ChangePasswordView.as_view(), name='change-password'),

]