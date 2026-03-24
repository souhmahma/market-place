from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Shop
from .serializers import ShopSerializer, ShopStatusSerializer
from accounts.permissions import IsVendor, IsModerator

class ShopCreateView(generics.CreateAPIView):
    """Vendeur crée sa boutique"""
    serializer_class   = ShopSerializer
    permission_classes = [IsVendor]

    def perform_create(self, serializer):
        # On assigne automatiquement le vendeur connecté comme owner
        serializer.save(owner=self.request.user)

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