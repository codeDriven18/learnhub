from django.contrib import admin
from .models import Application, ApplicationTimeline


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'program_name', 'status', 'current_stage', 'assigned_checker', 'submitted_at')
    list_filter = ('status', 'current_stage', 'academic_year')
    search_fields = ('student__email', 'student__first_name', 'student__last_name', 'program_name')
    raw_id_fields = ('student', 'assigned_checker')
    date_hierarchy = 'created_at'


@admin.register(ApplicationTimeline)
class ApplicationTimelineAdmin(admin.ModelAdmin):
    list_display = ('application', 'event_type', 'user', 'created_at')
    list_filter = ('event_type',)
    search_fields = ('application__id', 'description')
    raw_id_fields = ('application', 'user')
    date_hierarchy = 'created_at'
