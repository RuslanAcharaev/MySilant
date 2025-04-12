from datetime import datetime, timezone
from os import access

from django.contrib.auth import authenticate
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

from .models import Vehicle, ReferenceBook, Maintenance, Complaint
User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        auth_kwargs = {
            'username': attrs['username'],
            'password': attrs['password'],
        }

        user = authenticate(**auth_kwargs)

        if user is None:
            raise serializers.ValidationError({
                'error': 'Неправильно введен логин или пароль'
            })

        data = super().validate(attrs)

        refresh = self.get_token(self.user)
        access = refresh.access_token

        data['access_expires_at'] = datetime.fromtimestamp(
            access.payload['exp'],
            tz=timezone.utc
        ).timestamp()
        data['refresh_expires_at'] = datetime.fromtimestamp(
            refresh.payload['exp'],
            tz=timezone.utc
        ).timestamp()

        data['user'] = {
            'username': self.user.username,
            'role': self.user.role,
            'fullname': self.user.fullname,
        }
        return data


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        access = AccessToken(data['access'])

        data['access_expires_at'] = datetime.fromtimestamp(
            access.payload['exp'],
            tz=timezone.utc
        ).timestamp()

        return data


class ReferenceBookSerializer(serializers.ModelSerializer):
    reference_type_display = serializers.CharField(source='get_reference_type_display', read_only=True)

    class Meta:
        model = ReferenceBook
        fields = ['id', 'reference_type', 'reference_type_display', 'name', 'description']


class ServiceOrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'fullname']

    def get_queryset(self):
        return User.objects.filter(role='SO')


class ClientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'fullname']

    def get_queryset(self):
        return User.objects.filter(role='CL')


class VehiclePublicSerializer(serializers.ModelSerializer):
    vehicle_model = serializers.SerializerMethodField()
    engine_model = serializers.SerializerMethodField()
    transmission_model = serializers.SerializerMethodField()
    drive_axle_model = serializers.SerializerMethodField()
    steering_axle_model = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'factory_number', 'vehicle_model', 'engine_model', 'engine_number', 'transmission_model',
            'transmission_number', 'drive_axle_model', 'drive_axle_number', 'steering_axle_model',
            'steering_axle_number'
        ]

    @extend_schema_field(OpenApiTypes.STR)
    def get_vehicle_model(self, obj):
        return obj.vehicle_model.name

    @extend_schema_field(OpenApiTypes.STR)
    def get_engine_model(self, obj):
        return obj.engine_model.name

    @extend_schema_field(OpenApiTypes.STR)
    def get_transmission_model(self, obj):
        return obj.transmission_model.name

    @extend_schema_field(OpenApiTypes.STR)
    def get_drive_axle_model(self, obj):
        return obj.drive_axle_model.name

    @extend_schema_field(OpenApiTypes.STR)
    def get_steering_axle_model(self, obj):
        return obj.steering_axle_model.name


class VehicleSerializer(serializers.ModelSerializer):
    vehicle_model = ReferenceBookSerializer(read_only=True)
    vehicle_model_id = serializers.PrimaryKeyRelatedField(
        source='vehicle_model',
        queryset=ReferenceBook.objects.filter(reference_type='vehicle_model')
    )
    engine_model = ReferenceBookSerializer(read_only=True)
    engine_model_id = serializers.PrimaryKeyRelatedField(
        source='engine_model',
        queryset=ReferenceBook.objects.filter(reference_type='engine_model')
    )
    transmission_model = ReferenceBookSerializer(read_only=True)
    transmission_model_id = serializers.PrimaryKeyRelatedField(
        source='transmission_model',
        queryset=ReferenceBook.objects.filter(reference_type='transmission_model')
    )
    drive_axle_model = ReferenceBookSerializer(read_only=True)
    drive_axle_model_id = serializers.PrimaryKeyRelatedField(
        source='drive_axle_model',
        queryset=ReferenceBook.objects.filter(reference_type='drive_axle_model')
    )
    steering_axle_model = ReferenceBookSerializer(read_only=True)
    steering_axle_model_id = serializers.PrimaryKeyRelatedField(
        source='steering_axle_model',
        queryset=ReferenceBook.objects.filter(reference_type='steering_axle_model')
    )
    client = serializers.SerializerMethodField()
    client_id = serializers.PrimaryKeyRelatedField(
        source='client',
        queryset=User.objects.filter(role='CL')
    )
    service = serializers.SerializerMethodField()
    service_id = serializers.PrimaryKeyRelatedField(
        source='service',
        queryset=User.objects.filter(role='SO')
    )

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'factory_number',
            'vehicle_model',
            'vehicle_model_id',
            'engine_model',
            'engine_model_id',
            'engine_number',
            'transmission_model',
            'transmission_model_id',
            'transmission_number',
            'drive_axle_model',
            'drive_axle_model_id',
            'drive_axle_number',
            'steering_axle_model',
            'steering_axle_model_id',
            'steering_axle_number',
            'supply_contract',
            'shipping_date',
            'consignee',
            'delivery_address',
            'equipment',
            'client',
            'client_id',
            'service',
            'service_id',
        ]
        extra_kwargs = {
            'vehicle_model_id': {'write_only': True},
            'engine_model_id': {'write_only': True},
            'transmission_model_id': {'write_only': True},
            'drive_axle_model_id': {'write_only': True},
            'steering_axle_model_id': {'write_only': True},
            'client_id': {'write_only': True},
            'service_id': {'write_only': True},
        }

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_client(self, obj):
        return {
            'id': obj.client.id,
            'fullname': obj.client.fullname,
        }

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_service(self, obj):
        return {
            'id': obj.service.id,
            'fullname': obj.service.fullname,
        }


