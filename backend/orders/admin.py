from django.contrib import admin
from .models import Order, OrderItem, Cart, CartItem

class OrderItemInline(admin.TabularInline):
    model   = OrderItem
    extra   = 0
    readonly_fields = ['product', 'quantity', 'price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display    = ['id', 'customer', 'status', 'total_amount', 'commission_amount', 'created_at']
    list_filter     = ['status']
    search_fields   = ['customer__username']
    ordering        = ['-created_at']
    list_editable   = ['status']
    readonly_fields = ['total_amount', 'commission_amount', 'stripe_payment_id', 'created_at']
    inlines         = [OrderItemInline]  # affiche les items directement dans la commande

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display  = ['customer', 'updated_at']
    search_fields = ['customer__username']