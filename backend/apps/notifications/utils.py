"""
Utility functions for creating and sending notifications
"""
from django.utils import timezone
from .models import Notification, NotificationType, NotificationPriority


def create_notification(
    user,
    notification_type,
    title,
    message,
    priority=NotificationPriority.MEDIUM,
    action_url='',
    action_label='',
    application_id=None,
    document_id=None,
    review_id=None,
    send_email=True
):
    """
    Create a notification for a user
    
    Args:
        user: User object to notify
        notification_type: Type of notification (from NotificationType)
        title: Notification title
        message: Notification message
        priority: Priority level
        action_url: Optional URL for action button
        action_label: Optional label for action button
        application_id: Optional related application ID
        document_id: Optional related document ID
        review_id: Optional related review ID
        send_email: Whether to send email notification
    
    Returns:
        Notification object
    """
    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        priority=priority,
        title=title,
        message=message,
        action_url=action_url,
        action_label=action_label,
        application_id=application_id,
        document_id=document_id,
        review_id=review_id
    )
    
    # TODO: Send email notification
    if send_email:
        # send_email_notification(notification)
        pass
    
    return notification


def send_email_notification(notification):
    """
    Send email notification based on notification object
    
    Args:
        notification: Notification object
    """
    from django.core.mail import send_mail
    from django.conf import settings
    from .models import EmailTemplate
    
    try:
        template = EmailTemplate.objects.get(
            notification_type=notification.notification_type,
            is_active=True
        )
        
        # Render template with context
        context = {
            'user': notification.user,
            'title': notification.title,
            'message': notification.message,
            'action_url': notification.action_url,
            'action_label': notification.action_label,
        }
        
        # Simple template rendering (could use Django templates for more complex)
        subject = template.subject
        body = template.body_text.format(**context)
        
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[notification.user.email],
            fail_silently=False,
        )
        
        notification.is_sent_email = True
        notification.email_sent_at = timezone.now()
        notification.save()
        
    except EmailTemplate.DoesNotExist:
        # No template found, skip email
        pass
    except Exception as e:
        # Log error
        print(f"Error sending email notification: {e}")
