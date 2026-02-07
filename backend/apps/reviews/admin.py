from django.contrib import admin
from .models import Review, ReviewTagAssignment, DocumentReview


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'checker', 'decision', 'overall_score', 'is_complete', 'submitted_at')
    list_filter = ('decision', 'is_complete', 'requires_attention')
    search_fields = ('application__id', 'checker__email')
    raw_id_fields = ('application', 'checker')
    date_hierarchy = 'created_at'


@admin.register(ReviewTagAssignment)
class ReviewTagAssignmentAdmin(admin.ModelAdmin):
    list_display = ('review', 'tag', 'added_by', 'created_at')
    list_filter = ('tag',)
    raw_id_fields = ('review', 'added_by')


@admin.register(DocumentReview)
class DocumentReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'review', 'document', 'is_authentic', 'is_complete')
    list_filter = ('is_authentic', 'is_complete')
    raw_id_fields = ('review', 'document')
