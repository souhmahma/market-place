from django.db import models
from accounts.models import User
from products.models import Product
from decimal import Decimal  

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING   = 'pending',   'En attente'
        PAID      = 'paid',      'Payée'
        SHIPPED   = 'shipped',   'Expédiée'
        DELIVERED = 'delivered', 'Livrée'
        CANCELLED = 'cancelled', 'Annulée'
        REFUNDED  = 'refunded',  'Remboursée'

    customer           = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status             = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total_amount       = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_amount  = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stripe_payment_id  = models.CharField(max_length=200, blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    def calculate_totals(self):
        from django.conf import settings
        self.total_amount      = sum(item.subtotal() for item in self.items.all())
        self.commission_amount = self.total_amount * Decimal(str(settings.COMMISSION_RATE))  # ← fix
        self.save()

    def __str__(self):
        return f"Commande #{self.id} - {self.customer.username}"

class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price    = models.DecimalField(max_digits=10, decimal_places=2)  # prix au moment de l'achat

    def subtotal(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"

class Cart(models.Model):
    customer   = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def total(self):
        return sum(item.subtotal() for item in self.cart_items.all())

    def __str__(self):
        return f"Panier de {self.customer.username}"

class CartItem(models.Model):
    cart     = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product  = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"