# Generated by Django 3.1.7 on 2021-08-31 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0083_auto_20210831_1300'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock_mst',
            name='quantity',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='stock_mst',
            name='recieved',
            field=models.FloatField(default=0),
        ),
    ]
