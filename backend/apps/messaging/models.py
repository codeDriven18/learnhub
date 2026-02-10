from django.db import models
from apps.accounts.models import User
from apps.applications.models import Application


class Message(models.Model):
	"""Direct messages between users"""

	sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
	recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
	application = models.ForeignKey(Application, on_delete=models.SET_NULL, null=True, blank=True)

	subject = models.CharField(max_length=255)
	body = models.TextField()
	is_read = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'messages'
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=['sender']),
			models.Index(fields=['recipient']),
			models.Index(fields=['application']),
			models.Index(fields=['created_at']),
		]

	def __str__(self):
		return f"{self.sender.email} -> {self.recipient.email} ({self.subject})"
