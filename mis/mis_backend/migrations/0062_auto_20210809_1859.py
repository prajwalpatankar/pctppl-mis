# Generated by Django 3.1.7 on 2021-08-09 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0061_auto_20210804_2010'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goods_receipt_note_mst',
            name='grn_id',
            field=models.CharField(max_length=14),
        ),
    ]