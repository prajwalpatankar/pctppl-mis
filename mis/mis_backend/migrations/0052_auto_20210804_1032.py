# Generated by Django 3.1.7 on 2021-08-04 05:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0051_auto_20210804_0947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchase_requisition_mst',
            name='req_id',
            field=models.CharField(default='FFFF-0000', max_length=10),
        ),
    ]
