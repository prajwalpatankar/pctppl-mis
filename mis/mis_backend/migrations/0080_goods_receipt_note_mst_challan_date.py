# Generated by Django 3.1.7 on 2021-08-25 04:38

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0079_auto_20210825_0909'),
    ]

    operations = [
        migrations.AddField(
            model_name='goods_receipt_note_mst',
            name='challan_date',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
    ]
