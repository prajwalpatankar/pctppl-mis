# Generated by Django 3.1.7 on 2021-05-13 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0029_projects_completed'),
    ]

    operations = [
        migrations.AddField(
            model_name='goods_receipt_note_mst',
            name='project_id',
            field=models.IntegerField(default=1),
        ),
    ]
