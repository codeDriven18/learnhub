from rest_framework import serializers
from .models import QSRanking


class QSRankingSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)

    class Meta:
        model = QSRanking
        fields = [
            'id', 'qs_university_id', 'university_name', 'rank_global', 'rank_year',
            'score_overall', 'country', 'country_name', 'snapshot_date'
        ]
