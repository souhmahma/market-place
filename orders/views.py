import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order, OrderItem, Cart, CartItem
from .serializers import OrderSerializer, CartSerializer, CartItemSerializer
from accounts.permissions import IsAdmin
from orders.tasks import send_shop_approved_email, send_shop_rejected_email

class CartView(APIView):
    """Le customer gère son panier"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Crée le panier s'il n'existe pas encore
        cart, _ = Cart.objects.get_or_create(customer=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        """Ajouter un produit au panier"""
        cart, _     = Cart.objects.get_or_create(customer=request.user)
        product_id  = request.data.get('product_id')
        quantity    = request.data.get('quantity', 1)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        if not created:
            # Produit déjà dans le panier → on augmente la quantité
            cart_item.quantity += int(quantity)
            cart_item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def delete(self, request):
        """Vider le panier"""
        cart, _ = Cart.objects.get_or_create(customer=request.user)
        cart.cart_items.all().delete()
        return Response({"message": "Panier vidé"}, status=status.HTTP_200_OK)

class CartItemDeleteView(APIView):
    """Supprimer un article du panier"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        cart_item = CartItem.objects.filter(
            pk=pk,
            cart__customer=request.user
        ).first()
        if not cart_item:
            return Response({"error": "Article introuvable"}, status=status.HTTP_404_NOT_FOUND)
        cart_item.delete()
        return Response({"message": "Article supprimé"})

class CheckoutView(APIView):
    """Créer une session Stripe et une commande"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = Cart.objects.filter(customer=request.user).first()

        if not cart or not cart.cart_items.exists():
            return Response({"error": "Panier vide"}, status=status.HTTP_400_BAD_REQUEST)

        # Créer la commande
        order = Order.objects.create(customer=request.user)

        # Créer les OrderItems depuis le panier
        line_items = []
        for cart_item in cart.cart_items.all():
            OrderItem.objects.create(
                order    = order,
                product  = cart_item.product,
                quantity = cart_item.quantity,
                price    = cart_item.product.price
            )
            line_items.append({
                'price_data': {
                    'currency': 'eur',
                    'product_data': {'name': cart_item.product.name},
                    'unit_amount': int(cart_item.product.price * 100),  # Stripe = centimes
                },
                'quantity': cart_item.quantity,
            })

        # Calculer les totaux
        order.calculate_totals()

        # Créer la session Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:3000/cancel',
            metadata={'order_id': order.id}
        )

        # Vider le panier
        cart.cart_items.all().delete()

        return Response({
            'checkout_url': session.url,
            'order_id': order.id
        })

@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """Stripe nous notifie quand le paiement est confirmé"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload    = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Paiement confirmé → on met à jour la commande
        if event['type'] == 'checkout.session.completed':
            session  = event['data']['object']
            order_id = session['metadata']['order_id']
            Order.objects.filter(id=order_id).update(
                status            = Order.Status.PAID,
                stripe_payment_id = session['payment_intent']
            )
            send_order_confirmation_email.delay(order_id)
        return Response({"status": "ok"})

class OrderListView(generics.ListAPIView):
    """Customer voit ses propres commandes"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    """Détail d'une commande"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user)

class AdminOrderListView(generics.ListAPIView):
    """Admin voit toutes les commandes"""
    serializer_class   = OrderSerializer
    permission_classes = [IsAdmin]
    queryset           = Order.objects.all()