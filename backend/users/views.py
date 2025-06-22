from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import generics
from django.contrib.auth import get_user_model
from rest_framework.parsers import JSONParser
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from .serializers import PasswordResetSerializer, PasswordResetConfirmSerializer, ChangePasswordSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated


class UserRegistrationView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            response = Response({
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                path='/auth/token/refresh',
                secure=False,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60
            )

            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                samesite='Lax',
                secure=False,
                max_age=15 * 60,
                path='/',
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        user_profile_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_picture': user.profile_picture_url if hasattr(user, 'profile_picture_url') and user.profile_picture_url else None
        }

        return Response(user_profile_data, status=status.HTTP_200_OK)
    

class UserLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            
            if user:
                refresh = RefreshToken.for_user(user)

                response = Response({
                    'message': 'Login successful'
                })
   
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    path='/auth/token/refresh',
                    secure=False,
                    samesite='Lax',
                    max_age=7 * 24 * 60 * 60
                )

                response.set_cookie(
                    key='access_token',
                    value=str(refresh.access_token),
                    samesite='Lax',
                    httponly=True,
                    secure=False,
                    max_age=15 * 60,
                    path='/'
                )

                return response

            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                # Try to blacklist the refresh token
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except Exception as blacklist_error:
                    # If blacklisting fails, log but continue with logout
                    print(f"Token blacklist failed (continuing): {blacklist_error}")
        except Exception as e:
            # If anything fails, continue with logout
            print(f"Logout token handling failed: {e}")
        
        response = Response()
        response.delete_cookie('refresh_token', path='/auth/token/refresh')
        response.delete_cookie('access_token', path='/')
        response.data = {'message': 'Logout successful'}
        return response




class CookieTokenRefreshView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        print("refresh Token: ", refresh_token)
        
        if not refresh_token:
            response = Response({'message': 'No refresh token'}, status=401)
            response.delete_cookie('access_token', path='/')
            response.delete_cookie('refresh_token', path='/')
            return response
            
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            response = Response({
                'message': 'Token refresh successful'
            })
            
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                samesite='Lax',
                secure=False,
                max_age=60,
                path='/'
            )
            
            return response
            
        except TokenError as e:
            # This catches specific token validation errors
            response = Response({'message': str(e)}, status=401)
            response.delete_cookie('access_token', path='/')
            response.delete_cookie('refresh_token', path='/')
            return response

        except Exception as e:
            response = Response({'message': 'Invalid token'}, status=401)
            response.delete_cookie('access_token', path='/')
            response.delete_cookie('refresh_token', path='/')
            return response


User = get_user_model()

class UserListView(APIView):
    def get(self, request):
        users = User.objects.all().values(
            'id', 
            'username', 
            'first_name', 
            'last_name',
            'profile_picture_url'
        )
        user_list = []
        for user in users:
            user_data = {
                'id': str(user['id']),
                'username': user['username'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'profile_picture': user['profile_picture_url']
            }
            user_list.append(user_data)
            
        return Response(user_list, status=status.HTTP_200_OK)


class UserManagementView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            is_own_profile = request.user.is_authenticated and request.user.id == user.id
            
            data = {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_picture': user.profile_picture_url if hasattr(user, 'profile_picture_url') and user.profile_picture_url else None,
                'is_own_profile': is_own_profile
            }
            if is_own_profile:
                data['email'] = user.email
            
            return Response(data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
       try:
           user = User.objects.get(id=id)
           if request.user != user:
               return Response({'error': 'Permission denied'}, status=403)
           data = request.data
           if 'username' in data:
               user.username = data['username']
           if 'email' in data:
               user.email = data['email']
           if 'first_name' in data:
               user.first_name = data['first_name']
           if 'last_name' in data:
               user.last_name = data['last_name']
           if 'password' in data:
               user.set_password(data['password'])
           if 'profile_picture' in data:
               timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
               unique_name = f"{timestamp}_{uuid.uuid4().hex[:8]}_{data['profile_picture'].name}"
               file_name = default_storage.save(f'profile_pictures/{unique_name}', data['profile_picture'])
               user.profile_picture_url = f"{settings.AWS_S3_ENDPOINT_URL}/z-tube/profile_pictures/{unique_name}"

           user.save()
           return Response({'message': 'User updated successfully'}, status=200)

       except User.DoesNotExist:
           return Response({'error': 'User not found'}, status=404)
       except Exception as e:
           return Response({'error': str(e)}, status=400)

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            if request.user != user and not request.user.is_staff:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                token = default_token_generator.make_token(user)
                
                reset_url = f"{settings.FRONTEND_URL}/reset-password/confirm?token={token}&user={user.id}"
                
                subject = 'Password Reset Request'
                from_email = f"HyperTube <noreply@yourapp.com>"
                
                send_mail(
                    subject=subject,
                    message=f'Click this link to reset your password: {reset_url}',
                    from_email=from_email,
                    recipient_list=[user.email],
                )
                return Response({"message": "Password reset email sent"})
            except User.DoesNotExist:
                return Response({"message": "Password reset email sent"})  # Same message for security
        return Response(serializer.errors, status=400)


class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)

        if serializer.is_valid():
            token = serializer.validated_data['token']
            user_id = request.data.get('user')
            
            try:
                user = User.objects.get(id=user_id)
                if default_token_generator.check_token(user, token):
                    user.set_password(serializer.validated_data['password'])
                    user.save()
                    return Response({"message": "Password reset successful"})
                return Response({"error": "Invalid token"}, status=400)
            except User.DoesNotExist:
                return Response({"error": "Invalid user"}, status=400)
        return Response(serializer.errors, status=400)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.validated_data['old_password']):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password changed successfully'})
            return Response({'error': 'Incorrect old password'}, status=400)
        return Response(serializer.errors, status=400)