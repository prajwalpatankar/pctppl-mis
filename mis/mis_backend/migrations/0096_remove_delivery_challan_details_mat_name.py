# Generated by Django 3.1.7 on 2021-09-21 08:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0095_auto_20210921_1240'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='delivery_challan_details',
            name='mat_name',
        ),
    ]
