from rest_framework import serializers
from .models import Log, SystemEvent, FeatureFlag, SystemSetting


class LogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source='actor_user.email', read_only=True)

    class Meta:
        model = Log
        fields = [
            'id', 'actor_user', 'actor_email', 'action', 'entity_type', 'entity_id',
            'ip_address', 'user_agent', 'created_at'
        ]


class SystemEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemEvent
        fields = ['id', 'event_type', 'payload', 'created_at']


class FeatureFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureFlag
        fields = ['id', 'key', 'name', 'description', 'is_enabled', 'updated_at']


class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ['id', 'key', 'value', 'updated_at']
