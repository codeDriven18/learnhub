from rest_framework import viewsets, permissions
from .models import QSRanking
from .serializers import QSRankingSerializer


class QSRankingViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = QSRanking.objects.select_related('country').all()
	serializer_class = QSRankingSerializer
	permission_classes = [permissions.AllowAny]

	def get_queryset(self):
		queryset = super().get_queryset()
		year = self.request.query_params.get('year')
		country_id = self.request.query_params.get('country_id')
		if year:
			queryset = queryset.filter(rank_year=year)
		if country_id:
			queryset = queryset.filter(country_id=country_id)
		return queryset
