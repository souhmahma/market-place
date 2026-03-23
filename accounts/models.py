from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN      = 'admin',      'Admin'
        MODERATOR  = 'moderator',  'Modérateur'
        VENDOR     = 'vendor',     'Vendeur'
        CUSTOMER   = 'customer',   'Client'
        GUEST      = 'guest',      'Invité'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True
    )
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)

    def is_admin(self):
        return self.role == self.Role.ADMIN

    def is_moderator(self):
        return self.role == self.Role.MODERATOR

    def is_vendor(self):
        return self.role == self.Role.VENDOR

    def is_customer(self):
        return self.role == self.Role.CUSTOMER

    def __str__(self):
        return f"{self.username} ({self.role})"