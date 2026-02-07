from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer, UserSerializer, UserDetailSerializer,
    StudentProfileSerializer, CheckerProfileSerializer, ChangePasswordSerializer
)
from .models import StudentProfile, CheckerProfile

User = get_user_model()


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


class UserListView(generics.ListAPIView):
    """List all users (admin only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)
        return queryset
