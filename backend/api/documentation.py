from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample, OpenApiResponse
from drf_spectacular.types import OpenApiTypes

from .serializers import VehicleSerializer, MaintenanceSerializer, ComplaintSerializer, ReferenceBookSerializer, \
    ServiceOrganizationSerializer, ClientsSerializer

vehicle_schema = extend_schema_view(
    list=extend_schema(
        summary="Получить список всех машин",
        description="Возвращает список всех машин с учетом прав доступа пользователя.",
        responses={200: VehicleSerializer(many=True),
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа для авторизованного пользователя",
                value=[
                    {
                        "id": 1,
                        "factory_number": "0017",
                        "vehicle_model": {
                            "id": 1,
                            "reference_type": "vehicle_model",
                            "reference_type_display": "Модель техники",
                            "name": "ПД1,5",
                            "description": "Дизельный погрузчик, грузоподъемность 1,5 тонны. Надежный для складских и строительных работ."
                        },
                        "vehicle_model_id": 1,
                        "engine_model": {
                            "id": 11,
                            "reference_type": "engine_model",
                            "reference_type_display": "Модель двигателя",
                            "name": "Kubota D1803",
                            "description": "Дизельный двигатель, 3 цилиндра, 1,8 л. Компактный, экономичный, для малогабаритной техники и генераторов."
                        },
                        "engine_model_id": 11,
                        "engine_number": "7ML1035",
                        "transmission_model": {
                            "id": 12,
                            "reference_type": "transmission_model",
                            "reference_type_display": "Модель трансмиссии",
                            "name": "10VA-00105",
                            "description": "Гидромеханическая трансмиссия. Надежная, для погрузчиков и спецтехники."
                        },
                        "transmission_model_id": 12,
                        "transmission_number": "21D0108251",
                        "drive_axle_model": {
                            "id": 16,
                            "reference_type": "drive_axle_model",
                            "reference_type_display": "Модель ведущего моста",
                            "name": "20VA-00101",
                            "description": "Ведущий мост для погрузчиков. Надежный, с высокой грузоподъемностью."
                        },
                        "drive_axle_model_id": 16,
                        "drive_axle_number": "21D0107997",
                        "steering_axle_model": {
                            "id": 20,
                            "reference_type": "steering_axle_model",
                            "reference_type_display": "Модель управляемого моста",
                            "name": "VS20-00001",
                            "description": "Управляемый мост для погрузчиков. Надежный, с высокой маневренностью."
                        },
                        "steering_axle_model_id": 20,
                        "steering_axle_number": "21D0093265",
                        "supply_contract": "ДГ-0123/2022, 02.02.2022",
                        "shipping_date": "2022-03-09",
                        "consignee": "ИП Трудников С.В.",
                        "delivery_address": "п. Знаменский,  Респ. Марий Эл",
                        "equipment": "1. Гидролинии с БРС;\r\n2. Дополнительеная установка кабины",
                        "client": {
                            "id": 2,
                            "fullname": "ИП Трудников С.В."
                        },
                        "client_id": 2,
                        "service": {
                            "id": 3,
                            "fullname": "ООО Промышленная техника"
                        },
                        "service_id": 3
                    }
                ],
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получить информацию о конкретной машине",
        description="Возвращает полную информацию о машине по её заводскому номеру.",
        parameters=[
            OpenApiParameter(
                name="factory_number",
                location=OpenApiParameter.PATH,
                description="Уникальный заводской номер машины.",
                required=True,
                type=str
            )
        ],
        responses={200: VehicleSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value={
                    "factory_number": "0017",
                    "vehicle_model": "ПД1,5",
                    "engine_model": "Kubota D1803",
                    "engine_number": "7ML1035",
                    "transmission_model": "10VA-00105",
                    "transmission_number": "21D0108251",
                    "drive_axle_model": "20VA-00101",
                    "drive_axle_number": "21D0107997",
                    "steering_axle_model": "VS20-00001",
                    "steering_axle_number": "21D0093265"
                },
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    create=extend_schema(
        summary="Создать новую машину",
        description="Создание новой машины (доступно только менеджерам).",
        responses={201: MaintenanceSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "factory_number": "0017",
                    "vehicle_model_id": 1,
                    "engine_model_id": 11,
                    "engine_number": "7ML1035",
                    "transmission_model_id": 12,
                    "transmission_number": "21D0108251",
                    "drive_axle_model_id": 16,
                    "drive_axle_number": "21D0107997",
                    "steering_axle_model_id": 20,
                    "steering_axle_number": "21D0093265",
                    "supply_contract": "ДГ-0123/2022, 02.02.2022",
                    "shipping_date": "2022-03-09",
                    "consignee": "ИП Трудников С.В.",
                    "delivery_address": "п. Знаменский,  Респ. Марий Эл",
                    "equipment": "1. Гидролинии с БРС;\r\n2. Дополнительеная установка кабины",
                    "client_id": 2,
                    "service_id": 3,
                },
                request_only=True
            )
        ]
    ),
    update=extend_schema(
        summary="Обновить информацию о машине",
        description="Полное обновление информации о машине (доступно только менеджерам).",
        parameters=[
            OpenApiParameter(
                name="factory_number",
                location=OpenApiParameter.PATH,
                description="Уникальный заводской номер машины.",
                required=True,
                type=str
            )
        ],
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "factory_number": "0017",
                    "vehicle_model_id": 1,
                    "engine_model_id": 11,
                    "engine_number": "7ML1035",
                    "transmission_model_id": 12,
                    "transmission_number": "21D0108251",
                    "drive_axle_model_id": 16,
                    "drive_axle_number": "21D0107997",
                    "steering_axle_model_id": 20,
                    "steering_axle_number": "21D0093265",
                    "supply_contract": "ДГ-0123/2022, 02.02.2022",
                    "shipping_date": "2022-03-09",
                    "consignee": "ИП Трудников С.В.",
                    "delivery_address": "п. Знаменский,  Респ. Марий Эл",
                    "equipment": "1. Гидролинии с БРС;\r\n2. Дополнительеная установка кабины",
                    "client_id": 2,
                    "service_id": 3,
                },
                request_only=True
            )
        ],
        responses={200: VehicleSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   }
    ),
    destroy=extend_schema(
        summary="Удалить машину",
        description="Удаление машины из системы (доступно только менеджерам).",
        parameters=[
            OpenApiParameter(
                name="factory_number",
                location=OpenApiParameter.PATH,
                description="Уникальный заводской номер машины.",
                required=True,
                type=str
            )
        ],
        responses={204: None,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
    )
)

