from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'description']

class ProductSerializer(serializers.ModelSerializer):
    shop_name     = serializers.CharField(source='shop.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model  = Product
        fields = [
            'id', 'name', 'description', 'price',
            'stock', 'image', 'status',
            'shop_name', 'category_name', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

class ProductStatusSerializer(serializers.ModelSerializer):
    """Utilisé par le modérateur pour changer le statut"""
    class Meta:
        model  = Product
        fields = ['status']