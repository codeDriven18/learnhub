from django.db import models
from django.core.validators import FileExtensionValidator
from apps.applications.models import Application
import os


class DocumentType(models.TextChoices):
    TRANSCRIPT = 'TRANSCRIPT', 'Academic Transcript'
    TEST_SCORE = 'TEST_SCORE', 'Standardized Test Score'
    ESSAY = 'ESSAY', 'Essay/Personal Statement'
    RECOMMENDATION_LETTER = 'RECOMMENDATION_LETTER', 'Recommendation Letter'
    PORTFOLIO = 'PORTFOLIO', 'Portfolio'
    CERTIFICATE = 'CERTIFICATE', 'Certificate'
    ID_DOCUMENT = 'ID_DOCUMENT', 'ID Document'
    OTHER = 'OTHER', 'Other'


class DocumentStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending Verification'
    VERIFIED = 'VERIFIED', 'Verified'
    REJECTED = 'REJECTED', 'Rejected'
    NEEDS_RESUBMISSION = 'NEEDS_RESUBMISSION', 'Needs Resubmission'


def document_upload_path(instance, filename):
    """Generate upload path: documents/{application_id}/{document_type}/{filename}"""
    return f'documents/{instance.application.id}/{instance.document_type}/{filename}'


class Document(models.Model):
    """Document uploads for applications"""
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    
    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices
    )
    
    # File information
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'jpg', 'jpeg', 'png']
            )
        ]
    )
    file_name = models.CharField(max_length=255)
    file_size = models.IntegerField(help_text="File size in bytes")
    mime_type = models.CharField(max_length=100, blank=True)
    
    # Document details
    title = models.CharField(max_length=255, help_text="Document title/description")
    description = models.TextField(blank=True)

    uploaded_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_documents'
    )
    
    # Verification
    status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING
    )
    verified_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_documents'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    verification_notes = models.TextField(blank=True)
    
    # Metadata
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # For recommendation letters
    is_confidential = models.BooleanField(default=False)
    recommender_name = models.CharField(max_length=255, blank=True)
    recommender_email = models.EmailField(blank=True)
    recommender_title = models.CharField(max_length=255, blank=True)
    recommender_institution = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'documents'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['application', 'document_type']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.get_document_type_display()} - {self.file_name}"
    
    @property
    def file_extension(self):
        return os.path.splitext(self.file_name)[1].lower()
    
    @property
    def is_verified(self):
        return self.status == DocumentStatus.VERIFIED


class RecommendationLetterRequest(models.Model):
    """Track recommendation letter requests sent to recommenders"""
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='recommendation_requests'
    )
    
    # Recommender Information
    recommender_name = models.CharField(max_length=255)
    recommender_email = models.EmailField()
    recommender_title = models.CharField(max_length=255)
    recommender_institution = models.CharField(max_length=255)
    relationship = models.CharField(max_length=255, help_text="Relationship to student")
    
    # Request tracking
    request_token = models.CharField(max_length=255, unique=True, db_index=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    # Status
    is_submitted = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)
    
    # Linked document
    document = models.OneToOneField(
        Document,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='recommendation_request'
    )
    
    # Reminders
    reminder_count = models.IntegerField(default=0)
    last_reminder_sent = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'recommendation_letter_requests'
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"Rec Letter Request - {self.recommender_name} for Application #{self.application.id}"
