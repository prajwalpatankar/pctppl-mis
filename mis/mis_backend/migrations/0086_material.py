# Generated by Django 3.1.7 on 2021-09-17 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mis_backend', '0085_auto_20210831_1938'),
    ]

    operations = [
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mat_name', models.CharField(max_length=100)),
                ('hsn_id', models.CharField(max_length=10)),
            ],
        ),
    ]
