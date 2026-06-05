from django.core.management.base import BaseCommand
from apps.courses.models import Subject


SUBJECTS = [
    {'name': 'Ingliz tili', 'subject_type': 'english', 'icon': '🇬🇧', 'color': '#3B82F6', 'order': 1},
    {'name': 'O\'zbek tili', 'subject_type': 'uzbek', 'icon': '🇺🇿', 'color': '#22C55E', 'order': 2},
    {'name': 'Matematika', 'subject_type': 'mathematics', 'icon': '🔢', 'color': '#EF4444', 'order': 3},
    {'name': 'Fizika', 'subject_type': 'physics', 'icon': '⚛️', 'color': '#8B5CF6', 'order': 4},
    {'name': 'Kimyo', 'subject_type': 'chemistry', 'icon': '🧪', 'color': '#F59E0B', 'order': 5},
    {'name': 'Biologiya', 'subject_type': 'biology', 'icon': '🧬', 'color': '#10B981', 'order': 6},
    {'name': 'Tarix', 'subject_type': 'history', 'icon': '📜', 'color': '#6366F1', 'order': 7},
    {'name': 'Geografiya', 'subject_type': 'geography', 'icon': '🌍', 'color': '#0EA5E9', 'order': 8},
    {'name': 'Informatika', 'subject_type': 'informatics', 'icon': '💻', 'color': '#64748B', 'order': 9},
    {'name': 'Rus tili', 'subject_type': 'russian', 'icon': '🇷🇺', 'color': '#DC2626', 'order': 10},
    {'name': 'Nemis tili', 'subject_type': 'german', 'icon': '🇩🇪', 'color': '#78716C', 'order': 11},
    {'name': 'Fransuz tili', 'subject_type': 'french', 'icon': '🇫🇷', 'color': '#EC4899', 'order': 12},
    {'name': 'Adabiyot', 'subject_type': 'literature', 'icon': '📚', 'color': '#A855F7', 'order': 13},
    {'name': 'Iqtisodiyot', 'subject_type': 'economics', 'icon': '📊', 'color': '#14B8A6', 'order': 14},
    {'name': 'Huquq', 'subject_type': 'law', 'icon': '⚖️', 'color': '#F97316', 'order': 15},
    {'name': 'Chizma', 'subject_type': 'drawing', 'icon': '✏️', 'color': '#84CC16', 'order': 16},
    {'name': 'Musiqa', 'subject_type': 'music', 'icon': '🎵', 'color': '#F43F5E', 'order': 17},
    {'name': 'Jamiyatshunoslik', 'subject_type': 'social_studies', 'icon': '👥', 'color': '#06B6D4', 'order': 18},
]


class Command(BaseCommand):
    help = 'Fanlarni bazaga yuklaydi'

    def handle(self, *args, **options):
        for s in SUBJECTS:
            subj, created = Subject.objects.get_or_create(
                subject_type=s['subject_type'],
                defaults=s
            )
            status = '✓ Yaratildi' if created else '→ Mavjud'
            self.stdout.write(f'{status}: {subj.name}')

        self.stdout.write(self.style.SUCCESS(f'\nJami {len(SUBJECTS)} ta fan qayta ishlandi'))
