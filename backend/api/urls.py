from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, MaintenanceViewSet, ComplaintViewSet, ReferenceBookViewSet, \
    ServiceOrganizationViewSet, ClientsViewSet

router = DefaultRouter()
router.register('vehicles', VehicleViewSet, basename='vehicles')
router.register('maintenances', MaintenanceViewSet, basename='maintenances')
router.register('complaints', ComplaintViewSet, basename='complaints')
router.register('references', ReferenceBookViewSet, basename='references')
router.register('services', ServiceOrganizationViewSet, basename='services')
router.register('clients', ClientsViewSet, basename='clients')

urlpatterns = router.urls