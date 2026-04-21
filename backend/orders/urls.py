from django.urls import path
from .views import (
    CartView, CartItemDeleteView, CheckoutView,
    StripeWebhookView, OrderListView,
    OrderDetailView, AdminOrderListView
)

urlpatterns = [
    path('cart/',                  CartView.as_view(),          name='cart'),
    path('cart/<int:pk>/delete/',  CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('checkout/',              CheckoutView.as_view(),      name='checkout'),
    path('webhook/',               StripeWebhookView.as_view(), name='stripe-webhook'),
    path('',                       OrderListView.as_view(),     name='order-list'),
    path('<int:pk>/',              OrderDetailView.as_view(),   name='order-detail'),
    path('admin/',                 AdminOrderListView.as_view(),name='admin-order-list'),
]