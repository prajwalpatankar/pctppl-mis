# Generated by Django 3.1.7 on 2021-08-20 05:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0068_remove_purchase_order_mst_gross_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='req_limit',
            name='hsn_id',
            field=models.CharField(default='00000', max_length=10),
        ),
    ]
