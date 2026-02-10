from django.db import models
from apps.accounts.models import User


class Log(models.Model):
	"""System audit log"""

	actor_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	action = models.CharField(max_length=255)
	entity_type = models.CharField(max_length=100)
	entity_id = models.IntegerField(null=True, blank=True)
	ip_address = models.CharField(max_length=45, blank=True)
	user_agent = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'logs'
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=['actor_user']),
			models.Index(fields=['entity_type']),
			models.Index(fields=['created_at']),
		]

	def __str__(self):
		return f"{self.action} - {self.entity_type}#{self.entity_id}"


class SystemEvent(models.Model):
	"""Operational system events"""

	event_type = models.CharField(max_length=100)
	payload = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'system_events'
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=['event_type']),
			models.Index(fields=['created_at']),
		]

	def __str__(self):
		return f"{self.event_type} at {self.created_at}"


class FeatureFlag(models.Model):
	"""Feature flags for runtime control"""

	key = models.CharField(max_length=100, unique=True)
	name = models.CharField(max_length=150)
	description = models.TextField(blank=True)
	is_enabled = models.BooleanField(default=False)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'feature_flags'
		ordering = ['key']

	def __str__(self):
		return self.key


class SystemSetting(models.Model):
	"""System settings"""

	key = models.CharField(max_length=100, unique=True)
	value = models.TextField()
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = 'system_settings'
		ordering = ['key']

	def __str__(self):
		return self.key
