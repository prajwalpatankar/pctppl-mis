# Generated by Django 3.1.7 on 2021-05-07 14:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0024_auto_20210506_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='user',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, to='mis_backend.usermodel'),
        ),
    ]
