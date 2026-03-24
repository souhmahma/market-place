from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth
from accounts.permissions import IsAdmin, IsVendor, IsModerator
from orders.models import Order, OrderItem
from products.models import Product
from shops.models import Shop
from accounts.models import User

class VendorDashboardView(APIView):
    """Stats pour le vendeur connecté"""
    permission_classes = [IsVendor]

    def get(self, request):
        shop = request.user.shop

        # Commandes liées aux produits de la boutique
        orders = Order.objects.filter(
            items__product__shop=shop,
            status='paid'
        ).distinct()

        # Revenus par mois
        monthly_revenue = orders.annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            revenue=Sum('total_amount')
        ).order_by('month')

        # Produits les plus vendus
        top_products = OrderItem.objects.filter(
            product__shop=shop
        ).values(
            'product__name'
        ).annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('price')
        ).order_by('-total_sold')[:5]

        # Stats générales
        stats = {
            'total_orders'   : orders.count(),
            'total_revenue'  : orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'total_products' : shop.products.count(),
            'pending_products': shop.products.filter(status='pending').count(),
            'approved_products': shop.products.filter(status='approved').count(),
            'avg_order_value': orders.aggregate(Avg('total_amount'))['total_amount__avg'] or 0,
        }

        return Response({
            'shop'           : shop.name,
            'stats'          : stats,
            'monthly_revenue': list(monthly_revenue),
            'top_products'   : list(top_products),
        })


class AdminDashboardView(APIView):
    """Stats globales pour l'admin"""
    permission_classes = [IsAdmin]

    def get(self, request):
        # Stats utilisateurs
        user_stats = {
            'total_users'    : User.objects.count(),
            'total_vendors'  : User.objects.filter(role='vendor').count(),
            'total_customers': User.objects.filter(role='customer').count(),
            'new_users_month': User.objects.filter(
                date_joined__month=__import__('datetime').datetime.now().month
            ).count(),
        }

        # Stats commandes
        order_stats = {
            'total_orders'    : Order.objects.count(),
            'paid_orders'     : Order.objects.filter(status='paid').count(),
            'pending_orders'  : Order.objects.filter(status='pending').count(),
            'cancelled_orders': Order.objects.filter(status='cancelled').count(),
            'total_revenue'   : Order.objects.filter(
                status='paid'
            ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'total_commission': Order.objects.filter(
                status='paid'
            ).aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0,
        }

        # Stats boutiques
        shop_stats = {
            'total_shops'   : Shop.objects.count(),
            'approved_shops': Shop.objects.filter(status='approved').count(),
            'pending_shops' : Shop.objects.filter(status='pending').count(),
            'banned_shops'  : Shop.objects.filter(status='banned').count(),
        }

        # Revenus par mois
        monthly_revenue = Order.objects.filter(
            status='paid'
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            revenue    = Sum('total_amount'),
            commission = Sum('commission_amount'),
            orders     = Count('id')
        ).order_by('month')

        # Top vendeurs
        top_vendors = Shop.objects.annotate(
            total_sales=Sum('products__orderitem__quantity'),
            total_revenue=Sum('products__orderitem__price')
        ).order_by('-total_revenue')[:5].values(
            'name', 'total_sales', 'total_revenue'
        )

        return Response({
            'user_stats'     : user_stats,
            'order_stats'    : order_stats,
            'shop_stats'     : shop_stats,
            'monthly_revenue': list(monthly_revenue),
            'top_vendors'    : list(top_vendors),
        })


class ModeratorDashboardView(APIView):
    """Stats pour le modérateur"""
    permission_classes = [IsModerator]

    def get(self, request):
        # Elements en attente de modération
        pending = {
            'shops'   : Shop.objects.filter(status='pending').count(),
            'products': Product.objects.filter(status='pending').count(),
        }

        # Dernières boutiques en attente
        pending_shops = Shop.objects.filter(
            status='pending'
        ).values(
            'id', 'name', 'owner__username', 'created_at'
        ).order_by('-created_at')[:10]

        # Derniers produits en attente
        pending_products = Product.objects.filter(
            status='pending'
        ).values(
            'id', 'name', 'shop__name', 'price', 'created_at'
        ).order_by('-created_at')[:10]

        # Historique modération ce mois
        moderation_stats = {
            'shops_approved_month' : Shop.objects.filter(status='approved').count(),
            'shops_rejected_month' : Shop.objects.filter(status='rejected').count(),
            'products_approved_month': Product.objects.filter(status='approved').count(),
            'products_rejected_month': Product.objects.filter(status='rejected').count(),
        }

        return Response({
            'pending'          : pending,
            'pending_shops'    : list(pending_shops),
            'pending_products' : list(pending_products),
            'moderation_stats' : moderation_stats,
        })