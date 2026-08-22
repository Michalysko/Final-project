import unicodedata
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsAdminUserRole
from .models import InsuredPerson, InsuranceContract, InsuranceType
from .serializers import (
    InsuredPersonSerializer,
    InsuranceTypeSerializer,
    InsuranceContractSerializer,
    UserSerializer,
)


def remove_accents(value):
    return ''.join(
        character for character in unicodedata.normalize('NFKD', value)
        if not unicodedata.combining(character)
    ).lower()


class InsuredPersonViewSet(viewsets.ModelViewSet):
    serializer_class = InsuredPersonSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        queryset = InsuredPerson.objects.all().order_by('last_name', 'first_name')

        name = self.request.query_params.get('name', '')
        address = self.request.query_params.get('address', '')
        phone_number = self.request.query_params.get('phone_number', '')

        if name:
            name_parts = [
                remove_accents(name_part)
                for name_part in name.split()
            ]
            matching_ids = []

            for person in queryset:
                full_name = remove_accents(
                    f'{person.first_name} {person.last_name}'
                )

                if all(name_part in full_name for name_part in name_parts):
                    matching_ids.append(person.id)

            queryset = queryset.filter(id__in=matching_ids)

        if address:
            normalized_address = remove_accents(address)
            matching_ids = []

            for person in queryset:
                person_address = remove_accents(person.address)

                if normalized_address in person_address:
                    matching_ids.append(person.id)

            queryset = queryset.filter(id__in=matching_ids)

        if phone_number:
            queryset = queryset.filter(phone_number__icontains=phone_number)

        return queryset


class InsuranceTypeViewSet(viewsets.ModelViewSet):
    queryset = InsuranceType.objects.all()
    serializer_class = InsuranceTypeSerializer
    permission_classes = [IsAdminUserRole]


class InsuranceContractViewSet(viewsets.ModelViewSet):
    queryset = InsuranceContract.objects.all()
    serializer_class = InsuranceContractSerializer
    permission_classes = [IsAdminUserRole]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'insured_person'):
            return Response(
                {'detail': 'No insured person profile is linked to this user.'},
                status=404
            )
        serializer = InsuredPersonSerializer(request.user.insured_person)
        return Response(serializer.data)


class MyContractsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, 'insured_person'):
            return Response(
                {'detail': 'No insured person profile is linked to this user.'},
                status=404
            )
        contracts = request.user.insured_person.insurance_contracts.all()
        serializer = InsuranceContractSerializer(contracts, many=True)
        return Response(serializer.data)
