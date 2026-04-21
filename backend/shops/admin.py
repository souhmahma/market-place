from django.contrib import admin
from .models import Shop

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display   = ['name', 'owner', 'status', 'created_at']
    list_filter    = ['status']
    search_fields  = ['name', 'owner__username']
    ordering       = ['-created_at']
    list_editable  = ['status']
    readonly_fields = ['created_at', 'updated_at']