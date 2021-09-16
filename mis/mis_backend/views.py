from django.shortcuts import render
from .models import *
from .serializers import *
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import filters
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters import FilterSet, DateFromToRangeFilter, CharFilter
from django.db import models as django_models
from django.db.models.query import Prefetch


from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from pyexcel_xlsx import get_data



@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get', 'head', 'post']

    def get(self, request, *args, **kwargs):
        serializer = UserSerializerWithToken(User.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    filterset_fields = ['username']

# Projects and overall setup
class User_Viweset(viewsets.ModelViewSet):
    serializer_class = UserCustomSerializer
    queryset = UserModel.objects.all()
    filterset_fields = ['user']

class Roles_Viewset(viewsets.ModelViewSet):
    serializer_class = RolesSerializer
    queryset = Roles.objects.all()

class Projects_Viweset(viewsets.ModelViewSet):
    serializer_class = ProjectsSerializer
    queryset = Projects.objects.all()
    filterset_fields = ['project_name','location','user', 'pm']   


class StockFilter(FilterSet): #filter for date range
    created_date_time = DateFromToRangeFilter()
    class Meta:
        model = Stock_mst
        fields  = ('__all__')

class Stock_mst_viewset(viewsets.ModelViewSet):
    serializer_class = StockSerializerMaster
    queryset = Stock_mst.objects.all()    
    filterset_fields = ['project_id','mat_id']
    filter_class = StockFilter
   
# Material
class Material_master_Viewset(viewsets.ModelViewSet):
    queryset = Material_master.objects.all()
    serializer_class = MaterialSerializer
    # filterset_fields = ['cat_id','subcat_id','mat_id','desc']
    filter_backends = [filters.SearchFilter]
    search_fields = ['desc', 'subcat_id']

class Material_category_Viewset(viewsets.ModelViewSet):
    queryset = Material_category.objects.all()
    serializer_class = MaterialCategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['cat_name']

class Material_sub_category_Viewset(viewsets.ModelViewSet):
    queryset = Material_sub_category.objects.all()
    serializer_class = MaterialSubCategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['subcat_name', 'cat_id']

# Suppliers
class Supplier_Viewset(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['supp_name']

# Purchase Requisition
class Purchase_Requisition_Viewset_mst(viewsets.ModelViewSet):
    serializer_class = RequisitionSerializerMst
    queryset = Purchase_Requisition_mst.objects.all()
    filterset_fields = ['isapproved_master', 'project_id', 'completed']

class Purchase_Requisition_Viewset_details(viewsets.ModelViewSet):
    serializer_class = RequisitionSerializerDetails
    queryset = Purchase_Requisition_details.objects.all()
    filterset_fields = ['project_id']

# Purchase Order
class Purchase_Order_mst_Viewset(viewsets.ModelViewSet):
    serializer_class = PurchaseOrderMstSerializer
    queryset = Purchase_Order_mst.objects.all()

class Purchase_Order_details_Viewset(viewsets.ModelViewSet):
    serializer_class = PurchaseOrderDetailsSerializer
    queryset = Purchase_Order_details.objects.all()

# Goods Reciept Note

class GrnFilter(FilterSet): #filter for date range
    created_date_time = DateFromToRangeFilter()
    class Meta:
        model = Goods_Receipt_Note_details
        fields  = ['created_date_time', 'mat_id']


class Goods_Receipt_Note_mst_Viewset(viewsets.ModelViewSet):
    serializer_class = GoodsReceiptNoteMstSerializer
    queryset = Goods_Receipt_Note_mst.objects.all()
    filterset_fields = ['project_id', 'initialItemRow__mat_id']

class Goods_Receipt_Note_details_Viewset(viewsets.ModelViewSet):
    serializer_class = GoodsReceiptNoteDetailsSerializer
    queryset = Goods_Receipt_Note_details.objects.all()
    filter_class = GrnFilter







# Material Issue
class Issue_ViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()

# Challan
class Delivery_Challan_mst_Viewset(viewsets.ModelViewSet):
    serializer_class = DeliveryChallanMstSerializer
    queryset = Delivery_Challan_mst.objects.all()
    filterset_fields = ['to_project', 'initialItemRow__mat_id']
    
class Delivery_Challan_details_Viewset(viewsets.ModelViewSet):
    serializer_class = DeliveryChallanDetailsSerializer
    queryset = Delivery_Challan_details.objects.all()


class ReqLimitViewSet(viewsets.ModelViewSet):
    queryset = Req_Limit.objects.all()
    serializer_class = Req_Limit_Serializer
    filterset_fields = ['project_id','mat_id', 'mat_name']

class HSNViewset(viewsets.ModelViewSet):
    queryset = HSN.objects.all()
    serializer_class = HSN_Serializer


