from django.urls import path
from .views import ShopCreateView, ShopDetailView, ShopListView, ShopModerationView, PendingShopListView

urlpatterns = [
    path('',              ShopListView.as_view(),       name='shop-list'),
    path('create/',       ShopCreateView.as_view(),     name='shop-create'),
    path('me/',           ShopDetailView.as_view(),     name='shop-detail'),
    path('<int:pk>/moderate/', ShopModerationView.as_view(), name='shop-moderate'),
    path('pending/', PendingShopListView.as_view(), name='shop-pending'),

]