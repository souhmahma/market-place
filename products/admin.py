from django.contrib import admin
from .models import Product, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}  # slug auto depuis le nom

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['name', 'shop', 'category', 'price', 'stock', 'status']
    list_filter    = ['status', 'category']
    search_fields  = ['name', 'shop__name']
    ordering       = ['-created_at']
    list_editable  = ['status', 'price', 'stock']
    readonly_fields = ['created_at', 'updated_at']