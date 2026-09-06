import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Creates or updates the demo admin user.'

    def handle(self, *args, **options):
        username = os.getenv('DEMO_ADMIN_USERNAME')
        password = os.getenv('DEMO_ADMIN_PASSWORD')

        if not username or not password:
            self.stdout.write(
                self.style.WARNING('Demo admin environment variables are missing.')
            )
            return

        user, created = User.objects.get_or_create(username=username)

        user.email = 'demo-admin@example.com'
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS('Demo admin created.'))
        else:
            self.stdout.write(self.style.SUCCESS('Demo admin updated.'))