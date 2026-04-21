from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal     = serializers.SerializerMethodField()

    class Meta:
        model  = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()

class OrderSerializer(serializers.ModelSerializer):
    items            = OrderItemSerializer(many=True, read_only=True)
    customer_username = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'customer_username', 'status',
            'total_amount', 'commission_amount',
            'stripe_payment_id', 'items', 'created_at'
        ]
        read_only_fields = ['status', 'total_amount', 'commission_amount', 'stripe_payment_id']

class CartItemSerializer(serializers.ModelSerializer):
    product_name  = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()  # 🆕
    subtotal      = serializers.SerializerMethodField()

    class Meta:
        model  = CartItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()

    def get_product_image(self, obj):  # 🆕
        request = self.context.get('request')
        if obj.product.image and request:
            return request.build_absolute_uri(obj.product.image.url)
        return None

class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total      = serializers.SerializerMethodField()

    class Meta:
        model  = Cart
        fields = ['id', 'cart_items', 'total', 'updated_at']

    def get_total(self, obj):
        return obj.total()