# Generated by Django 5.1.3 on 2025-06-02 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_user_profile_picture_user_profile_picture_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='preference',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
