# users/authentication.py

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # 1. Önce Cookie'den access_token'ı al
        raw_token = request.COOKIES.get('access_token')
        
        # 2. Eğer cookie yoksa, belki header'da vardır? (Standart kontrolü yap)
        if raw_token is None:
            return super().authenticate(request)
        
        # 3. Token varsa doğrula
        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except AuthenticationFailed:
             # Token geçersizse veya süresi dolmuşsa sessizce None dön
             # (Böylece DRF, "Login olmadın" diyebilir)
            return None