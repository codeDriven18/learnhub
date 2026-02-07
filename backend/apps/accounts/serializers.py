from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, CheckerProfile, UserRole

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer"""
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'is_verified', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'is_verified']


class StudentProfileSerializer(serializers.ModelSerializer):
    """Student profile serializer"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class CheckerProfileSerializer(serializers.ModelSerializer):
    """Checker profile serializer"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CheckerProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'total_reviews', 'active_reviews']


class RegisterSerializer(serializers.ModelSerializer):
    """Registration serializer for new users"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Only allow student registration through public API
        if attrs.get('role') not in [UserRole.STUDENT, None]:
            attrs['role'] = UserRole.STUDENT
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        
        # Create profile based on role
        if user.is_student():
            StudentProfile.objects.create(user=user)
        elif user.is_checker():
            CheckerProfile.objects.create(user=user)
        
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Change password serializer"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer with profile"""
    student_profile = StudentProfileSerializer(read_only=True)
    checker_profile = CheckerProfileSerializer(read_only=True)
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role',
            'is_active', 'is_verified', 'date_joined', 'last_login',
            'student_profile', 'checker_profile'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'role']
