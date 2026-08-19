from django.contrib import admin
from .models import InsuredPerson, InsuranceContract, InsuranceType


@admin.register(InsuredPerson)
class InsuredPersonAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'first_name',
        'last_name',
        'age',
        'phone_number',
    )
    search_fields = (
        'user__username',
        'first_name',
        'last_name',
        'phone_number',
    )


@admin.register(InsuranceType)
class InsuranceTypeAdmin(admin.ModelAdmin):
    list_display = (
        'name_en',
        'name_cs',
        'default_amount',
    )
    search_fields = (
        'name_en',
        'name_cs',
    )


@admin.register(InsuranceContract)
class InsuranceContractAdmin(admin.ModelAdmin):
    list_display = (
        'insured_person',
        'insurance_type',
        'subject',
        'amount',
        'contract_date',
        'valid_until'
    )
    list_filter = (
        'insurance_type',
        'contract_date',
        'valid_until',
    )
    search_fields = (
        'insured_person__first_name',
        'insured_person__last_name',
        'insurance_type__name_en',
        'insurance_type__name_cs',
        'subject',
    )