maintenance_schema = extend_schema_view(
    list=extend_schema(
        summary="Получить список всех ТО",
        description="Возвращает список технических обслуживаний с учетом прав доступа пользователя.",
        responses={200: MaintenanceSerializer(many=True),
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value=[
                    {
                        "id": 16,
                        "vehicle": {
                            "id": 1,
                            "number": "0017"
                        },
                        "vehicle_id": 1,
                        "maintenance_type": {
                            "id": 23,
                            "reference_type": "maintenance_type",
                            "reference_type_display": "Вид ТО",
                            "name": "ТО-0 (50 м/час)",
                            "description": "Первичное ТО после обкатки. Проверка креплений, уровня жидкостей, работы систем."
                        },
                        "maintenance_type_id": 23,
                        "maintenance_date": "2022-03-14",
                        "operating_time": 55,
                        "work_order_number": "#2022-70КЕ87СИЛ",
                        "work_order_date": "2022-03-12",
                        "service": {
                            "id": "",
                            "fullname": "самостоятельно"
                        }
                    }
                ],
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получить информацию о конкретном ТО",
        description="Возвращает полную информацию о техническом обслуживании по его ID.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор ТО.",
                required=True,
                type=int
            )
        ],
        responses={200: MaintenanceSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value={
                    "id": 16,
                    "vehicle": {
                        "id": 1,
                        "number": "0017"
                    },
                    "vehicle_id": 1,
                    "maintenance_type": {
                        "id": 23,
                        "reference_type": "maintenance_type",
                        "reference_type_display": "Вид ТО",
                        "name": "ТО-0 (50 м/час)",
                        "description": "Первичное ТО после обкатки. Проверка креплений, уровня жидкостей, работы систем."
                    },
                    "maintenance_type_id": 23,
                    "maintenance_date": "2022-03-14",
                    "operating_time": 55,
                    "work_order_number": "#2022-70КЕ87СИЛ",
                    "work_order_date": "2022-03-12",
                    "service": {
                        "id": "",
                        "fullname": "самостоятельно"
                    }
                },
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    create=extend_schema(
        summary="Создать новую запись ТО",
        description="Создание новой записи о техническом обслуживании.",
        responses={201: MaintenanceSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "vehicle_id": 1,
                    "maintenance_type_id": 23,
                    "maintenance_date": "2022-03-14",
                    "operating_time": 55,
                    "work_order_number": "#2022-70КЕ87СИЛ",
                    "work_order_date": "2022-03-12",
                    "service": "",
                },
                request_only=True
            ),
            OpenApiExample(
                "Пример успешного ответа",
                value=[
                    {
                        "id": 16,
                        "vehicle": {
                            "id": 1,
                            "number": "0017"
                        },
                        "vehicle_id": 1,
                        "maintenance_type": {
                            "id": 23,
                            "reference_type": "maintenance_type",
                            "reference_type_display": "Вид ТО",
                            "name": "ТО-0 (50 м/час)",
                            "description": "Первичное ТО после обкатки. Проверка креплений, уровня жидкостей, работы систем."
                        },
                        "maintenance_type_id": 23,
                        "maintenance_date": "2022-03-14",
                        "operating_time": 55,
                        "work_order_number": "#2022-70КЕ87СИЛ",
                        "work_order_date": "2022-03-12",
                        "service": {
                            "id": "",
                            "fullname": "самостоятельно"
                        }
                    }
                ],
                response_only=True,
                status_codes=["201"]
            )
        ]
    ),
    update=extend_schema(
        summary="Обновить информацию о ТО",
        description="Полное обновление информации о техническом обслуживании.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор ТО.",
                required=True,
                type=int
            )
        ],
        responses={
            200: MaintenanceSerializer,
            401: OpenApiResponse(description="Не авторизован"),
            403: OpenApiResponse(description="Нет прав доступа")
        },
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "vehicle_id": 1,
                    "maintenance_type_id": 23,
                    "maintenance_date": "2022-03-14",
                    "operating_time": 55,
                    "work_order_number": "#2022-70КЕ87СИЛ",
                    "work_order_date": "2022-03-12",
                    "service": "",
                },
                request_only=True
            )
        ]
    ),
    destroy=extend_schema(
        summary="Удалить запись ТО",
        description="Удаление записи о техническом обслуживании.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор ТО.",
                required=True,
                type=int
            )
        ],
        responses={204: None}
    )
)

