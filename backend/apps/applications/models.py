from django.db import models
from apps.accounts.models import User, UserRole
from apps.universities.models import Program


class ApplicationStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    SUBMITTED = 'SUBMITTED', 'Submitted'
    UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
    DOCUMENTS_INCOMPLETE = 'DOCUMENTS_INCOMPLETE', 'Documents Incomplete'
    PASSED = 'PASSED', 'Passed'
    REJECTED = 'REJECTED', 'Rejected'
    NEEDS_REVISION = 'NEEDS_REVISION', 'Needs Revision'
    FORWARDED_TO_QS = 'FORWARDED_TO_QS', 'Forwarded to QS'


class ApplicationStage(models.TextChoices):
    INITIAL_SUBMISSION = 'INITIAL_SUBMISSION', 'Initial Submission'
    DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION', 'Document Verification'
    ESSAY_REVIEW = 'ESSAY_REVIEW', 'Essay Review'
    FINAL_REVIEW = 'FINAL_REVIEW', 'Final Review'
    COMPLETED = 'COMPLETED', 'Completed'


class Application(models.Model):
    """Main application model for student submissions"""
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='applications',
        limit_choices_to={'role__code': UserRole.STUDENT}
    )

    program = models.ForeignKey(
        Program,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='applications'
    )
    
    # Application Details
    program_name = models.CharField(max_length=255, help_text="Program applying for")
    academic_year = models.CharField(max_length=20, help_text="e.g., 2026-2027")
    intake_period = models.CharField(max_length=50, help_text="e.g., Fall 2026")
    
    # Status and Stage
    status = models.CharField(
        max_length=30,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT
    )
    current_stage = models.CharField(
        max_length=30,
        choices=ApplicationStage.choices,
        default=ApplicationStage.INITIAL_SUBMISSION
    )
    
    # Assignment
    assigned_checker = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_applications',
        limit_choices_to={'role__code': UserRole.CHECKER}
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    review_started_at = models.DateTimeField(null=True, blank=True)
    review_completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional Information
    personal_statement = models.TextField(blank=True)
    additional_info = models.TextField(blank=True)
    
    # Flags
    is_complete = models.BooleanField(default=False)
    requires_attention = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'applications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['assigned_checker', 'status']),
            models.Index(fields=['status', 'current_stage']),
        ]
    
    def __str__(self):
        return f"Application #{self.id} - {self.student.full_name} - {self.program_name}"
    
    @property
    def student_name(self):
        return self.student.full_name
    
    @property
    def checker_name(self):
        return self.assigned_checker.full_name if self.assigned_checker else "Unassigned"


class ApplicationTimeline(models.Model):
    """Track all status changes and important events"""
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='timeline'
    )
    
    event_type = models.CharField(max_length=50)
    description = models.TextField()
    
    previous_status = models.CharField(max_length=30, blank=True)
    new_status = models.CharField(max_length=30, blank=True)
    
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'application_timeline'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.application.id} - {self.event_type} - {self.created_at}"


class ApplicationStatusHistory(models.Model):
    """Explicit status history for applications"""

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='status_history'
    )

    from_status = models.CharField(max_length=30)
    to_status = models.CharField(max_length=30)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    note = models.TextField(blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'application_status_history'
        ordering = ['-changed_at']
        indexes = [
            models.Index(fields=['application']),
            models.Index(fields=['changed_by']),
            models.Index(fields=['changed_at']),
        ]

    def __str__(self):
        return f"Application {self.application_id}: {self.from_status} -> {self.to_status}"
