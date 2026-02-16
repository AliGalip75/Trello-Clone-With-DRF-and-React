# users/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication

class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Cookie ismini kontrol et (views.py ile aynı olmalı)
        raw_token = request.COOKIES.get('access_token')

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except:
            # Token geçersizse veya süresi dolmuşsa 401 verdirmek için None dönüyoruz
            return None