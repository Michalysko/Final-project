from os import name

from django.urls import path

from rest_framework.routers import DefaultRouter
from .views import (
    InsuredPersonViewSet,
    InsuranceTypeViewSet,
    InsuranceContractViewSet,
    CurrentUserView,
    MyProfileView,
    MyContractsView
)

router = DefaultRouter()
router.register('insured-people', InsuredPersonViewSet, basename='insured-person')
router.register('insurance-types', InsuranceTypeViewSet, basename='insurance-type')
router.register('insurance-contracts', InsuranceContractViewSet,basename='insurance-contract')

urlpatterns = [
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('my-profile/', MyProfileView.as_view(), name='my-profile'),
    path('my-contracts/', MyContractsView.as_view(), name='my-contracts'),
]

urlpatterns += router.urls