from django.contrib import admin
from .models import Notification, EmailTemplate


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'notification_type', 'title', 'priority', 'is_read', 'created_at')
    list_filter = ('notification_type', 'priority', 'is_read', 'is_sent_email')
    search_fields = ('user__email', 'title', 'message')
    raw_id_fields = ('user',)
    date_hierarchy = 'created_at'


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ('notification_type', 'subject', 'is_active', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('subject', 'body_html', 'body_text')
