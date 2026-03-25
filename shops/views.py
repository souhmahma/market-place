from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Shop
from .serializers import ShopSerializer, ShopStatusSerializer
from accounts.permissions import IsVendor, IsModerator
from orders.tasks import send_moderator_new_shop_email  
# shops/views.py
class ShopCreateView(generics.CreateAPIView):
    serializer_class   = ShopSerializer
    permission_classes = [IsVendor]

    def perform_create(self, serializer):
        # Vérifie si le vendeur a déjà une boutique
        if hasattr(self.request.user, 'shop'):
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Vous avez déjà une boutique.")
        shop = serializer.save(owner=self.request.user)
        send_moderator_new_shop_email.delay(shop.id)

class ShopDetailView(generics.RetrieveUpdateAPIView):
    """Vendeur consulte et modifie SA boutique"""
    serializer_class   = ShopSerializer
    permission_classes = [IsVendor]

    def get_object(self):
        return self.request.user.shop

class ShopListView(generics.ListAPIView):
    """Tout le monde peut voir les boutiques approuvées"""
    serializer_class   = ShopSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Shop.objects.filter(status='approved')

class ShopModerationView(generics.UpdateAPIView):
    """Modérateur approuve ou rejette une boutique"""
    serializer_class   = ShopStatusSerializer
    permission_classes = [IsModerator]
    queryset           = Shop.objects.all()
    def perform_update(self, serializer):
        shop = serializer.save()
        #  Envoyer email selon le statut
        if shop.status == 'approved':
            send_shop_approved_email.delay(shop.id)
        elif shop.status == 'rejected':
            send_shop_rejected_email.delay(shop.id)

class PendingShopListView(generics.ListAPIView):
    """Modérateur voit toutes les boutiques en attente"""
    serializer_class   = ShopSerializer
    permission_classes = [IsModerator]

    def get_queryset(self):
        return Shop.objects.filter(status='pending')