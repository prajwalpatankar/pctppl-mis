from django.db import models

# Create your models here.


class Userdata(models.Model):
    username = models.CharField(max_length=25, default="")
    password = models.CharField(max_length=30, default="")
    role = models.CharField(max_length=30, default="")

# store, project_man, HO, admin
class Roles(models.Model):
    role = models.CharField(max_length=25, default="")
    admin = models.CharField(max_length=3, default="N")
    pr = models.CharField(max_length=3, default="N")
    pr_gm = models.CharField(max_length=3, default="N")
    po = models.CharField(max_length=3, default="N")
    grn = models.CharField(max_length=3, default="N")
    challan = models.CharField(max_length=3, default="N")
    stock = models.CharField(max_length=3, default="N")

class Projects(models.Model):
    project_name = models.CharField(max_length=200, default="")
    location = models.CharField(max_length=500, default="")

class HSAN(models.Model):
    hsan_id = models.IntegerField()
    tax = models.FloatField()

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

class Stock_details(models.Model):
    header_ref_id = models.ForeignKey("Projects", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")

class Purchase_Requisition_mst(models.Model):
    req_id = models.IntegerField()
    message = models.CharField(default="", max_length=200)
    isapproved_site = models.CharField(default="N",max_length=3) # y=approved n=defualt r=rejected
    isapproved_master = models.CharField(default="N",max_length=3) 

class Purchase_Requisition_details(models.Model):
    header_ref_id = models.ForeignKey("Purchase_Requisition_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    description = models.CharField(default="", max_length=200)
    unit = models.CharField(max_length=50,default="N")

class Supplier(models.Model):
    supp_id = models.IntegerField()
    supp_name = models.CharField(max_length=200, default="")
    supp_address = models.CharField(max_length=200, default="")
    contact_person = models.CharField(max_length=30, default="")
    contact = models.CharField(max_length=15, default="")
    state = models.CharField(max_length=30, default="")
    gst =  models.CharField(max_length=20, default="")
    
class Purchase_Order_mst(models.Model):
    po_id = models.IntegerField()
    project_name = models.CharField(max_length=200, default="")
    delivery_loc = models.CharField(max_length=200, default="")
    supp_id = models.IntegerField()
    complete = models.CharField(max_length=3, default="N")

class Purchase_Order_details(models.Model):
    header_ref_id = models.ForeignKey("Purchase_Order_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")
    item_rate = models.FloatField(default=0)
    complete = models.CharField(max_length=3, default="N")

class Goods_Receipt_Note_mst(models.Model):
    grn_id = models.IntegerField()
    po_id = models.IntegerField()

class Goods_Receipt_Note_details(models.Model):
    header_ref_id = models.ForeignKey("Goods_Receipt_Note_mst", default=0, verbose_name="Header Ref ID", on_delete=models.CASCADE, related_name='initialItemRow')
    mat_id = models.CharField(default="", max_length=200)
    mat_name =  models.CharField(max_length=250,default="")
    quantity = models.IntegerField(default=0)
    rec_quant = models.IntegerField(default=0)
    unit = models.CharField(max_length=50,default="N")
    item_rate = models.FloatField(default=0)