class MaintenanceSerializer(serializers.ModelSerializer):
    maintenance_type = ReferenceBookSerializer(read_only=True)
    maintenance_type_id = serializers.PrimaryKeyRelatedField(
        source='maintenance_type',
        queryset=ReferenceBook.objects.filter(reference_type='maintenance_type')
    )
    vehicle = serializers.SerializerMethodField()
    vehicle_id = serializers.PrimaryKeyRelatedField(
        source='vehicle',
        queryset=Vehicle.objects.all()
    )
    service = serializers.SerializerMethodField()

    class Meta:
        model = Maintenance
        fields = [
            'id',
            'vehicle',
            'vehicle_id',
            'maintenance_type',
            'maintenance_type_id',
            'maintenance_date',
            'operating_time',
            'work_order_number',
            'work_order_date',
            'service',
        ]
        extra_kwargs = {
            'maintenance_type_id': {'write_only': True},
            'vehicle_id': {'write_only': True},
        }

    @extend_schema_field({
        'type': 'object',
        'properties': {
            'id': {'type': 'integer'},
            'number': {'type': 'string'}
        }
    })
    def get_vehicle(self, obj):
        return {
            'id': obj.vehicle.id,
            'number': obj.vehicle.factory_number
        }

    @extend_schema_field({
        'type': 'object',
        'properties': {
            'id': {'type': 'integer'} | {'type': 'string'},
            'number': {'type': 'string'}
        }
    })
    def get_service(self, obj):
        return {
            'id': obj.service.id if obj.service else '',
            'fullname': obj.service.fullname if obj.service else 'самостоятельно',
        }

    def validate(self, data):
        maintenance_type = data.get('maintenance_type')
        vehicle = data.get('vehicle')

        if maintenance_type and vehicle:
            existing_maintenance = Maintenance.objects.filter(
                vehicle=vehicle, maintenance_type=maintenance_type
            )

            if self.instance:
                existing_maintenance = existing_maintenance.exclude(id=self.instance.id)

            if existing_maintenance.exists():
                raise serializers.ValidationError({'type': 'ТО данного вида уже существует'})

        return super().validate(data)


class ComplaintSerializer(serializers.ModelSerializer):
    failure_node = ReferenceBookSerializer(read_only=True)
    failure_node_id = serializers.PrimaryKeyRelatedField(
        source='failure_node',
        queryset=ReferenceBook.objects.filter(reference_type='failure_node')
    )
    recovery_method = ReferenceBookSerializer(read_only=True)
    recovery_method_id = serializers.PrimaryKeyRelatedField(
        source='recovery_method',
        queryset=ReferenceBook.objects.filter(reference_type='recovery_method')
    )
    vehicle = serializers.SerializerMethodField()
    vehicle_id = serializers.PrimaryKeyRelatedField(
        source='vehicle',
        queryset=Vehicle.objects.all()
    )
    service = serializers.SerializerMethodField()
    service_id = serializers.PrimaryKeyRelatedField(
        source='service',
        queryset=User.objects.filter(role='SO')
    )

    class Meta:
        model = Complaint
        fields = [
            'id',
            'failure_node',
            'failure_node_id',
            'recovery_method',
            'recovery_method_id',
            'vehicle',
            'vehicle_id',
            'downtime',
            'operating_time',
            'failure_description',
            'failure_date',
            'recovery_date',
            'spare_parts',
            'service',
            'service_id'
        ]
        extra_kwargs = {
            'failure_node_id': {'write_only': True},
            'recovery_method_id': {'write_only': True},
            'vehicle_id': {'write_only': True},
            'service_id': {'write_only': True},
        }

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_vehicle(self, obj):
        return {
            'id': obj.vehicle.id,
            'number': obj.vehicle.factory_number
        }

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_service(self, obj):
        return {
            'id': obj.service.id,
            'fullname': obj.service.fullname,
        }