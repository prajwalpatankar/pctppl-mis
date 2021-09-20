from rest_framework import serializers
from .models import *
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User




class LoginMasterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserModel
        fields  = ('__all__')
    def get(user):
        return UserModel.objects.get(user = user)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')
    def get(username):
        return User.objects.get(username = username)

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')


class CurrentUserDefault(object):
    def set_context(self, serializer_field):
        self.username = serializer_field.context['request'].user.username

    def __call__(self):
        return self.username

    def __repr__(self):
        return unicode_to_repr('%s()' % self.__class__.__name__)


# -----------------------------------------------------------------
class UserCustomSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'  

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'  

class MaterialMasterSerializer(serializers.ModelSerializer):
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

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'  


class RequisitionSerializerDetails(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Purchase_Requisition_details
        fields = '__all__'

class RequisitionSerializerMst(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False) 
    made_by = serializers.CharField(default=CurrentUserDefault())

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
        instance.completed = validated_data.get('completed', instance.completed)        
        instance.isapproved_master = validated_data.get('isapproved_master', instance.isapproved_master) 
        instance.created_date_time = validated_data.get('created_date_time', instance.created_date_time)
        instance.updated_date_time = validated_data.get('updated_date_time', instance.updated_date_time)
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if Purchase_Requisition_details.objects.filter(id=init['id']).exists():
                    det = Purchase_Requisition_details.objects.get(id=init['id'])
                    det.mat_id = init.get('mat_id',det.mat_id)
                    det.hsn_id = init.get('hsn_id',det.hsn_id)
                    det.mat_name = init.get('mat_name',det.mat_name)
                    det.quantity = init.get('quantity',det.quantity)
                    det.description = init.get('description',det.description)
                    det.unit = init.get('unit',det.unit)
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
    made_by = serializers.CharField(default=CurrentUserDefault())
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


class GoodsReceiptNoteDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Goods_Receipt_Note_details
        fields = '__all__'

class GoodsReceiptNoteMstSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    made_by = serializers.CharField(default=CurrentUserDefault())

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

class StockSerializerMaster(serializers.ModelSerializer):
    class Meta:
        model = Stock_mst
        fields = '__all__'

class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'

class DeliveryChallanDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Delivery_Challan_details
        fields = '__all__'

class DeliveryChallanMstSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    initialItemRow = DeliveryChallanDetailsSerializer(many=True)
    class Meta:
        model = Delivery_Challan_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        dc = Delivery_Challan_mst.objects.create(**validated_data)

        for item in initialItemRow:
            Delivery_Challan_details.objects.create(**item, header_ref_id=dc)
        return dc



class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class Req_Limit_Serializer(serializers.ModelSerializer):
    mat_name = serializers.CharField(source='mat_id.mat_name')
    unit = serializers.CharField(source='mat_id.unit')
    hsn_id = serializers.CharField(source='mat_id.hsn_id')

    class Meta:
        model = Req_Limit
        fields = ('id', 'project_id', 'mat_id', 'utilized', 'quantity', 'mat_name', 'unit', 'hsn_id')

class HSN_Serializer(serializers.ModelSerializer):
    class Meta:
        model = HSN
        fields = '__all__'

