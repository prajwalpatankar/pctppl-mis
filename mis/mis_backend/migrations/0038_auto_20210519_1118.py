# Generated by Django 3.1.7 on 2021-05-19 05:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('mis_backend', '0037_auto_20210518_0815'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchase_requisition_mst',
            name='made_by',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='purchase_requisition_mst',
            name='project_id',
            field=models.ForeignKey(default=7, on_delete=django.db.models.deletion.CASCADE, to='mis_backend.projects'),
        ),
    ]
