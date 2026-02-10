from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, CheckerProfile, Role, Permission, RolePermission


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


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name')


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'description')
    search_fields = ('code', 'description')


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'permission')
    list_filter = ('role',)
