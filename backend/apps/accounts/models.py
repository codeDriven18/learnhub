import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserRole(models.TextChoices):
    STUDENT = 'STUDENT', 'Student'
    CHECKER = 'CHECKER', 'Admission Checker'
    ADMIN = 'ADMIN', 'Administrator'


class Role(models.Model):
    """Role registry for RBAC"""

    code = models.CharField(max_length=20, choices=UserRole.choices, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'roles'
        ordering = ['code']

    def __str__(self):
        return self.name


class Permission(models.Model):
    """Permission registry"""

    code = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255)

    class Meta:
        db_table = 'permissions'
        ordering = ['code']

    def __str__(self):
        return self.code


class RolePermission(models.Model):
    """Role to permission mapping"""

    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='role_permissions')

    class Meta:
        db_table = 'role_permissions'
        unique_together = ['role', 'permission']

    def __str__(self):
        return f"{self.role.code} -> {self.permission.code}"


def get_default_role():
    role, _ = Role.objects.get_or_create(
        code=UserRole.STUDENT,
        defaults={'name': 'Applicant'}
    )
    return role


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        role = extra_fields.pop('role', None)
        if role is None:
            role = get_default_role()
        elif isinstance(role, str):
            role, _ = Role.objects.get_or_create(code=role, defaults={'name': role.title()})
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRole.ADMIN)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model with role-based authentication"""
    
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    profile_photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name='users',
        db_column='role_id',
        null=True,
        blank=True
    )
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
    
    def __str__(self):
        role_code = self.role.code if self.role else 'UNKNOWN'
        return f"{self.email} ({role_code})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def is_student(self):
        return bool(self.role and self.role.code == UserRole.STUDENT)
    
    def is_checker(self):
        return bool(self.role and self.role.code == UserRole.CHECKER)
    
    def is_admin(self):
        return bool(self.role and self.role.code == UserRole.ADMIN)

    def save(self, *args, **kwargs):
        if self.role_id is None:
            self.role = get_default_role()
        super().save(*args, **kwargs)


class StudentProfile(models.Model):
    """Extended profile information for students"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    
    # Personal Information
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    
    # Address
    street_address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state_province = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    
    # Academic Information
    current_education_level = models.CharField(max_length=100, blank=True)
    institution = models.CharField(max_length=255, blank=True)
    field_of_study = models.CharField(max_length=255, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    
    # Profile completion
    profile_completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_profiles'
    
    def __str__(self):
        return f"Profile: {self.user.full_name}"


class CheckerProfile(models.Model):
    """Extended profile information for admission checkers"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='checker_profile')
    
    department = models.CharField(max_length=100, blank=True)
    specialization = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    
    # Performance metrics
    total_reviews = models.IntegerField(default=0)
    active_reviews = models.IntegerField(default=0)
    
    is_available = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'checker_profiles'
    
    def __str__(self):
        return f"Checker: {self.user.full_name}"


class UserPreference(models.Model):
    """User preferences for notifications and localization"""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')

    language = models.CharField(max_length=20, default='en')
    timezone = models.CharField(max_length=50, default='UTC')

    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    marketing_notifications = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_preferences'

    def __str__(self):
        return f"Preferences: {self.user.email}"


class UserSession(models.Model):
    """Track active user sessions for session management"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    refresh_jti = models.CharField(max_length=255, unique=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.CharField(max_length=45, blank=True)
    device_label = models.CharField(max_length=120, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_sessions'
        ordering = ['-last_seen_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['refresh_jti']),
        ]

    def revoke(self):
        self.is_active = False
        self.revoked_at = timezone.now()
        self.save(update_fields=['is_active', 'revoked_at'])
