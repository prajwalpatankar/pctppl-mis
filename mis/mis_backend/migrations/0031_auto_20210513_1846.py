# Generated by Django 3.1.7 on 2021-05-13 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0030_goods_receipt_note_mst_project_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stock_details',
            name='header_ref_id',
        ),
        migrations.AddField(
            model_name='stock_details',
            name='project_id',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='goods_receipt_note_mst',
            name='project_id',
            field=models.IntegerField(),
        ),
    ]