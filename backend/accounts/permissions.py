from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()

class IsModerator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_moderator() or request.user.is_admin()
        )

class IsVendor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_vendor() or request.user.is_admin()
        )

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_customer()