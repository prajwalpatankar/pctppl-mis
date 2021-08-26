# Generated by Django 3.1.7 on 2021-08-26 03:49

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0080_goods_receipt_note_mst_challan_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='goods_receipt_note_mst',
            name='updated_date_time',
        ),
        migrations.AddField(
            model_name='goods_receipt_note_details',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
    ]