complaint_schema = extend_schema_view(
    list=extend_schema(
        summary="Получить список всех рекламаций",
        description="Возвращает список рекламаций с учетом прав доступа пользователя.",
        responses={
            200: ComplaintSerializer(many=True),
            401: OpenApiResponse(description="Не авторизован"),
            403: OpenApiResponse(description="Нет прав доступа")
        },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value=[
                    {
                        "id": 1,
                        "failure_node": {
                            "id": 28,
                            "reference_type": "failure_node",
                            "reference_type_display": "Узел отказа",
                            "name": "Двигатель",
                            "description": "Основной силовой агрегат. Обеспечивает энергией для движения и работы гидравлики."
                        },
                        "failure_node_id": 28,
                        "recovery_method": {
                            "id": 34,
                            "reference_type": "recovery_method",
                            "reference_type_display": "Способ восстановления",
                            "name": "Ремонт узла",
                            "description": "Ремонт узла отказа при помощи запасных частей и расходных материалов."
                        },
                        "recovery_method_id": 34,
                        "vehicle": {
                            "id": 1,
                            "number": "0017"
                        },
                        "vehicle_id": 1,
                        "downtime": 7,
                        "operating_time": 123,
                        "failure_description": "повышенный шум",
                        "failure_date": "2022-04-01",
                        "recovery_date": "2022-04-08",
                        "spare_parts": "прокладки, прочие материалы",
                        "service": {
                            "id": 3,
                            "fullname": "ООО Промышленная техника"
                        },
                        "service_id": 3
                    }
                ],
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получить информацию о конкретной рекламации",
        description="Возвращает полную информацию о рекламации по её ID.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор рекламации.",
                required=True,
                type=int
            )
        ],
        responses={200: ComplaintSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value={
                    "id": 1,
                    "failure_node": {
                        "id": 28,
                        "reference_type": "failure_node",
                        "reference_type_display": "Узел отказа",
                        "name": "Двигатель",
                        "description": "Основной силовой агрегат. Обеспечивает энергией для движения и работы гидравлики."
                    },
                    "failure_node_id": 28,
                    "recovery_method": {
                        "id": 34,
                        "reference_type": "recovery_method",
                        "reference_type_display": "Способ восстановления",
                        "name": "Ремонт узла",
                        "description": "Ремонт узла отказа при помощи запасных частей и расходных материалов."
                    },
                    "recovery_method_id": 34,
                    "vehicle": {
                        "id": 1,
                        "number": "0017"
                    },
                    "vehicle_id": 1,
                    "downtime": 7,
                    "operating_time": 123,
                    "failure_description": "повышенный шум",
                    "failure_date": "2022-04-01",
                    "recovery_date": "2022-04-08",
                    "spare_parts": "прокладки, прочие материалы",
                    "service": {
                        "id": 3,
                        "fullname": "ООО Промышленная техника"
                    },
                    "service_id": 3
                },
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    create=extend_schema(
        summary="Создать новую рекламацию",
        description="Создание новой рекламации (доступно сервисным организациям и менеджерам).",
        responses={201: ComplaintSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "failure_node_id": 28,
                    "recovery_method_id": 34,
                    "vehicle_id": 1,
                    "operating_time": 123,
                    "failure_description": "повышенный шум",
                    "failure_date": "2022-04-01",
                    "recovery_date": "2022-04-08",
                    "spare_parts": "прокладки, прочие материалы",
                    "service_id": 3
                },
                request_only=True
            )
        ]
    ),
    update=extend_schema(
        summary="Обновить информацию о рекламации",
        description="Полное обновление информации о рекламации.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор рекламации.",
                required=True,
                type=int
            )
        ],
        responses={200: ComplaintSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "failure_node_id": 28,
                    "recovery_method_id": 34,
                    "vehicle_id": 1,
                    "operating_time": 123,
                    "failure_description": "повышенный шум",
                    "failure_date": "2022-04-01",
                    "recovery_date": "2022-04-08",
                    "spare_parts": "прокладки, прочие материалы",
                    "service_id": 3
                },
                request_only=True
            )
        ]
    ),
    destroy=extend_schema(
        summary="Удалить рекламацию",
        description="Удаление рекламации из системы.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор рекламации.",
                required=True,
                type=int
            )
        ],
        responses={204: None,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
    )
)

