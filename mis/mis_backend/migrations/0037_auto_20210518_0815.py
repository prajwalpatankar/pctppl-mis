# Generated by Django 3.1.7 on 2021-05-18 02:45

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0036_auto_20210514_1118'),
    ]

    operations = [
        migrations.AddField(
            model_name='goods_receipt_note_details',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='goods_receipt_note_details',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='goods_receipt_note_mst',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='goods_receipt_note_mst',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='hsan',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='hsan',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='issue',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='issue',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='projects',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='projects',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_order_details',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_order_details',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_order_mst',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_order_mst',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_requisition_details',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_requisition_details',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_requisition_mst',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='purchase_requisition_mst',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='roles',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='roles',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='stock_mst',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='stock_mst',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='supplier',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='supplier',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
        migrations.AddField(
            model_name='usermodel',
            name='created_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time'),
        ),
        migrations.AddField(
            model_name='usermodel',
            name='updated_date_time',
            field=models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time'),
        ),
    ]