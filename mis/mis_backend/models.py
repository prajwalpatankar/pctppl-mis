from django.db import models
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.db.models.constraints import Deferrable
from django.db.models.lookups import LessThan, LessThanOrEqual
from django.utils import timezone
from django.db.models.query import prefetch_related_objects

# Create your models here.


class UserModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=30, default="")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

# store, project_man, HO, admin
class Roles(models.Model):
    role = models.CharField(max_length=25, default="")
    admin = models.BooleanField(default=False)
    pr = models.BooleanField(default=False)
    pr_gm = models.BooleanField(default=False)
    po = models.BooleanField(default=False)
    grn = models.BooleanField(default=False)
    challan = models.BooleanField(default=False)
    stock = models.BooleanField(default=False)
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

class Projects(models.Model):
    project_name = models.CharField(max_length=200, default="")
    identifier = models.CharField(max_length=5)
    location = models.CharField(max_length=500, default="")
    completed = models.BooleanField(default=False)
    user = models.CharField(max_length=4, default="1")
    pm = models.CharField(max_length=4, default="1")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

class HSAN(models.Model):
    hsan_id = models.IntegerField()
    tax = models.FloatField()
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

class Material_category(models.Model):
    cat_id = models.CharField(max_length=50)
    cat_name = models.CharField(max_length=50)

class Material_sub_category(models.Model):
    subcat_id = models.CharField(max_length=50)
    subcat_name = models.CharField(max_length=150)
    cat_id = models.CharField(max_length=50, default="-")  #FK

class Material_master(models.Model):
    mat_id = models.CharField(unique=True,max_length=20,default=0)
    cat_id = models.CharField(max_length=50,default="N") #FK
    subcat_id = models.CharField(max_length=50, default="N") #FK
    desc = models.CharField(max_length=250,default="N")
    unit = models.CharField(max_length=50,default="N")
    hsan_id = models.IntegerField(default=0) #FK

class Stock_mst(models.Model): # monthly, overall statements  (FK date)
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    recieved = models.IntegerField(default=0)
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")


class Purchase_Requisition_mst(models.Model): # delivery date
    req_id = models.CharField(max_length=13)
    message = models.CharField(default="", max_length=200)
    project_id = models.ForeignKey(Projects, default=7, on_delete=models.CASCADE)
    made_by = models.ForeignKey(User, default=1,on_delete=models.CASCADE)
    # isapproved_site = models.CharField(default="N",max_length=3) # y=approved n=defualt r=rejected
    completed = models.CharField(default="N",max_length=3) 
    isapproved_master = models.CharField(default="N",max_length=3) 
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")
    

class Purchase_Requisition_details(models.Model):
    header_ref_id = models.ForeignKey("Purchase_Requisition_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.FloatField(default=0)
    description = models.CharField(default="", max_length=200)  #change to brand, not compulsory
    unit = models.CharField(max_length=50,default="N")
    required_date = models.DateTimeField()

class Supplier(models.Model):
    supp_name = models.CharField(max_length=200, default="")
    supp_address = models.CharField(max_length=200, default="")
    contact_person = models.CharField(max_length=13, default="")
    contact = models.CharField(max_length=15, default="")
    state = models.CharField(max_length=30, default="")
    gst =  models.CharField(max_length=20, default="")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")
    
class Purchase_Order_mst(models.Model): 
    # + billing_address (fixed, no manual entry required, add default)
    # contact_person (ours) 
    # FOr printing : [ + billing_address (fixed, no manual entry required, add default) ] , [GST both] , [state (both)] 
    po_id = models.CharField(max_length=13)
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="project_id")
    # project_name = models.CharField(max_length=200, default="")
    delivery_loc = models.CharField(max_length=200, default="")
    supp_id = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="ssup_id")
    complete = models.CharField(max_length=3, default="N")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")
    # total amount = sum of all items in PO 
    # add breakup of gst and basic ( print only) 
    # + discount total
    # + other charges ( if any) 
    # gross value
    # + gross amount in words ( print)
    # deliver_schedule (date) 
    # payment terms
    # other terms

class Purchase_Order_details(models.Model):
    #  + discount
    #  + total_basic_amount = rate* quantity
    #  tax_rate_amounts -> CGST + SGST (ref hsan )
    #  total = total_basic_amount + tax_rate_amounts
    header_ref_id = models.ForeignKey("Purchase_Order_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")
    item_rate = models.FloatField(default=0)
    complete = models.CharField(max_length=3, default="N")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

class Goods_Receipt_Note_mst(models.Model):
    grn_id = models.IntegerField()
    po_id = models.IntegerField()
    project_id = models.IntegerField()
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

class Goods_Receipt_Note_details(models.Model):
    header_ref_id = models.ForeignKey("Goods_Receipt_Note_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    rec_quant = models.IntegerField(default=0) # challan & accepted
    unit = models.CharField(max_length=50,default="N")
    item_rate = models.FloatField(default=0)
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

class Issue(models.Model):
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

class Delivery_Challan_mst(models.Model):
    from_project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="from_project")
    to_project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="to_project")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")   

class Delivery_Challan_details(models.Model):
    header_ref_id = models.ForeignKey("Delivery_Challan_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")


# # Uploading excel 
# class File_Upload(models.Model):
#     project_id = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="project_id")
#     excel = models.FileField(blank=True, default='')

class Req_Limit(models.Model): 
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    utilized = models.IntegerField(default=0)
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")