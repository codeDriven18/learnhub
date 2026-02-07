from django.db import models
from apps.accounts.models import User


class NotificationType(models.TextChoices):
    APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED', 'Application Submitted'
    APPLICATION_UPDATED = 'APPLICATION_UPDATED', 'Application Updated'
    DOCUMENT_VERIFIED = 'DOCUMENT_VERIFIED', 'Document Verified'
    DOCUMENT_REJECTED = 'DOCUMENT_REJECTED', 'Document Rejected'
    REVIEW_ASSIGNED = 'REVIEW_ASSIGNED', 'Review Assigned'
    REVIEW_COMPLETED = 'REVIEW_COMPLETED', 'Review Completed'
    STATUS_CHANGED = 'STATUS_CHANGED', 'Status Changed'
    RECOMMENDATION_REQUEST = 'RECOMMENDATION_REQUEST', 'Recommendation Request'
    PASSED = 'PASSED', 'Application Passed'
    REJECTED = 'REJECTED', 'Application Rejected'
    NEEDS_REVISION = 'NEEDS_REVISION', 'Revision Needed'
    GENERAL = 'GENERAL', 'General Notification'


class NotificationPriority(models.TextChoices):
    LOW = 'LOW', 'Low'
    MEDIUM = 'MEDIUM', 'Medium'
    HIGH = 'HIGH', 'High'
    URGENT = 'URGENT', 'Urgent'


class Notification(models.Model):
    """In-platform notifications for users"""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices
    )
    
    priority = models.CharField(
        max_length=10,
        choices=NotificationPriority.choices,
        default=NotificationPriority.MEDIUM
    )
    
    # Content
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Links
    action_url = models.CharField(max_length=500, blank=True)
    action_label = models.CharField(max_length=100, blank=True)
    
    # References
    application_id = models.IntegerField(null=True, blank=True)
    document_id = models.IntegerField(null=True, blank=True)
    review_id = models.IntegerField(null=True, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    is_sent_email = models.BooleanField(default=False)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['notification_type']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"


class EmailTemplate(models.Model):
    """Email templates for different notification types"""
    
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        unique=True
    )
    
    subject = models.CharField(max_length=255)
    body_html = models.TextField(help_text="HTML email body with template variables")
    body_text = models.TextField(help_text="Plain text version")
    
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'email_templates'
    
    def __str__(self):
        return f"{self.get_notification_type_display()} Template"
