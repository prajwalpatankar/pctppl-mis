# Generated by Django 3.1.7 on 2021-04-05 14:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0003_purchase_requisition_message'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Purchase_Requisition',
            new_name='Purchase_Requisition_mst',
        ),
        migrations.CreateModel(
            name='Purchase_Requisition_details',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('col1', models.CharField(default='', max_length=200)),
                ('col2', models.CharField(default='', max_length=200)),
                ('header_ref_id', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='initialItemRow', to='mis_backend.purchase_requisition_mst', verbose_name='Header Ref ID')),
            ],
        ),
    ]
