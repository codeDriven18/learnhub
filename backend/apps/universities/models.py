from django.db import models
from apps.countries.models import Country


class University(models.Model):
	"""University master record"""

	name = models.CharField(max_length=255)
	country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='universities')
	qs_university_id = models.CharField(max_length=50, unique=True, blank=True)
	website_url = models.URLField(blank=True)
	is_active = models.BooleanField(default=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'universities'
		ordering = ['name']
		indexes = [
			models.Index(fields=['name']),
			models.Index(fields=['country']),
			models.Index(fields=['qs_university_id']),
		]

	def __str__(self):
		return self.name


class Program(models.Model):
	"""Academic programs offered by universities"""

	LEVEL_CHOICES = [
		('BACHELOR', 'Bachelor'),
		('MASTER', 'Master'),
		('PHD', 'PhD'),
	]

	university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='programs')
	name = models.CharField(max_length=255)
	level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
	intake_period = models.CharField(max_length=100)
	duration_months = models.IntegerField()
	tuition_fee = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
	is_active = models.BooleanField(default=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'programs'
		ordering = ['name']
		indexes = [
			models.Index(fields=['university']),
			models.Index(fields=['name']),
		]

	def __str__(self):
		return f"{self.name} ({self.get_level_display()})"
