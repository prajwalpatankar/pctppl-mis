# Generated by Django 3.1.7 on 2021-09-20 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0091_auto_20210920_1131'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchase_order_mst',
            name='complete',
            field=models.CharField(default='N', max_length=3),
        ),
        migrations.AlterField(
            model_name='purchase_order_mst',
            name='po_id',
            field=models.CharField(max_length=13),
        ),
    ]
