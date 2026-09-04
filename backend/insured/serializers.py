from django.contrib.auth.models import User
from rest_framework import serializers

from .models import InsuredPerson, InsuranceContract, InsuranceType
import re

class InsuranceContractSerializer(serializers.ModelSerializer):
    insurance_type_name_en = serializers.CharField(
        source='insurance_type.name_en',
        read_only=True
    )
    insurance_type_name_cs = serializers.CharField(
        source='insurance_type.name_cs',
        read_only=True
    )
    insured_person_name = serializers.CharField(
        source='insured_person.__str__',
        read_only=True
    )

    class Meta:
        model = InsuranceContract
        fields = [
            'id',
            'insured_person',
            'insured_person_name',
            'insurance_type',
            'insurance_type_name_en',
            'insurance_type_name_cs',
            'subject',
            'amount',
            'contract_date',
            'valid_until',
        ]

    def validate_subject(self, subject):
        if len(subject.strip()) < 2:
            raise serializers.ValidationError(
                'Subject must contain at least 2 characters.'
            )
        return subject

    def validate_amount(self, amount):
        if amount <= 0:
            raise serializers.ValidationError(
                'Amount must be greater than zero.'
            )
        return amount

    def validate(self, data):
        contract_date = data.get('contract_date')
        valid_until = data.get('valid_until')

        if contract_date and valid_until and valid_until <= contract_date:
            raise serializers.ValidationError(
                'Valid until must be later than contract date.'
            )
        return data

class InsuredPersonSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    insurance_contracts = InsuranceContractSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = InsuredPerson
        fields = [
            'id',
            'username',
            'password',
            'first_name',
            'last_name',
            'age',
            'address',
            'phone_number',
            'insurance_contracts',
        ]

    def validate_username(self, username):
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('This username is already taken.')

        return username

    def validate_first_name(self, first_name):
        if len(first_name.strip()) < 2:
            raise serializers.ValidationError(
                'First name must contain at least 2 characters.'
            )
        return first_name

    def validate_last_name(self, last_name):
        if len(last_name.strip()) < 2:
            raise serializers.ValidationError(
                'Last name must contain at least 2 characters.'
            )
        return last_name

    def validate_age(self, age):
        if age < 0 or age > 120:
            raise serializers.ValidationError(
                'Age must be between 0 and 120.'
            )
        return age

    def validate_address(self, address):
        if len(address.strip()) < 5:
            raise serializers.ValidationError(
                'Address must contain at least 5 characters.'
            )
        return address

    def validate_phone_number(self, phone_number):
        phone_pattern = r'^\+?[0-9 ]{9,20}$'
        if not re.match(phone_pattern, phone_number):
            raise serializers.ValidationError(
                'Phone number must contain 9 to 20 characters: numbers, spaces, and optional plus sign.'
            )
        return phone_number

    def create(self, validated_data):
        username = validated_data.pop('username', '')
        password = validated_data.pop('password', '')

        if not username:
            raise serializers.ValidationError({'username': 'This field is required.'})

        if not password:
            raise serializers.ValidationError({'password': 'This field is required.'})

        user = User.objects.create_user(
            username=username,
            password=password,
        )

        return InsuredPerson.objects.create(
            user=user,
            **validated_data,
        )

    def update(self, instance, validated_data):
        validated_data.pop('username', None)
        validated_data.pop('password', None)
        return super().update(instance, validated_data)


class InsuranceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceType
        fields = [
            'id',
            'name_en',
            'name_cs',
            'default_amount',
        ]

    def validate_name_en(self, name_en):
        if len(name_en.strip()) < 2:
            raise serializers.ValidationError(
                'Name must contain at least 2 characters.'
            )
        return name_en

    def validate_name_cs(self, name_cs):
        if len(name_cs.strip()) < 2:
            raise serializers.ValidationError(
                'Name must contain at least 2 characters.'
            )
        return name_cs

    def validate_default_amount(self, default_amount):
        if default_amount <= 0:
            raise serializers.ValidationError(
                'Default amount must be greater than zero.'
            )
        return default_amount


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    insured_person_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'is_staff',
            'is_superuser',
            'is_admin',
            'insured_person_id',
        ]

    def get_is_admin(self, user):
        return user.is_superuser or user.is_staff

    def get_insured_person_id(self, user):
        if hasattr(user, 'insured_person'):
            return user.insured_person.id

        return None
