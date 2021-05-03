from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from .import views

router = routers.DefaultRouter()
router.register(r'projects', views.Projects_Viweset)
router.register(r'material-master', views.Material_master_Viewset)
router.register(r'material-category', views.Material_category_Viewset)
router.register(r'material-sub-category', views.Material_sub_category_Viewset)
router.register(r'requisition', views.Purchase_Requisition_Viewset_mst)
router.register(r'requisition-det', views.Purchase_Requisition_Viewset_details)
router.register(r'po', views.Purchase_Order_mst_Viewset)
router.register(r'po-det', views.Purchase_Order_details_Viewset)
router.register(r'grn', views.Goods_Receipt_Note_mst_Viewset)
router.register(r'grn-det', views.Goods_Receipt_Note_details_Viewset)
router.register(r'stock', views.Stock_viewset)
router.register(r'userdata', views.User_Viweset)
router.register(r'role', views.Roles_Viewset)


urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
