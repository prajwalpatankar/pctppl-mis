from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework import filters


# Projects and overall setup
class User_Viweset(viewsets.ModelViewSet):
    serializer_class = UsersSerializer
    queryset = Userdata.objects.all()
    filterset_fields = ['username','password']

class Roles_Viewset(viewsets.ModelViewSet):
    serializer_class = RolesSerializer
    queryset = Roles.objects.all()

class Projects_Viweset(viewsets.ModelViewSet):
    serializer_class = ProjectsSerializer
    queryset = Projects.objects.all()

class Stock_viewset(viewsets.ModelViewSet):
    serializer_class = StockSerializerDetails
    queryset = Stock_details.objects.all()
    
   
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

# Purchase Requisition
class Purchase_Requisition_Viewset_mst(viewsets.ModelViewSet):
    serializer_class = RequisitionSerializerMst
    queryset = Purchase_Requisition_mst.objects.all()
    filterset_fields = ['isapproved_site', 'isapproved_master']

class Purchase_Requisition_Viewset_details(viewsets.ModelViewSet):
    serializer_class = RequisitionSerializerDetails
    queryset = Purchase_Requisition_details.objects.all()

# Purchase Order
class Purchase_Order_mst_Viewset(viewsets.ModelViewSet):
    serializer_class = PurchaseOrderMstSerializer
    queryset = Purchase_Order_mst.objects.all()

class Purchase_Order_details_Viewset(viewsets.ModelViewSet):
    serializer_class = PurchaseOrderDetailsSerializer
    queryset = Purchase_Order_details.objects.all()

# Goods Reciept Note
class Goods_Receipt_Note_mst_Viewset(viewsets.ModelViewSet):
    serializer_class = GoodsReceiptNoteMstSerializer
    queryset = Goods_Receipt_Note_mst.objects.all()

class Goods_Receipt_Note_details_Viewset(viewsets.ModelViewSet):
    serializer_class = GoodsReceiptNoteDetailsSerializer
    queryset = Goods_Receipt_Note_details.objects.all()

# Challan

