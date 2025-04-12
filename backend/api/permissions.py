from rest_framework import permissions


class VehiclePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return request.method == 'GET'

        if request.user.role == 'MA':
            return True

        if request.user.role == 'CL':
            return (
                request.method == 'GET' and obj.client == request.user
            )

        if request.user.role == 'SO':
            return (
                request.method == 'GET' and obj.service == request.user
            )

        return False


class MaintenancePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == 'MA':
            return True

        if user.role == 'CL':
            if request.method in ['GET', 'POST', 'PUT', 'DELETE']:
                return obj.vehicle.client == user
            return False

        if user.role == 'SO':
            if request.method in ['GET', 'POST', 'PUT', 'DELETE']:
                return obj.vehicle.service == user
            return False

        return False


class ComplaintPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == 'MA':
            return True

        if user.role == 'CL':
            return request.method == 'GET' and obj.vehicle.client == user

        if user.role == 'SO':
            if request.method in ['GET', 'POST', 'PUT', 'DELETE']:
                return obj.vehicle.service == user
            return False

        return False


class ReferenceBookPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method == 'GET':
            return True

        return request.user.role == 'MA'


class ServiceOrganizationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.method == 'GET':
            return True


class ClientsPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return request.user.role == 'MA'