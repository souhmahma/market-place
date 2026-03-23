from django.urls import path
from .views import (
    ProductCreateView, ProductListView,
    ProductDetailView, ProductModerationView, CategoryListView
)

urlpatterns = [
    path('',                       ProductListView.as_view(),      name='product-list'),
    path('create/',                ProductCreateView.as_view(),    name='product-create'),
    path('<int:pk>/',              ProductDetailView.as_view(),    name='product-detail'),
    path('<int:pk>/moderate/',     ProductModerationView.as_view(),name='product-moderate'),
    path('categories/',            CategoryListView.as_view(),     name='category-list'),
]