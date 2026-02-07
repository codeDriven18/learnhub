from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, CheckerProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'is_active', 'is_verified', 'date_joined')
    list_filter = ('role', 'is_active', 'is_verified', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_verified', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nationality', 'institution', 'gpa', 'profile_completed')
    list_filter = ('profile_completed', 'country')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'institution')


@admin.register(CheckerProfile)
class CheckerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'total_reviews', 'active_reviews', 'is_available')
    list_filter = ('is_available', 'department')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'department')
