from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin

# Register your models here.
admin.site.register(Purchase_Requisition_mst)
admin.site.register(Purchase_Order_mst)
admin.site.register(UserModel)
admin.site.register(Projects)
admin.site.register(Stock_mst)
admin.site.register(Roles)
admin.site.register(Goods_Receipt_Note_mst)
admin.site.register(Supplier)
admin.site.register(Material)
admin.site.register(Delivery_Challan_mst)
admin.site.register(Issue)
# admin.site.register(File_Upload)

@admin.register(Material_master)
@admin.register(Material_category)
@admin.register(Material_sub_category)
@admin.register(Req_Limit)
class userdataa(ImportExportModelAdmin):
    pass


# [
#     {
#         "id": 1,
#         "role": "admin",
#         "admin": "Y",
#         "pr": "Y",
#         "pr_gm": "Y",
#         "po": "Y",
#         "grn": "Y",
#         "challan": "Y",
#         "stock": "Y"
#     },
#     {
#         "id": 2,
#         "role": "Project Manager",
#         "admin": "N",
#         "pr": "Y",
#         "pr_gm": "Y",
#         "po": "N",
#         "grn": "Y",
#         "challan": "Y",
#         "stock": "Y"
#     },
#     {
#         "id": 3,
#         "role": "Store",
#         "admin": "N",
#         "pr": "Y",
#         "pr_gm": "N",
#         "po": "N",
#         "grn": "Y",
#         "challan": "Y",
#         "stock": "Y"
#     },
#     {
#         "id": 4,
#         "role": "Purchase Officer",
#         "admin": "N",
#         "pr": "N",
#         "pr_gm": "N",
#         "po": "Y",
#         "grn": "N",
#         "challan": "N",
#         "stock": "Y"
#     }
# ]