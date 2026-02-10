from django.db import models


class Country(models.Model):
	"""Country reference data"""

	name = models.CharField(max_length=150, unique=True)
	iso_code = models.CharField(max_length=3, unique=True)
	region = models.CharField(max_length=100, blank=True)
	timezone = models.CharField(max_length=100, blank=True)
	currency = models.CharField(max_length=10, blank=True)

	class Meta:
		db_table = 'countries'
		ordering = ['name']
		indexes = [
			models.Index(fields=['name']),
			models.Index(fields=['iso_code']),
		]

	def __str__(self):
		return f"{self.name} ({self.iso_code})"
