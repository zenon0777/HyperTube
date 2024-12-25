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

class UserRegistrationView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            response =  Response({
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                path='/auth/token/',
                secure=False,
                samesite='Strict',
                max_age=120
            ),

            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                samesite='Lax',
                secure=False,
                max_age=60
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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

                response =  Response({
                    'message': 'Login successful'
                })
   
                response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                path='/auth/token/',
                secure=False,
                samesite='Lax',
                max_age=60*4
                ),

                response.set_cookie(
                    key='access_token',
                    value=str(refresh.access_token),
                    httponly=True,
                    samesite='Lax',
                    secure=False,
                    max_age=60
                )

                return response

            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('refresh_token', path='/auth/token/')
        response.delete_cookie('access_token')
        response.data = {'message': 'Logout successful'}
        return response




class CookieTokenRefreshView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            response = Response({'message': 'No refresh token'}, status=401)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token', path='/auth/token/')
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
                max_age=60
            )
            
            return response

        except TokenError as e:
            # This catches specific token validation errors
            response = Response({'message': str(e)}, status=401)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token', path='/auth/token/')
            return response

        except Exception as e:
            response = Response({'message': 'Invalid token'}, status=401)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token', path='/auth/token/')


User = get_user_model()

class UserListView(APIView):

    def get(self, request):
        users = User.objects.all().values('id', 'username')
        return Response(users, status=status.HTTP_200_OK)


class UserManagementView(APIView):
    parser_classes = [JSONParser]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            data = {
                'username': user.username,
                'email': user.email,
                'profile_picture': user.profile_picture.url if hasattr(user, 'profile_picture') and user.profile_picture else None
            }
            return Response(data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        try:
            user = User.objects.get(id=id)
            if request.user != user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            data = request.data
            if 'username' in data:
                user.username = data['username']
            if 'email' in data:
                user.email = data['email']
            if 'password' in data:
                user.set_password(data['password'])
            if 'profile_picture' in data:
                user.profile_picture = data['profile_picture']

            user.save()
            return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            if request.user != user and not request.user.is_staff:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
