from django.db import models
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.db.models.constraints import Deferrable
from django.db.models.fields.related import ForeignKey
from django.db.models.lookups import LessThan, LessThanOrEqual
from django.utils import timezone
from django.db.models.query import prefetch_related_objects
from rest_framework import serializers

# Use Model
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

class Material(models.Model):
    mat_name = models.CharField(max_length=100)
    hsn_id = models.CharField(max_length=10)
    unit = models.CharField(max_length=50)

class Req_Limit(models.Model): 
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE, verbose_name="Projects")
    mat_id = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name="material")
    utilized = models.FloatField(default=0)
    quantity = models.FloatField(default=0)




# add mat master 
# fields = mat_id, mat_name, hsn_id
# 
# remove cols from req limit 
# proj, utilized, quantity, unit 
# 
# from req limit page, update add feature, common ids for all, 

# add a feaure to add mats to mat master whn added a new material 
# common mat id for stst 
# add a dropdown maybe


class HSN(models.Model):
    hsn_id = models.CharField(max_length=10)
    tax_rate = models.CharField(max_length=6)

class Supplier(models.Model):
    supp_name = models.CharField(max_length=200, default="")
    supp_address = models.CharField(max_length=200, default="")
    contact_person = models.CharField(max_length=13, default="")
    contact = models.CharField(max_length=15, default="")
    state = models.CharField(max_length=30, default="")
    gst =  models.CharField(max_length=20, default="")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

#  Extras, might remove
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


# Projectwise stock
class Stock_mst(models.Model): # monthly, overall statements  (FK date)
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    recieved = models.FloatField(default=0)
    quantity = models.FloatField(default=0)
    unit = models.CharField(max_length=50,default="N")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

# Requisition Model
class Purchase_Requisition_mst(models.Model): # delivery date
    req_id = models.CharField(max_length=13)
    message = models.CharField(default="", max_length=200)
    project_id = models.ForeignKey(Projects, default=7, on_delete=models.CASCADE)
    made_by = models.CharField(max_length=20, default="")
    # isapproved_site = models.CharField(default="N",max_length=3) # y=approved n=defualt r=rejected
    completed = models.CharField(default="N",max_length=3) 
    isapproved_master = models.CharField(default="N",max_length=3) 
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")
    

class Purchase_Requisition_details(models.Model):
    header_ref_id = models.ForeignKey("Purchase_Requisition_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    hsn_id = models.CharField(max_length=10)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.FloatField(default=0)
    description = models.CharField(default="", max_length=200)  #change to brand, not compulsory
    unit = models.CharField(max_length=50,default="N")
    required_date = models.DateTimeField()

# PO model 
class Purchase_Order_mst(models.Model): 
    po_id = models.CharField(max_length=13)
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="project_id")
    supp_id = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="ssup_id")
    complete = models.CharField(max_length=3, default="N")
    contact_person = models.CharField(default=" ", max_length=30)
    payment_terms = models.CharField(default=" ", max_length=100)
    other_terms = models.CharField(default=" ", max_length=100)
    delivery_schedule = models.CharField(default=" ", max_length=20)
    transport = models.FloatField(default=0)
    other_charges = models.FloatField(default=0)
    made_by = models.CharField(max_length=20, default="")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")


class Purchase_Order_details(models.Model):
    header_ref_id = models.ForeignKey("Purchase_Order_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    hsn_id = models.CharField(max_length=10)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.FloatField(default=0)
    unit = models.CharField(max_length=50,default="N")
    item_rate = models.FloatField(default=0)
    discount = models.FloatField(default=0)
    complete = models.CharField(max_length=3, default="N")

# GRN model
class Goods_Receipt_Note_mst(models.Model):
    grn_id = models.CharField(max_length=14)
    po_id = models.CharField(max_length=13)
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="project_id_grn")
    supp_id = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="ssup_id_grn")
    vehicle_no = models.CharField(max_length=15)
    challan_no = models.CharField(max_length=15)
    challan_date = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    made_by = models.CharField(max_length=20, default="")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")

class Goods_Receipt_Note_details(models.Model):
    header_ref_id = models.ForeignKey("Goods_Receipt_Note_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    hsn_id = hsn_id = models.CharField(max_length=10)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.FloatField(default=0)
    rec_quant = models.FloatField(default=0) # challan & accepted
    accepted =  models.FloatField(default=0)
    unit = models.CharField(max_length=50,default="N")
    item_rate = models.FloatField(default=0)
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")

# Issue model
class Issue(models.Model):
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    mat_id = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantity = models.FloatField(default=0)
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")

# Material Transfer and Delivery CHallan
class Delivery_Challan_mst(models.Model):
    from_project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="from_project")
    to_project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name="to_project")
    created_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Created Date Time")
    updated_date_time = models.DateTimeField(default=timezone.localtime,verbose_name="Updated Date Time")   

class Delivery_Challan_details(models.Model):
    header_ref_id = models.ForeignKey("Delivery_Challan_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.FloatField(default=0)
    unit = models.CharField(max_length=50,default="N")