reference_schema = extend_schema_view(
    list=extend_schema(
        summary="Получить список справочников",
        description="Возвращает список всех справочных данных.",
        responses={200: ReferenceBookSerializer(many=True),
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value=[
                    {
                        "id": 1,
                        "reference_type": "vehicle_model",
                        "reference_type_display": "Модель техники",
                        "name": "ПД1,5",
                        "description": "Дизельный погрузчик, грузоподъемность 1,5 тонны. Надежный для складских и строительных работ."
                    },
                    {
                        "id": 2,
                        "reference_type": "vehicle_model",
                        "reference_type_display": "Модель техники",
                        "name": "ПД2,0",
                        "description": "Дизельный погрузчик, поднимает до 2,0 тонн. Универсален для складов и промышленности."
                    },
                ],
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получить информацию о конкретной записи справочника",
        description="Возвращает полную информацию о записи справочника по её ID.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор записи справочника.",
                required=True,
                type=int
            )
        ],
        responses={200: ReferenceBookSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value={
                    "id": 1,
                    "reference_type": "vehicle_model",
                    "reference_type_display": "Модель техники",
                    "name": "ПД1,5",
                    "description": "Дизельный погрузчик, грузоподъемность 1,5 тонны. Надежный для складских и строительных работ."
                },
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    create=extend_schema(
        summary="Создать новую запись в справочнике",
        description="Создание новой записи в справочнике (доступно только менеджерам).",
        responses={201: ReferenceBookSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "reference_type": "vehicle_model",
                    "name": "ПД1,5",
                    "description": "Дизельный погрузчик, грузоподъемность 1,5 тонны. Надежный для складских и строительных работ."
                },
                request_only=True
            )
        ]
    ),
    update=extend_schema(
        summary="Обновить запись в справочнике",
        description="Полное обновление записи в справочнике (доступно только менеджерам).",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор записи справочника.",
                required=True,
                type=int
            )
        ],
        examples=[
            OpenApiExample(
                "Пример успешного запроса",
                value={
                    "reference_type": "vehicle_model",
                    "name": "ПД1,5",
                    "description": "Дизельный погрузчик, грузоподъемность 1,5 тонны. Надежный для складских и строительных работ."
                },
                request_only=True
            )
        ],
        responses={200: ReferenceBookSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
    ),
    destroy=extend_schema(
        summary="Удалить запись из справочника",
        description="Удаление записи из справочника (доступно только менеджерам).",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор записи справочника.",
                required=True,
                type=int
            )
        ],
        responses={204: None,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
    )
)

