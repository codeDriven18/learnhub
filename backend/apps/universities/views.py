from rest_framework import viewsets, permissions
from .models import University, Program
from .serializers import UniversitySerializer, ProgramSerializer


class UniversityViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = University.objects.select_related('country').all()
	serializer_class = UniversitySerializer
	permission_classes = [permissions.AllowAny]


class ProgramViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Program.objects.select_related('university').all()
	serializer_class = ProgramSerializer
	permission_classes = [permissions.AllowAny]

	def get_queryset(self):
		queryset = super().get_queryset()
		university_id = self.request.query_params.get('university_id')
		if university_id:
			queryset = queryset.filter(university_id=university_id)
		return queryset
