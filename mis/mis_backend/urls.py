from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from .import views
from rest_framework_jwt.views import obtain_jwt_token
from .views import current_user, UserList

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
router.register(r'stock', views.Stock_mst_viewset) 
router.register(r'userdata', views.User_Viweset)
router.register(r'user', views.UserViewSet)
router.register(r'role', views.Roles_Viewset)
router.register(r'issue', views.Issue_ViewSet)
router.register(r'supplier', views.Supplier_Viewset)
router.register(r'sitetransfer', views.Delivery_Challan_mst_Viewset)
router.register(r'sitetransferdet', views.Delivery_Challan_details_Viewset)
router.register(r'reqlimit', views.ReqLimitViewSet)
router.register(r'hsn', views.HSNViewset)
router.register(r'materials', views.MaterialViewSet)
# router.register(r'fileupload', views.ExcelViewSet)
# router.register(r'user',views.UserList)


urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('token-auth/', obtain_jwt_token),
    path('current_user/', current_user),
    path('users/', UserList.as_view())
]
