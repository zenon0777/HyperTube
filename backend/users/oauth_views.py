from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from django.shortcuts import redirect
import requests
import secrets
import string
from urllib.parse import urlencode

User = get_user_model()

class OAuthLoginView(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request, provider):
        """Initiate OAuth flow by redirecting to provider"""
        state = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
        request.session['oauth_state'] = state
        
        if provider == 'google':
            auth_url = self._get_google_auth_url(state)
        elif provider == 'github':
            auth_url = self._get_github_auth_url(state)
        elif provider == '42':
            auth_url = self._get_42_auth_url(state)
        elif provider == 'discord':
            auth_url = self._get_discord_auth_url(state)
        else:
            return Response({'error': 'Unsupported provider'}, status=status.HTTP_400_BAD_REQUEST)
        
        return redirect(auth_url)
    
    def _get_google_auth_url(self, state):
        params = {
            'client_id': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id'],
            'redirect_uri': f"{settings.BACKEND_URL or 'http://localhost:8000'}/auth/google/callback/",
            'scope': 'openid email profile',
            'response_type': 'code',
            'state': state,
        }
        return f"https://accounts.google.com/o/oauth2/auth?{urlencode(params)}"
    
    def _get_github_auth_url(self, state):
        params = {
            'client_id': settings.SOCIALACCOUNT_PROVIDERS['github']['APP']['client_id'],
            'redirect_uri': f"{settings.BACKEND_URL or 'http://localhost:8000'}/auth/github/callback/",            'scope': 'user:email',
            'state': state,
        }
        return f"https://github.com/login/oauth/authorize?{urlencode(params)}"
    
    def _get_42_auth_url(self, state):
        params = {
            'client_id': settings.OAUTH_42_CLIENT_ID,
            'redirect_uri': f"{settings.BACKEND_URL or 'http://localhost:8000'}/auth/42/callback/",
            'scope': 'public',
            'response_type': 'code',
            'state': state,
        }
        return f"https://api.intra.42.fr/oauth/authorize?{urlencode(params)}"
    
    def _get_discord_auth_url(self, state):
        params = {
            'client_id': settings.DISCORD_CLIENT_ID,
            'redirect_uri': f"{settings.BACKEND_URL or 'http://localhost:8000'}/auth/discord/callback/",
            'scope': 'identify email',
            'response_type': 'code',
            'state': state,
        }
        return f"https://discord.com/api/oauth2/authorize?{urlencode(params)}"


