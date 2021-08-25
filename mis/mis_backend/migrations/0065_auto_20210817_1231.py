# Generated by Django 3.1.7 on 2021-08-17 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0064_auto_20210812_1235'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchase_order_mst',
            name='contact_person',
            field=models.CharField(default=' ', max_length=30),
        ),
        migrations.AddField(
            model_name='purchase_order_mst',
            name='delivery_schedule',
            field=models.CharField(default=' ', max_length=20),
        ),
        migrations.AddField(
            model_name='purchase_order_mst',
            name='gross_amount',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='purchase_order_mst',
            name='other_terms',
            field=models.CharField(default=' ', max_length=100),
        ),
        migrations.AddField(
            model_name='purchase_order_mst',
            name='payment_terms',
            field=models.CharField(default=' ', max_length=100),
        ),
    ]
