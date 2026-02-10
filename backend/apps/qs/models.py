from django.db import models
from apps.countries.models import Country


class QSRanking(models.Model):
	"""QS ranking snapshots"""

	qs_university_id = models.CharField(max_length=50)
	university_name = models.CharField(max_length=255)
	rank_global = models.IntegerField()
	rank_year = models.IntegerField()
	score_overall = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
	country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
	snapshot_date = models.DateField()

	class Meta:
		db_table = 'qs_rankings'
		ordering = ['rank_global']
		indexes = [
			models.Index(fields=['qs_university_id']),
			models.Index(fields=['rank_year']),
			models.Index(fields=['country']),
		]
		constraints = [
			models.UniqueConstraint(
				fields=['qs_university_id', 'rank_year', 'snapshot_date'],
				name='unique_qs_snapshot'
			)
		]

	def __str__(self):
		return f"{self.university_name} ({self.rank_year})"
