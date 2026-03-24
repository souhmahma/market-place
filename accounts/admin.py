from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display   = ['username', 'email', 'role', 'is_active', 'date_joined']
    list_filter    = ['role', 'is_active', 'is_staff']
    search_fields  = ['username', 'email']
    ordering       = ['-date_joined']
    list_editable  = ['role', 'is_active']

    fieldsets = UserAdmin.fieldsets + (
        ('Rôle Marketplace', {
            'fields': ('role', 'phone', 'bio', 'avatar')
        }),
    )