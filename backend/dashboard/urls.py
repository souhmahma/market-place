from django.urls import path
from .views import VendorDashboardView, AdminDashboardView, ModeratorDashboardView

urlpatterns = [
    path('vendor/',    VendorDashboardView.as_view(),    name='vendor-dashboard'),
    path('admin/',     AdminDashboardView.as_view(),     name='admin-dashboard'),
    path('moderator/', ModeratorDashboardView.as_view(), name='moderator-dashboard'),
]