# Generated by Django 3.1.7 on 2021-08-20 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0072_auto_20210820_1157'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchase_order_details',
            name='discount',
            field=models.FloatField(default=0),
        ),
    ]
