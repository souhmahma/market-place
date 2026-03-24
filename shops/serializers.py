from rest_framework import serializers
from .models import Shop

class ShopSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    logo_url       = serializers.SerializerMethodField()

    class Meta:
        model  = Shop
        fields = [
            'id', 'name', 'description', 'logo',
            'logo_url', 'status', 'owner_username', 'created_at'
        ]
        read_only_fields = ['status', 'owner_username', 'created_at']

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None
class ShopStatusSerializer(serializers.ModelSerializer):
    """Utilisé par le modérateur pour changer le statut"""
    class Meta:
        model  = Shop
        fields = ['status']