from django.contrib import admin
from .models import Document, RecommendationLetterRequest


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'document_type', 'file_name', 'status', 'verified_by', 'uploaded_at')
    list_filter = ('document_type', 'status', 'is_confidential')
    search_fields = ('file_name', 'title', 'application__id')
    raw_id_fields = ('application', 'verified_by')
    date_hierarchy = 'uploaded_at'


@admin.register(RecommendationLetterRequest)
class RecommendationLetterRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'recommender_name', 'recommender_email', 'is_submitted', 'sent_at')
    list_filter = ('is_submitted',)
    search_fields = ('recommender_name', 'recommender_email', 'application__id')
    raw_id_fields = ('application', 'document')
    date_hierarchy = 'sent_at'
