from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer
from datetime import timedelta
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.views import APIView

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    Endpoint for creating a new user.
    Path: /api/auth/register/
    Method: POST
    Permissions: AllowAny (Public)
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) 
    serializer_class = RegisterSerializer
    
# 1. COOKIE BASAN LOGIN VIEW
class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Önce standart işlemi yap (Token'ları üret)
        response = super().post(request, *args, **kwargs)
        
        # Tokenları al
        access_token = response.data['access']
        refresh_token = response.data['refresh']
        
        # Ayarları dinamik al
        simple_jwt_settings = getattr(settings, 'SIMPLE_JWT', {})
        access_token_lifetime = simple_jwt_settings.get('ACCESS_TOKEN_LIFETIME', timedelta(minutes=5))
        refresh_token_lifetime = simple_jwt_settings.get('REFRESH_TOKEN_LIFETIME', timedelta(days=1))

        # Cookie Ayarları (Prodüksiyonda 'secure=True' olmalı!)
        # samesite='Lax' -> CSRF koruması için önemli
        # httponly=True -> JavaScript okuyamasın diye (XSS Koruması)
        
        # Access Token Cookie
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=not settings.DEBUG, # HTTPS kullanıyorsan True yap! (Localhostta False kalabilir)
            samesite='Lax',
            path='/', # Önemli: Cookie tüm sitede geçerli olsun
            max_age=int(access_token_lifetime.total_seconds())
        )
        
        # Refresh Token Cookie
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False, # HTTPS ise True
            samesite='Lax',
            path='/', # Genelde sadece '/api/token/refresh/' için de kısıtlanabilir ama şimdilik '/' kalsın
            max_age=int(refresh_token_lifetime.total_seconds())
        )
        
        # Cevaptan tokenları çıkar (sadece cookie'de olsunlar)
        del response.data['access']
        del response.data['refresh']
        
        return response
   
# 2. COOKIE'DEN REFRESH YAPAN VIEW 
class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Cookie'den refresh token'ı alıp serializer'a verelim
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            request.data['refresh'] = refresh_token
        
        try:
            response = super().post(request, *args, **kwargs)
            
            # Yeni Access Token'ı tekrar cookie'ye yaz
            access_token = response.data['access']
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=5 * 60
            )
            return response
            
        except (InvalidToken, TokenError):
            return Response({"detail": "Token geçersiz"}, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    # Giriş yapmamış adam çıkış yapamaz
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request):
        response = Response({"detail": "Başarıyla çıkış yapıldı."}, status=status.HTTP_200_OK)
        
        # Cookie'leri öldür
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Endpoint for retrieving and updating the authenticated user's profile.
    Path: /api/auth/me/
    Method: GET, PATCH, PUT
    Permissions: IsAuthenticated (Requires a valid JWT Access Token)
    """
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,) 

    def get_object(self):
        """
        Override get_object to return the currently authenticated user.
        This avoids needing to pass an ID (like /users/1/) in the URL.
        """
        return self.request.user
    
class UserListView(generics.ListAPIView):
    """
    Endpoint to retrieve a list of all users.
    Path: /api/auth/users/
    Method: GET
    Permissions: IsAdminUser (Only staff/superusers can access)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)