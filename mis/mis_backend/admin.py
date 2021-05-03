from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin

# Register your models here.
admin.site.register(Purchase_Requisition_mst)
admin.site.register(Purchase_Requisition_details)
admin.site.register(Purchase_Order_mst)
admin.site.register(Purchase_Order_details)

@admin.register(Material_master)
@admin.register(Material_category)
@admin.register(Material_sub_category)
class userdataa(ImportExportModelAdmin):
    pass