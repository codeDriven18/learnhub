from rest_framework import serializers
from .models import Application, ApplicationTimeline, ApplicationStatus, ApplicationStatusHistory


class ApplicationTimelineSerializer(serializers.ModelSerializer):
    """Timeline event serializer"""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = ApplicationTimeline
        fields = '__all__'
        read_only_fields = ['created_at']


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.full_name', read_only=True, allow_null=True)

    class Meta:
        model = ApplicationStatusHistory
        fields = ['id', 'from_status', 'to_status', 'changed_by', 'changed_by_name', 'note', 'changed_at']


class ApplicationListSerializer(serializers.ModelSerializer):
    """List view serializer for applications"""
    student_name = serializers.CharField(read_only=True)
    checker_name = serializers.CharField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    stage_display = serializers.CharField(source='get_current_stage_display', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'student', 'student_name', 'program', 'program_name', 'academic_year',
            'intake_period', 'status', 'status_display', 'current_stage',
            'stage_display', 'assigned_checker', 'checker_name', 'submitted_at',
            'created_at', 'updated_at', 'is_complete', 'requires_attention'
        ]
        read_only_fields = ['student_name', 'checker_name', 'created_at', 'updated_at']


class ApplicationDetailSerializer(serializers.ModelSerializer):
    """Detailed view serializer for applications"""
    student_name = serializers.CharField(read_only=True)
    checker_name = serializers.CharField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    stage_display = serializers.CharField(source='get_current_stage_display', read_only=True)
    timeline = ApplicationTimelineSerializer(many=True, read_only=True)
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = [
            'student', 'created_at', 'updated_at', 'submitted_at',
            'review_started_at', 'review_completed_at', 'student_name', 'checker_name'
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Create application serializer"""
    
    class Meta:
        model = Application
        fields = [
            'program', 'program_name', 'academic_year', 'intake_period',
            'personal_statement', 'additional_info'
        ]
    
    def create(self, validated_data):
        # Set student from request user
        validated_data['student'] = self.context['request'].user
        validated_data['status'] = ApplicationStatus.DRAFT
        program = validated_data.get('program')
        if program and not validated_data.get('program_name'):
            validated_data['program_name'] = program.name
        return super().create(validated_data)


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """Update application serializer (for students)"""
    
    class Meta:
        model = Application
        fields = [
            'program', 'program_name', 'academic_year', 'intake_period',
            'personal_statement', 'additional_info'
        ]


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """Update application status (for checkers/admins)"""
    
    class Meta:
        model = Application
        fields = ['status', 'current_stage']
