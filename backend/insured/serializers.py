from django.contrib.auth.models import User
from rest_framework import serializers

from .models import InsuredPerson, InsuranceContract, InsuranceType


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
