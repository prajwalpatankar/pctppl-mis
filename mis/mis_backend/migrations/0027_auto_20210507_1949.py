# Generated by Django 3.1.7 on 2021-05-07 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0026_auto_20210507_1940'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='pm',
            field=models.CharField(default='1', max_length=4),
        ),
        migrations.AlterField(
            model_name='projects',
            name='user',
            field=models.CharField(default='1', max_length=4),
        ),
    ]