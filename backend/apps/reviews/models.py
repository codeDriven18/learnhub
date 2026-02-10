from django.db import models
from apps.applications.models import Application
from apps.accounts.models import User, UserRole


class ReviewDecision(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    PASS = 'PASS', 'Pass to Next Stage'
    REJECT = 'REJECT', 'Reject'
    REQUEST_CLARIFICATION = 'REQUEST_CLARIFICATION', 'Request Clarification'
    FORWARD_TO_QS = 'FORWARD_TO_QS', 'Forward to QS'


class ReviewTag(models.TextChoices):
    STRONG = 'STRONG', 'Strong Candidate'
    MEDIUM = 'MEDIUM', 'Medium Candidate'
    WEAK = 'WEAK', 'Weak Candidate'
    MISSING_DOCUMENTS = 'MISSING_DOCUMENTS', 'Missing Documents'
    SUSPECTED_FRAUD = 'SUSPECTED_FRAUD', 'Suspected Fraud'
    EXCELLENT_ESSAY = 'EXCELLENT_ESSAY', 'Excellent Essay'
    WEAK_ESSAY = 'WEAK_ESSAY', 'Weak Essay'
    STRONG_RECOMMENDATIONS = 'STRONG_RECOMMENDATIONS', 'Strong Recommendations'
    NEEDS_INTERVIEW = 'NEEDS_INTERVIEW', 'Needs Interview'


class Review(models.Model):
    """Review records created by admission checkers"""
    
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    checker = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conducted_reviews',
        limit_choices_to={'role__code': UserRole.CHECKER}
    )
    
    # Review Content
    overall_score = models.IntegerField(
        null=True,
        blank=True,
        help_text="Overall score (1-10)"
    )
    
    # Individual Scores
    academic_score = models.IntegerField(null=True, blank=True, help_text="Academic performance (1-10)")
    essay_score = models.IntegerField(null=True, blank=True, help_text="Essay quality (1-10)")
    recommendation_score = models.IntegerField(null=True, blank=True, help_text="Recommendations (1-10)")
    extracurricular_score = models.IntegerField(null=True, blank=True, help_text="Extracurriculars (1-10)")
    
    # Notes
    internal_notes = models.TextField(
        blank=True,
        help_text="Internal notes (not visible to student)"
    )
    feedback_to_student = models.TextField(
        blank=True,
        help_text="Feedback visible to student"
    )
    
    # Decision
    decision = models.CharField(
        max_length=30,
        choices=ReviewDecision.choices,
        default=ReviewDecision.PENDING
    )
    
    # Flags and Tags
    is_complete = models.BooleanField(default=False)
    requires_attention = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['application', 'checker']),
            models.Index(fields=['decision']),
        ]
    
    def __str__(self):
        return f"Review #{self.id} - Application #{self.application.id} by {self.checker.full_name}"


class ReviewTagAssignment(models.Model):
    """Tags assigned to reviews for categorization"""
    
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='tags'
    )
    
    tag = models.CharField(
        max_length=30,
        choices=ReviewTag.choices
    )
    
    added_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'review_tags'
        unique_together = ['review', 'tag']
    
    def __str__(self):
        return f"{self.review.id} - {self.get_tag_display()}"


class DocumentReview(models.Model):
    """Individual document review notes"""
    
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='document_reviews'
    )
    
    document = models.ForeignKey(
        'documents.Document',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    is_authentic = models.BooleanField(null=True, blank=True)
    is_complete = models.BooleanField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'document_reviews'
    
    def __str__(self):
        return f"Doc Review - {self.document.file_name}"
