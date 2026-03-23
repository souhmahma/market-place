from django.db import models
from accounts.models import User

class Shop(models.Model):
    class Status(models.TextChoices):
        PENDING  = 'pending',  'En attente'
        APPROVED = 'approved', 'Approuvée'
        REJECTED = 'rejected', 'Rejetée'
        BANNED   = 'banned',   'Bannie'

    owner       = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shop')
    name        = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    logo        = models.ImageField(upload_to='shops/logos/', null=True, blank=True)
    status      = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def is_approved(self):
        return self.status == self.Status.APPROVED

    def __str__(self):
        return f"{self.name} ({self.status})"
