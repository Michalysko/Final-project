import os

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_demo_admin(apps, schema_editor):
    User = apps.get_model('auth', 'User')

    username = os.getenv('DEMO_ADMIN_USERNAME')
    password = os.getenv('DEMO_ADMIN_PASSWORD')

    if not username or not password:
        return

    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': 'demo-admin@example.com',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
            'password': make_password(password),
        },
    )

    if not created:
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.password = make_password(password)
        user.save()


def remove_demo_admin(apps, schema_editor):
    User = apps.get_model('auth', 'User')

    username = os.getenv('DEMO_ADMIN_USERNAME')

    if username:
        User.objects.filter(username=username).delete()


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('insured', '0006_move_subject_to_insurance_contract'),
    ]

    operations = [
        migrations.RunPython(create_demo_admin, remove_demo_admin),
    ]