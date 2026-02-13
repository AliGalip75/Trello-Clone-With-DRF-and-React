from django.urls import path
from .views import (
    RegisterView, 
    UserProfileView, 
    UserListView,
    CookieTokenObtainPairView, 
    CookieTokenRefreshView,  
    LogoutView                
)

urlpatterns = [
    # Register
    path('register/', RegisterView.as_view(), name='register'),
    
    # Login 
    path('login/', CookieTokenObtainPairView.as_view(), name='login'),
    
    # Refresh
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    
    # Logout
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Profile
    path('me/', UserProfileView.as_view(), name='user_profile'),
    
    # User List
    path('users/', UserListView.as_view(), name='user_list'),
]