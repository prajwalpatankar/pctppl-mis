# Generated by Django 3.1.7 on 2021-08-12 07:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0063_auto_20210809_1904'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchase_requisition_mst',
            name='made_by',
            field=models.CharField(default='', max_length=20),
        ),
    ]
