from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Notification, EmailTemplate
from .serializers import (
    NotificationSerializer, NotificationCreateSerializer,
    NotificationMarkReadSerializer, EmailTemplateSerializer
)
from apps.accounts.permissions import IsAdminRole


class NotificationListView(generics.ListAPIView):
    """List notifications for authenticated user"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        # Filter by notification type
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        return queryset


class NotificationDetailView(generics.RetrieveAPIView):
    """Retrieve single notification"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkReadView(APIView):
    """Mark notifications as read"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = NotificationMarkReadSerializer(data=request.data)
        if serializer.is_valid():
            notification_ids = serializer.validated_data['notification_ids']
            
            # Update notifications
            updated_count = Notification.objects.filter(
                id__in=notification_ids,
                user=request.user,
                is_read=False
            ).update(
                is_read=True,
                read_at=timezone.now()
            )
            
            return Response(
                {'message': f'{updated_count} notifications marked as read'},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationMarkAllReadView(APIView):
    """Mark all notifications as read"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(
            is_read=True,
            read_at=timezone.now()
        )
        
        return Response(
            {'message': f'{updated_count} notifications marked as read'},
            status=status.HTTP_200_OK
        )


class NotificationUnreadCountView(APIView):
    """Get unread notification count"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        
        return Response({'unread_count': count}, status=status.HTTP_200_OK)


class EmailTemplateListView(generics.ListAPIView):
    """List email templates (admin only)"""
    permission_classes = [IsAdminRole]
    serializer_class = EmailTemplateSerializer
    queryset = EmailTemplate.objects.all()


class EmailTemplateDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve and update email template (admin only)"""
    permission_classes = [IsAdminRole]
    serializer_class = EmailTemplateSerializer
    queryset = EmailTemplate.objects.all()