services_schema = extend_schema_view(
    list=extend_schema(
        summary="Получить список сервисных организаций",
        description="Возвращает список всех сервисных организаций.",
        responses={200: ServiceOrganizationSerializer(many=True),
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value=[
                    {
                        "id": 3,
                        "fullname": "ООО Промышленная техника"
                    },
                    {
                        "id": 12,
                        "fullname": "ООО Силант"
                    }
                ],
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получить информацию о сервисной организации",
        description="Возвращает информацию о сервисной организации по её ID.",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор сервисной организации.",
                required=True,
                type=int
            )
        ],
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value={
                    "id": 3,
                    "fullname": "ООО Промышленная техника"
                },
                response_only=True,
                status_codes=["200"]
            )
        ],
        responses={200: ServiceOrganizationSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
    )
)

clients_schema = extend_schema_view(
    list=extend_schema(
        summary="Получить список клиентов",
        description="Возвращает список всех клиентов (доступно менеджерам).",
        responses={200: ClientsSerializer(many=True),
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   },
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value=[
                    {
                        "id": 2,
                        "fullname": "ИП Трудников С.В."
                    },
                    {
                        "id": 6,
                        "fullname": "ООО \"ФПК21\""
                    }
                ],
                response_only=True,
                status_codes=["200"]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получить информацию о клиенте",
        description="Возвращает информацию о клиенте по его ID (доступно менеджерам).",
        parameters=[
            OpenApiParameter(
                name="id",
                location=OpenApiParameter.PATH,
                description="Уникальный идентификатор клиента.",
                required=True,
                type=int
            )
        ],
        examples=[
            OpenApiExample(
                "Пример успешного ответа",
                value={
                    "id": 2,
                    "fullname": "ИП Трудников С.В."
                },
                response_only=True,
                status_codes=["200"]
            )
        ],
        responses={200: ClientsSerializer,
                   401: OpenApiResponse(description="Не авторизован"),
                   403: OpenApiResponse(description="Нет прав доступа")
                   }
    )
)
