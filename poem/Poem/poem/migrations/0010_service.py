# Generated by Django 2.0.9 on 2019-01-21 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poem', '0009_poem_nameunique'),
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.CharField(max_length=1024, primary_key=True, serialize=False)),
                ('service_id', models.CharField(max_length=1024)),
                ('service_name', models.CharField(max_length=128)),
                ('service_area', models.CharField(max_length=1024)),
                ('service_version', models.CharField(max_length=1024)),
                ('service_type', models.CharField(max_length=1024)),
                ('component_version', models.CharField(max_length=1024)),
                ('component_name', models.CharField(max_length=1024)),
                ('visible_to_marketplace', models.BooleanField(default=False)),
                ('in_catalogue', models.BooleanField(default=False)),
                ('external_service', models.BooleanField(default=False)),
                ('internal_service', models.BooleanField(default=False)),
            ],
        ),
    ]
