# Generated by Django 3.1.7 on 2021-05-13 13:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0032_auto_20210513_1858'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock_mst',
            name='project_id',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='mis_backend.projects'),
        ),
    ]