from rest_framework import generics, permissions
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer, ProductStatusSerializer
from accounts.permissions import IsVendor, IsModerator

class ProductCreateView(generics.CreateAPIView):
    """Vendeur ajoute un produit à sa boutique"""
    serializer_class   = ProductSerializer
    permission_classes = [IsVendor]

    def perform_create(self, serializer):
        # On assigne automatiquement la boutique du vendeur connecté
        serializer.save(shop=self.request.user.shop)

class ProductListView(generics.ListAPIView):
    """Tout le monde voit les produits approuvés"""
    serializer_class   = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(status='approved')

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vendeur gère ses propres produits"""
    serializer_class   = ProductSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        # Un vendeur ne peut modifier QUE ses propres produits
        return Product.objects.filter(shop=self.request.user.shop)

class ProductModerationView(generics.UpdateAPIView):
    """Modérateur approuve ou rejette un produit"""
    serializer_class   = ProductStatusSerializer
    permission_classes = [IsModerator]
    queryset           = Product.objects.all()

class CategoryListView(generics.ListCreateAPIView):
    """Tout le monde voit les catégories, admin peut en créer"""
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset           = Category.objects.all()