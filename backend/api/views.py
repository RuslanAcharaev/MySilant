from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.response import Response

from .documentation import (
    vehicle_schema,
    maintenance_schema,
    complaint_schema,
    reference_schema,
    services_schema,
    clients_schema
)
from .models import Vehicle, Maintenance, Complaint, ReferenceBook
from .permissions import (
    VehiclePermission,
    MaintenancePermission,
    ComplaintPermission,
    ReferenceBookPermission,
    ServiceOrganizationPermission,
    ClientsPermission,
)
from .serializers import (
    CustomTokenObtainPairSerializer,
    VehiclePublicSerializer,
    VehicleSerializer,
    MaintenanceSerializer,
    ComplaintSerializer,
    ReferenceBookSerializer,
    ServiceOrganizationSerializer,
    ClientsSerializer,
    CustomTokenRefreshSerializer,
)
User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefresh(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer


@vehicle_schema
class VehicleViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete', 'head', 'options']
    queryset = Vehicle.objects.all()
    lookup_field = 'factory_number'
    permission_classes = [VehiclePermission]

    def get_serializer_class(self):
        if not self.request.user.is_authenticated:
            return VehiclePublicSerializer
        return VehicleSerializer

    def get_queryset(self):
        queryset = Vehicle.objects.select_related(
            'vehicle_model',
            'engine_model',
            'transmission_model',
            'drive_axle_model',
            'steering_axle_model',
            'client',
            'service'
        )
        user = self.request.user

        if not user.is_authenticated:
            return queryset

        if user.role == 'MA':
            return queryset
        elif user.role == 'CL':
            return queryset.filter(client=user)
        elif user.role == 'SO':
            return queryset.filter(service=user)

        return Vehicle.objects.none()

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            print('Ошибка при добавлении машины: ', str(e))
            raise

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


@maintenance_schema
class MaintenanceViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete', 'head', 'options']
    queryset = Maintenance.objects.all()
    permission_classes = [MaintenancePermission]
    serializer_class = MaintenanceSerializer

    def get_queryset(self):
        queryset = Maintenance.objects.select_related(
            'maintenance_type',
            'vehicle'
        )
        user = self.request.user

        if user.role == 'MA':
            return queryset
        elif user.role == 'CL':
            return queryset.filter(vehicle__client=user)
        elif user.role == 'SO':
            return queryset.filter(vehicle__service=user)

        return Maintenance.objects.none()

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            print('Ошибка при добавлении ТО: ', str(e))
            raise

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


@complaint_schema
class ComplaintViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete', 'head', 'options']
    queryset = Complaint.objects.all()
    permission_classes = [ComplaintPermission]
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        queryset = Complaint.objects.select_related(
            'failure_node',
            'recovery_method',
            'vehicle'
        )
        user = self.request.user

        if user.role == 'MA':
            return queryset
        elif user.role == 'CL':
            return queryset.filter(vehicle__client=user)
        elif user.role == 'SO':
            return queryset.filter(vehicle__service=user)

        return Complaint.objects.none()

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            print('Ошибка при добавлении рекламации: ', str(e))
            raise

    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


@reference_schema
class ReferenceBookViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete', 'head', 'options']
    queryset = ReferenceBook.objects.all()
    permission_classes = [ReferenceBookPermission]
    serializer_class = ReferenceBookSerializer

    def perform_create(self, serializer):
        try:
            print("Данные с клиента: ", serializer.validated_data)
            serializer.save()
        except Exception as e:
            print('Ошибка при добавлении машины: ', str(e))
            raise

    def perform_update(self, serializer):
        print("Данные с клиента: ", serializer.validated_data)
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


@services_schema
class ServiceOrganizationViewSet(ModelViewSet):
    http_method_names = ['get', 'head', 'options']
    queryset = User.objects.filter(role='SO')
    permission_classes = [ServiceOrganizationPermission]
    serializer_class = ServiceOrganizationSerializer


@clients_schema
class ClientsViewSet(ModelViewSet):
    http_method_names = ['get', 'head', 'options']
    queryset = User.objects.filter(role='CL')
    permission_classes = [ClientsPermission]
    serializer_class = ClientsSerializer

