from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Message

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    recipient_email = serializers.CharField(source='recipient.email', read_only=True)
    recipient_lookup = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_email', 'recipient', 'recipient_email',
            'recipient_lookup', 'application', 'subject', 'body', 'is_read', 'created_at'
        ]
        read_only_fields = ['sender', 'created_at']

    def validate(self, attrs):
        recipient = attrs.get('recipient')
        recipient_lookup = attrs.get('recipient_lookup')

        if not recipient and not recipient_lookup:
            raise serializers.ValidationError({'recipient': 'Recipient is required.'})

        if recipient_lookup:
            try:
                recipient = User.objects.get(email=recipient_lookup)
            except User.DoesNotExist:
                raise serializers.ValidationError({'recipient_lookup': 'Recipient email not found.'})
            attrs['recipient'] = recipient

        return attrs
