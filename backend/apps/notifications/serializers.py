from rest_framework import serializers
from .models import Notification, EmailTemplate


class NotificationSerializer(serializers.ModelSerializer):
    """Notification serializer"""
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = [
            'user', 'created_at', 'is_sent_email', 'email_sent_at'
        ]


class NotificationCreateSerializer(serializers.ModelSerializer):
    """Create notification serializer"""
    
    class Meta:
        model = Notification
        fields = [
            'user', 'notification_type', 'priority', 'title', 'message',
            'action_url', 'action_label', 'application_id', 'document_id', 'review_id'
        ]


class NotificationMarkReadSerializer(serializers.Serializer):
    """Mark notifications as read"""
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True
    )


class EmailTemplateSerializer(serializers.ModelSerializer):
    """Email template serializer"""
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = EmailTemplate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
