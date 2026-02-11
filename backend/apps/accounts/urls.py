from django.urls import path
from .views import (
    RegisterView, UserProfileView, StudentProfileView,
    CheckerProfileView, ChangePasswordView, UserListView,
    CustomTokenObtainPairView, RoleListView, PermissionListView, RolePermissionListView,
    ChangeEmailView, ProfilePhotoView, UserPreferenceView,
    UserSessionListView, UserSessionRevokeView, UserSessionRevokeOthersView,
    CustomTokenRefreshView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/student/', StudentProfileView.as_view(), name='student-profile'),
    path('profile/checker/', CheckerProfileView.as_view(), name='checker-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('change-email/', ChangeEmailView.as_view(), name='change-email'),
    path('profile/photo/', ProfilePhotoView.as_view(), name='profile-photo'),
    path('preferences/', UserPreferenceView.as_view(), name='user-preferences'),
    path('sessions/', UserSessionListView.as_view(), name='user-sessions'),
    path('sessions/revoke/<uuid:session_id>/', UserSessionRevokeView.as_view(), name='session-revoke'),
    path('sessions/revoke-others/', UserSessionRevokeOthersView.as_view(), name='session-revoke-others'),
    
    # User Management (Admin)
    path('users/', UserListView.as_view(), name='user-list'),
    path('roles/', RoleListView.as_view(), name='role-list'),
    path('permissions/', PermissionListView.as_view(), name='permission-list'),
    path('role-permissions/', RolePermissionListView.as_view(), name='role-permission-list'),
]