class OAuthCallbackView(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request, provider):
        """Handle OAuth callback and create/login user"""
        
        code = request.GET.get('code')
        state = request.GET.get('state')
          # Verify state parameter
        session_state = request.session.get('oauth_state')
        if not state or state != session_state:
            return redirect(f"{settings.FRONTEND_URL}/login?error=invalid_state")
        
        if not code:
            return redirect(f"{settings.FRONTEND_URL}/login?error=no_code")
        
        try:
            if provider == 'google':
                user_data = self._handle_google_callback(code)
            elif provider == 'github':
                user_data = self._handle_github_callback(code)
            elif provider == '42':
                user_data = self._handle_42_callback(code)
            elif provider == 'discord':
                user_data = self._handle_discord_callback(code)
            else:
                return redirect(f"{settings.FRONTEND_URL}/login?error=invalid_provider")
            
            # Create or get user
            user = self._get_or_create_user(user_data, provider)

            refresh = RefreshToken.for_user(user)

            response = redirect(f"{settings.FRONTEND_URL}/auth/success")

            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                path='/auth/token/refresh',
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60
            )
            
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                samesite='Lax',
                secure=not settings.DEBUG,
                max_age=15 * 60,
                path='/',
            )
            
            return response
            
        except Exception as e:
            print(f"OAuth error: {e}")
            return redirect(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
    
    def _handle_google_callback(self, code):
        """Handle Google OAuth callback"""
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            'client_id': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id'],
            'client_secret': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret'],
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': f"{settings.BACKEND_URL or 'http://localhost:8000'}/auth/google/callback/",
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        token_json = token_response.json()

        user_info_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={token_json['access_token']}"
        user_response = requests.get(user_info_url)
        user_response.raise_for_status()
        
        return user_response.json()
    
    def _handle_github_callback(self, code):
        """Handle GitHub OAuth callback"""
        token_url = "https://github.com/login/oauth/access_token"
        token_data = {
            'client_id': settings.SOCIALACCOUNT_PROVIDERS['github']['APP']['client_id'],
            'client_secret': settings.SOCIALACCOUNT_PROVIDERS['github']['APP']['secret'],
            'code': code,
        }
        
        token_response = requests.post(token_url, data=token_data, headers={'Accept': 'application/json'})
        token_response.raise_for_status()
        token_json = token_response.json()

        user_info_url = "https://api.github.com/user"
        headers = {'Authorization': f"token {token_json['access_token']}"}
        user_response = requests.get(user_info_url, headers=headers)
        user_response.raise_for_status()
        user_data = user_response.json()
        
        # Get user email if not public
        if not user_data.get('email'):
            email_response = requests.get("https://api.github.com/user/emails", headers=headers)
            email_response.raise_for_status()
            emails = email_response.json()
            primary_email = next((email for email in emails if email['primary']), None)
            if primary_email:
                user_data['email'] = primary_email['email']
        
        return user_data

    def _handle_42_callback(self, code):
        """Handle 42 School OAuth callback"""
        token_url = "https://api.intra.42.fr/oauth/token"
        token_data = {
            'client_id': settings.OAUTH_42_CLIENT_ID,
            'client_secret': settings.OAUTH_42_CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': f"{settings.BACKEND_URL or 'http://localhost:8000'}/auth/42/callback/",
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        token_json = token_response.json()

        user_info_url = "https://api.intra.42.fr/v2/me"
        headers = {'Authorization': f"Bearer {token_json['access_token']}"}
        user_response = requests.get(user_info_url, headers=headers)
        user_response.raise_for_status()
        
        return user_response.json()
    
    def _handle_discord_callback(self, code):
        """Handle Discord OAuth callback"""
        token_url = "https://discord.com/api/oauth2/token"
        token_data = {
            'client_id': settings.DISCORD_CLIENT_ID,
            'client_secret': settings.DISCORD_CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': f"{settings.BACKEND_URL or 'http://localhost:8000'}/auth/discord/callback/",
        }
        
        token_response = requests.post(token_url, data=token_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
        token_response.raise_for_status()
        token_json = token_response.json()
        

        user_info_url = "https://discord.com/api/users/@me"
        headers = {'Authorization': f"Bearer {token_json['access_token']}"}
        user_response = requests.get(user_info_url, headers=headers)
        user_response.raise_for_status()
        
        return user_response.json()
    
    def _get_or_create_user(self, user_data, provider):
        """Create or get existing user from OAuth data"""
        if provider == 'google':
            email = user_data.get('email')
            username = user_data.get('email', '').split('@')[0]
            first_name = user_data.get('given_name', '')
            last_name = user_data.get('family_name', '')
            profile_picture_url = user_data.get('picture', '')
            # provider_id = user_data.get('id')
        elif provider == 'github':
            email = user_data.get('email')
            username = user_data.get('login', '')
            name_parts = user_data.get('name', '').split(' ', 1)
            first_name = name_parts[0] if name_parts else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            profile_picture_url = user_data.get('avatar_url', '')
            # provider_id = str(user_data.get('id'))
            
        elif provider == '42':
            email = user_data.get('email')
            username = user_data.get('login', '')
            first_name = user_data.get('first_name', '')
            last_name = user_data.get('last_name', '')
            profile_picture_url = user_data.get('image', {}).get('link', '') if user_data.get('image') else ''
            # provider_id = str(user_data.get('id'))
            
        elif provider == 'discord':
            email = user_data.get('email')
            username = user_data.get('username', '')
            # Discord doesn't provide separate first/last names
            global_name = user_data.get('global_name', '')
            if global_name:
                name_parts = global_name.split(' ', 1)
                first_name = name_parts[0] if name_parts else ''
                last_name = name_parts[1] if len(name_parts) > 1 else ''
            else:
                first_name = username
                last_name = ''

            avatar_hash = user_data.get('avatar')
            if avatar_hash:
                profile_picture_url = f"https://cdn.discordapp.com/avatars/{user_data.get('id')}/{avatar_hash}.png"
            else:
                profile_picture_url = ''
            # provider_id = str(user_data.get('id'))
        
        if not email:
            raise ValueError("Email is required for OAuth registration")

        try:
            user = User.objects.get(email=email)
            # Update profile picture if not set
            if not user.profile_picture_url and profile_picture_url:
                user.profile_picture_url = profile_picture_url
                user.save()
            return user
        except User.DoesNotExist:
            pass
        
        # Create new user
        # Ensure username is unique
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        
        user = User.objects.create_user(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            profile_picture_url=profile_picture_url,
            password=None
        )
        
        return user
