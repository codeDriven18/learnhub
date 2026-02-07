from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserProfileView, StudentProfileView,
    CheckerProfileView, ChangePasswordView, UserListView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/student/', StudentProfileView.as_view(), name='student-profile'),
    path('profile/checker/', CheckerProfileView.as_view(), name='checker-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # User Management (Admin)
    path('users/', UserListView.as_view(), name='user-list'),
]
