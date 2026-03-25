from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from .models import User
from rest_framework.parsers import MultiPartParser, FormParser
from accounts.permissions import IsAdmin


class RegisterView(generics.CreateAPIView):
    queryset           = User.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(
            request.user,
            context={'request': request}  # 🆕 passer request
        )
        return Response(serializer.data)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_context(self):
        return {'request': self.request}  # 🆕 passer request

class UpdateAvatarView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def patch(self, request):
        user = request.user
        if 'avatar' not in request.FILES:
            return Response({"error": "Aucune image fournie"}, status=400)
        user.avatar = request.FILES['avatar']
        user.save()
        serializer = UserSerializer(
            user,
            context={'request': request}  # 🆕 passer request
        )
        return Response(serializer.data)


class UserListView(generics.ListAPIView):
    """Admin liste tous les users"""
    serializer_class   = UserSerializer
    permission_classes = [IsAdmin]
    queryset           = User.objects.all().order_by('-date_joined')

class UserRoleUpdateView(generics.UpdateAPIView):
    """Admin change le rôle d'un user"""
    serializer_class   = UserSerializer
    permission_classes = [IsAdmin]
    queryset           = User.objects.all()