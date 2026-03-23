from rest_framework import serializers
from .models import Shop

class ShopSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model  = Shop
        fields = ['id', 'name', 'description', 'logo', 'status', 'owner_username', 'created_at']
        read_only_fields = ['status', 'owner_username', 'created_at']

class ShopStatusSerializer(serializers.ModelSerializer):
    """Utilisé par le modérateur pour changer le statut"""
    class Meta:
        model  = Shop
        fields = ['status']