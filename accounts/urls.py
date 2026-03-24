from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, MeView, UpdateAvatarView

urlpatterns = [
    path('register/',       RegisterView.as_view(),      name='register'),
    path('login/',          TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/',  TokenRefreshView.as_view(),  name='token_refresh'),
    path('profile/',        ProfileView.as_view(),       name='profile'),
    path('me/',             MeView.as_view(),            name='me'),
    path('avatar/', UpdateAvatarView.as_view(), name='update-avatar'),

]