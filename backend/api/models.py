from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    CLIENT = "CL"
    SERVICE = "SO"
    MANAGER = "MA"
    ROLES = {
        CLIENT: 'Клиент',
        SERVICE: 'Сервисная организация',
        MANAGER: 'Менеджер'
    }
    role = models.CharField(max_length=2, choices=ROLES, default=CLIENT)
    fullname = models.CharField(max_length=100, null=True, blank=True)
    info = models.TextField(null=True, blank=True)

    def __str__(self):
        if self.fullname:
            return self.fullname
        return self.username


class ReferenceBook(models.Model):
    REFERENCE_TYPES = {
        'vehicle_model': 'Модель техники',
        'engine_model': 'Модель двигателя',
        'transmission_model': 'Модель трансмиссии',
        'drive_axle_model': 'Модель ведущего моста',
        'steering_axle_model': 'Модель управляемого моста',
        'maintenance_type': 'Вид ТО',
        'failure_node': 'Узел отказа',
        'recovery_method': 'Способ восстановления'
    }
    reference_type = models.CharField(max_length=20, choices=REFERENCE_TYPES, verbose_name='Тип справочника')
    name = models.CharField(max_length=100, verbose_name='Название')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    factory_number = models.CharField(max_length=100, unique=True, verbose_name='Зав. № машины',
                                         error_messages={'unique': 'Номер уже используется'})
    vehicle_model = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'vehicle_model'},
                                      on_delete=models.CASCADE, related_name='vehicle_models',
                                      verbose_name='Модель техники')
    engine_model = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'engine_model'},
                                     on_delete=models.CASCADE, related_name='engine_models',
                                     verbose_name='Модель двигателя')
    engine_number = models.CharField(max_length=100, unique=True, verbose_name='Зав. № двигателя',
                                         error_messages={'unique': 'Номер уже используется'})
    transmission_model = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'transmission_model'},
                                           on_delete=models.CASCADE, related_name='transmission_models',
                                           verbose_name='Модель трансмиссии')
    transmission_number = models.CharField(max_length=100, unique=True, verbose_name='Зав. № трансмиссии',
                                         error_messages={'unique': 'Номер уже используется'})
    drive_axle_model = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'drive_axle_model'},
                                         on_delete=models.CASCADE, related_name='drive_axle_models',
                                         verbose_name='Модель ведущего моста')
    drive_axle_number = models.CharField(max_length=100, unique=True, verbose_name='Зав. № ведущего моста',
                                         error_messages={'unique': 'Номер уже используется'})
    steering_axle_model = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'steering_axle_model'},
                                            on_delete=models.CASCADE, related_name='steering_axle_models',
                                            verbose_name='Модель управляемого моста')
    steering_axle_number = models.CharField(max_length=100, unique=True, verbose_name='Зав. № управляемого моста',
                                         error_messages={'unique': 'Номер уже используется'})
    supply_contract = models.CharField(max_length=100, verbose_name='Договор поставки №, дата')
    shipping_date = models.DateField(verbose_name='Дата отгрузки с завода')
    consignee = models.CharField(max_length=100, verbose_name='Грузополучатель (конечный потребитель)')
    delivery_address = models.CharField(max_length=100, verbose_name='Адрес поставки (эксплуатации)')
    equipment = models.TextField(default='Стандарт', verbose_name='Комплектация (доп. опции)')
    client = models.ForeignKey(User, limit_choices_to={'role': 'CL'}, on_delete=models.CASCADE,
                               related_name='clients', verbose_name='Клиент')
    service = models.ForeignKey(User, limit_choices_to={'role': 'SO'}, on_delete=models.CASCADE,
                                related_name='services', verbose_name='Сервисная компания')

    def __str__(self):
        return self.factory_number

class Maintenance(models.Model):
    maintenance_type = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'maintenance_type'},
                                         on_delete=models.CASCADE, related_name='maintenance_types',
                                         verbose_name='Вид ТО')
    maintenance_date = models.DateField(verbose_name='Дата проведения ТО')
    operating_time = models.IntegerField(verbose_name='Наработка, м/час')
    work_order_number = models.CharField(max_length=100, unique=True, verbose_name='№ заказ-наряда',
                                         error_messages={'unique': 'Номер уже используется'})
    work_order_date = models.DateField(verbose_name='Дата заказ-наряда')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='maintenances', verbose_name='Машина')
    service = models.ForeignKey(User, limit_choices_to={'role': 'SO'}, on_delete=models.SET_NULL,
                                null=True, blank=True, related_name='maintenance_services',
                                verbose_name='Организация, проводившая ТО')

    def get_value(self):
        if self.service is None:
            return 'самостоятельно'
        return str(self.service)


class Complaint(models.Model):
    failure_date = models.DateField(verbose_name='Дата отказа')
    operating_time = models.IntegerField(verbose_name='Наработка, м/час')
    failure_node = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'failure_node'},
                                     on_delete=models.CASCADE, related_name='failure_nodes',
                                     verbose_name='Узел отказа')
    failure_description = models.CharField(max_length=100, verbose_name='Описание отказа')
    recovery_method = models.ForeignKey(ReferenceBook, limit_choices_to={'reference_type': 'recovery_method'},
                                        on_delete=models.CASCADE, related_name='recovery_methods',
                                        verbose_name='Способ восстановления')
    spare_parts = models.CharField(max_length=100, null=True, blank=True, verbose_name='Используемые запасные части')
    recovery_date = models.DateField(verbose_name='Дата восстановления')
    downtime = models.IntegerField(editable=False, verbose_name='Время простоя техники')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='complaints', verbose_name='Mашина')
    service = models.ForeignKey(User, limit_choices_to={'role': 'SO'}, on_delete=models.CASCADE,
                                related_name='complaint_services', verbose_name='Cервисная компания')

    def save(self, *args, **kwargs):
        self.downtime = (self.recovery_date - self.failure_date).days
        super().save(*args, **kwargs)
