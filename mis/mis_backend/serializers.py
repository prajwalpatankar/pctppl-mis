from rest_framework import serializers
from .models import *


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userdata
        fields = '__all__'  

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'  

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material_master
        fields = '__all__'  

class MaterialCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Material_category
        fields = '__all__'  

class MaterialSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Material_sub_category
        fields = '__all__'  


class RequisitionSerializerDetails(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Purchase_Requisition_details
        fields = '__all__'

class RequisitionSerializerMst(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    initialItemRow = RequisitionSerializerDetails(many=True)
    class Meta:
        model = Purchase_Requisition_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        req = Purchase_Requisition_mst.objects.create(**validated_data)

        for item in initialItemRow:
            Purchase_Requisition_details.objects.create(**item, header_ref_id=req)
        return req

    def update(self, instance, validated_data):
        object = Purchase_Requisition_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.req_id = validated_data.get('req_id', instance.req_id)
        instance.message = validated_data.get('message', instance.message)
        instance.isapproved_site = validated_data.get('isapproved_site', instance.isapproved_site)        
        instance.isapproved_master = validated_data.get('isapproved_master', instance.isapproved_master) 
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if Purchase_Requisition_details.objects.filter(id=init['id']).exists():
                    det = Purchase_Requisition_details.objects.get(id=init['id'])
                    mat_id = init.get('mat_id',det.mat_id)
                    mat_name = init.get('mat_name',det.mat_name)
                    quantity = init.get('quantity',det.quantity)
                    description = init.get('description',det.description)
                    unit = init.get('unit',det.unit)
                    det.save()
                    updated_data.append(det.id)
                else:
                    continue
            else:
                det = Purchase_Requisition_details.objects.create(**init, header_ref_id=instance)
                updated_data.append(det.id)

        det = Purchase_Requisition_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in updated_data:
                continue
            else:
                det_record = Purchase_Requisition_details.objects.get(id=d)
                print(det_record)
                det_record.save()
        return instance

        


class PurchaseOrderDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Purchase_Order_details
        fields = '__all__'

class PurchaseOrderMstSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    initialItemRow = PurchaseOrderDetailsSerializer(many=True)
    class Meta:
        model = Purchase_Order_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        po = Purchase_Order_mst.objects.create(**validated_data)

        for item in initialItemRow:
            Purchase_Order_details.objects.create(**item, header_ref_id=po)
        return po

    def update(self, instance, validated_data):
        object = Purchase_Order_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.grn_id = validated_data.get('grn_id', instance.grn_id)
        instance.po_id = validated_data.get('po_id', instance.po_id)
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if Purchase_Order_details.objects.filter(id=init['id']).exists():
                    det = Purchase_Order_details.objects.get(id=init['id'])
                    item_rate = init.get('item_rate',det.item_rate)
                    mat_id = init.get('mat_id',det.mat_id)
                    mat_name = init.get('mat_name',det.mat_name)
                    quantity = init.get('quantity',det.quantity)
                    rec_quant = init.get('rec_quant',det.rec_quant)
                    unit = init.get('unit',det.unit)                    
                    det.save()
                    updated_data.append(det.id)
                else:
                    continue
            else:
                det = Purchase_Order_details.objects.create(**init, header_ref_id=instance)
                updated_data.append(det.id)

        det = Purchase_Order_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in updated_data:
                continue
            else:
                det_record = Purchase_Order_details.objects.get(id=d)
                print(det_record)
                det_record.save()
        return instance


class GoodsReceiptNoteDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Goods_Receipt_Note_details
        fields = '__all__'

class GoodsReceiptNoteMstSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    initialItemRow = GoodsReceiptNoteDetailsSerializer(many=True)
    class Meta:
        model = Goods_Receipt_Note_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        grn = Goods_Receipt_Note_mst.objects.create(**validated_data)

        for item in initialItemRow:
            Goods_Receipt_Note_details.objects.create(**item, header_ref_id=grn)
        return grn

    def update(self, instance, validated_data):
        object = Goods_Receipt_Note_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.po_id = validated_data.get('po_id', instance.po_id)
        instance.project_name = validated_data.get('project_name', instance.project_name)
        instance.delivery_loc = validated_data.get('delivery_loc', instance.delivery_loc)
        instance.supp_id = validated_data.get('supp_id', instance.supp_id)
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if Goods_Receipt_Note_details.objects.filter(id=init['id']).exists():
                    det = Goods_Receipt_Note_details.objects.get(id=init['id'])
                    item_rate = init.get('item_rate',det.item_rate)
                    mat_id = init.get('mat_id',det.mat_id)
                    mat_name = init.get('mat_name',det.mat_name)
                    quantity = init.get('quantity',det.quantity)
                    unit = init.get('unit',det.unit)                    
                    det.save()
                    updated_data.append(det.id)
                else:
                    continue
            else:
                det = Goods_Receipt_Note_details.objects.create(**init, header_ref_id=instance)
                updated_data.append(det.id)

        det = Goods_Receipt_Note_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in updated_data:
                continue
            else:
                det_record = Goods_Receipt_Note_details.objects.get(id=d)
                print(det_record)
                det_record.save()
        return instance


class StockSerializerDetails(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Stock_details
        fields = '__all__'

class ProjectsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    initialItemRow = StockSerializerDetails(many=True)
    class Meta:
        model = Projects
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        req = Projects.objects.create(**validated_data)

        for item in initialItemRow:
            Stock_details.objects.create(**item, header_ref_id=req)
        return req

    def update(self, instance, validated_data):
        object = Projects.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.project_name = validated_data.get('project_name', instance.project_name)
        instance.location = validated_data.get('location', instance.location)
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if Stock_details.objects.filter(id=init['id']).exists():
                    det = Stock_details.objects.get(id=init['id'])
                    mat_id = init.get('mat_id',det.mat_id)
                    mat_name = init.get('mat_name',det.mat_name)
                    quantity = init.get('quantity',det.quantity)
                    unit = init.get('unit',det.unit)
                    det.save()
                    updated_data.append(det.id)
                else:
                    continue
            else:
                det = Stock_details.objects.create(**init, header_ref_id=instance)
                updated_data.append(det.id)

        det = Stock_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in updated_data:
                continue
            else:
                det_record = Stock_details.objects.get(id=d)
                print(det_record)
                det_record.save()
        return instance