from django.db import models
from django.contrib.auth.models import User

class InsuredPerson(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="insured_person"
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class InsuranceType(models.Model):
    name = models.CharField(max_length=100)
    default_amount = models.DecimalField(max_digits=12, decimal_places=2)
    subject = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class InsuranceContract(models.Model):
    insured_person = models.ForeignKey(
        InsuredPerson,
        on_delete=models.CASCADE,
        related_name="insurance_contracts"
    )
    insurance_type = models.ForeignKey(
        InsuranceType,
        on_delete=models.PROTECT,
        related_name="contracts"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    contract_date = models.DateField()
    valid_until = models.DateField()

    def __str__(self):
        return f"{self.insurance_type.name} - {self.insured_person}"