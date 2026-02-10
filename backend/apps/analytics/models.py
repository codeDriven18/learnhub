from django.db import models


class AnalyticsDaily(models.Model):
	"""Daily analytics aggregates"""

	date = models.DateField(unique=True)
	total_applications = models.IntegerField(default=0)
	new_applicants = models.IntegerField(default=0)
	reviews_completed = models.IntegerField(default=0)
	documents_verified = models.IntegerField(default=0)
	avg_review_time_minutes = models.DecimalField(max_digits=8, decimal_places=2, default=0)

	class Meta:
		db_table = 'analytics_daily'
		ordering = ['-date']
		indexes = [
			models.Index(fields=['date']),
		]

	def __str__(self):
		return f"Analytics {self.date}"
