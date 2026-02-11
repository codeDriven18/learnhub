from rest_framework import generics, status, permissions, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .serializers import (
    RegisterSerializer, UserSerializer, UserDetailSerializer,
    StudentProfileSerializer, CheckerProfileSerializer, ChangePasswordSerializer,
    CustomTokenObtainPairSerializer, AdminUserCreateSerializer,
    RoleSerializer, PermissionSerializer, RolePermissionSerializer,
    UserPreferenceSerializer, ProfilePhotoSerializer, ChangeEmailSerializer,
    UserSessionSerializer, CustomTokenRefreshSerializer
)
from .permissions import IsAdminRole
from .models import StudentProfile, CheckerProfile, Role, Permission, RolePermission, UserPreference, UserSession

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that uses email instead of username"""
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer


class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserDetailSerializer
    
    def get_object(self):
        return self.request.user


class StudentProfileView(generics.RetrieveUpdateAPIView):
    """Get and update student profile"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer
    
    def get_object(self):
        user = self.request.user
        profile, created = StudentProfile.objects.get_or_create(user=user)
        return profile


class CheckerProfileView(generics.RetrieveUpdateAPIView):
    """Get and update checker profile"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CheckerProfileSerializer
    
    def get_object(self):
        user = self.request.user
        profile, created = CheckerProfile.objects.get_or_create(user=user)
        return profile


class ChangePasswordView(APIView):
    """Change user password"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeEmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.email = serializer.validated_data['new_email']
            request.user.save(update_fields=['email'])
            return Response({'message': 'Email updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfilePhotoView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfilePhotoSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_object(self):
        return self.request.user


class UserPreferenceView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserPreferenceSerializer

    def get_object(self):
        preferences, _ = UserPreference.objects.get_or_create(user=self.request.user)
        return preferences


class UserSessionListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSessionSerializer

    def get_queryset(self):
        return UserSession.objects.filter(user=self.request.user)


class UserSessionRevokeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(UserSession, id=session_id, user=request.user)
        session.revoke()
        return Response({'message': 'Session revoked'}, status=status.HTTP_200_OK)


class UserSessionRevokeOthersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_session_id = request.data.get('current_session_id')
        sessions = UserSession.objects.filter(user=request.user, is_active=True)
        if current_session_id:
            sessions = sessions.exclude(id=current_session_id)
        count = 0
        for session in sessions:
            session.revoke()
            count += 1
        return Response({'message': f'Revoked {count} sessions'}, status=status.HTTP_200_OK)


class UserListView(generics.ListCreateAPIView):
    """List and create users (admin only)"""
    queryset = User.objects.all()
    permission_classes = [IsAdminRole]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdminUserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role__code=role)
        return queryset


class RoleListView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminRole]


class PermissionListView(generics.ListCreateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAdminRole]


class RolePermissionListView(generics.ListCreateAPIView):
    queryset = RolePermission.objects.select_related('role', 'permission').all()
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAdminRole]
