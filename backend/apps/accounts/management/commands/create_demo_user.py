from django.core.management.base import BaseCommand
from apps.accounts.models import User


class Command(BaseCommand):
    help = 'Demo foydalanuvchi yaratadi'

    def handle(self, *args, **options):
        if User.objects.filter(username='demo').exists():
            self.stdout.write('Demo user allaqachon mavjud.')
            return

        user = User.objects.create_user(
            username='demo',
            email='demo@certify.uz',
            password='Demo1234!',
            first_name='Demo',
            last_name='Foydalanuvchi',
            role='student',
            is_premium=True,
        )
        self.stdout.write(self.style.SUCCESS(f'Demo user yaratildi: {user.username}'))
