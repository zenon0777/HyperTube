from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.conf import settings

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Get the token from cookies instead of Authorization header
        access_token = request.COOKIES.get('access_token')
        print('access_token =', access_token)
        refresh_token = request.COOKIES.get('refresh_token')
        print('refresh_token =', refresh_token)
       
        
        print(access_token)
        if not access_token:
            return None
            
        try:
            # Validate token and get user
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
            
        except InvalidToken:
            raise AuthenticationFailed('Invalid token')
        except Exception as e:
            raise AuthenticationFailed(str(e))