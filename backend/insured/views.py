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
from django.db.models import Q

class InsuredPersonViewSet(viewsets.ModelViewSet):
    serializer_class = InsuredPersonSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        queryset = InsuredPerson.objects.all().order_by('last_name', 'first_name')

        name = self.request.query_params.get('name', '')
        address = self.request.query_params.get('address', '')
        phone_number = self.request.query_params.get('phone_number', '')

        if name:
            for name_part in name.split():
                queryset = queryset.filter(
                    Q(first_name__icontains=name_part)
                    | Q(last_name__icontains=name_part)
                )

        if address:
            queryset = queryset.filter(address__icontains=address)

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

    def get(self,request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        if not hasattr(request.user,'insured_person'):
            return Response(
                {'detail': 'No insured person profile is linked to this user.'},
                status=404
            )
        serializer = InsuredPersonSerializer(request.user.insured_person)
        return Response(serializer.data)

class MyContractsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        if not hasattr(request.user,'insured_person'):
            return Response(
                {'detail': 'No insured person profile is linked to this user.'},
                status=404
            )
        contracts = request.user.insured_person.insurance_contracts.all()
        serializer = InsuranceContractSerializer(contracts, many=True)
        return Response(serializer.data)


