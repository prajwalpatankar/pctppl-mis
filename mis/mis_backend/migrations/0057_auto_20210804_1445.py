# Generated by Django 3.1.7 on 2021-08-04 09:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0056_auto_20210804_1444'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchase_order_mst',
            name='project_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_id', to='mis_backend.projects'),
        ),
    ]
