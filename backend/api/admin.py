from django.conf import settings
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.core.mail import send_mail
import string
import secrets

from .models import User, ReferenceBook, Vehicle, Maintenance, Complaint


def generate_password():
    letters = string.ascii_letters
    digits = string.digits
    symbols = '!@#$%^&*'
    chars = letters + digits + symbols
    password = ''.join(secrets.choice(chars) for _ in range(8))
    return password

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'role', 'email', 'fullname', 'is_staff']
    list_filter = ['username', 'role', 'email', 'fullname', 'is_staff']

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('role', 'fullname', 'info')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')})
    )

    add_fieldsets = [
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'fullname')
        })
    ]

    def save_model(self, request, obj, form, change):
        if not change:
            generated_password = generate_password()
            obj.set_password(generated_password)
            subject = r'Данные для входа в Электронную сервисную книжку "Мой Силант"'
            message = f'Ваш логин: {obj.username}\nВаш пароль: {generated_password}'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [obj.email]

            send_mail(subject, message, from_email, recipient_list)

        super().save_model(request, obj, form, change)


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('factory_number', 'get_vehicle_model', 'get_client', 'get_service')
    list_filter = ('factory_number',)

    def get_vehicle_model(self, obj):
        return obj.vehicle_model.name
    get_vehicle_model.short_description = 'Модель техники'

    def get_client(self, obj):
        return obj.client.fullname
    get_client.short_description = 'Клиент'

    def get_service(self, obj):
        return obj.service.fullname
    get_service.short_description = 'Сервисная компания'


@admin.register(ReferenceBook)
class ReferenceBookAdmin(admin.ModelAdmin):
    list_display = ('reference_type', 'name', 'description')
    list_filter = ('reference_type',)


@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ('get_maintenance_type', 'maintenance_date', 'get_vehicle', 'get_service')
    list_filter = ('vehicle', 'maintenance_type')

    def get_maintenance_type(self, obj):
        return obj.maintenance_type.name
    get_maintenance_type.short_description = 'Вид ТО'


    def get_vehicle(self, obj):
        return obj.vehicle.factory_number
    get_vehicle.short_description = 'Машина'

    def get_service(self, obj):
        if obj.service is not None:
            return obj.service.fullname
        return 'самостоятельно'
    get_service.short_description = 'Организация, проводившая ТО'


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('get_vehicle', 'operating_time', 'failure_date', 'recovery_date', 'get_recovery_method')
    list_filter = ('vehicle',)

    def get_recovery_method(self, obj):
        return obj.recovery_method.name
    get_recovery_method.short_description = 'Способ восстановления'

    def get_vehicle(self, obj):
        return obj.vehicle.factory_number
    get_vehicle.short_description = 'Машина'
