"""
DTM yo'nalishlari va fanlarini bazaga yuklash.
Ishlatish: python manage.py load_dtm_data
"""
from django.core.management.base import BaseCommand
from apps.dtm.models import DTMDirection, DTMSubjectGroup
from apps.dtm.data import DTM_DIRECTIONS
from apps.courses.models import Subject


class Command(BaseCommand):
    help = 'DTM yo\'nalishlari va fanlarini bazaga yuklaydi'

    def handle(self, *args, **options):
        created_count = 0
        skipped_count = 0
        error_count = 0

        for item in DTM_DIRECTIONS:
            try:
                direction, created = DTMDirection.objects.get_or_create(
                    code=item['code'],
                    defaults={
                        'name': item['name'],
                        'category': item['category'],
                    }
                )
                if not created:
                    skipped_count += 1
                    continue

                first_subj = Subject.objects.filter(subject_type=item['first_subject']).first()
                second_subj = Subject.objects.filter(subject_type=item['second_subject']).first()
                uzbek_subj = Subject.objects.filter(subject_type='uzbek').first()

                if first_subj and second_subj and uzbek_subj:
                    DTMSubjectGroup.objects.create(
                        direction=direction,
                        mandatory_subject=uzbek_subj,
                        first_subject=first_subj,
                        second_subject=second_subj,
                    )
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'✓ {direction.code} - {direction.name}'))
                else:
                    direction.delete()
                    error_count += 1
                    self.stdout.write(self.style.WARNING(
                        f'⚠ {item["code"]}: Fan topilmadi '
                        f'({item["first_subject"]}, {item["second_subject"]})'
                    ))

            except Exception as e:
                error_count += 1
                self.stdout.write(self.style.ERROR(f'✗ {item["code"]}: {e}'))

        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS(f'Yaratildi: {created_count}'))
        self.stdout.write(self.style.WARNING(f'O\'tkazib yuborildi: {skipped_count}'))
        if error_count:
            self.stdout.write(self.style.ERROR(f'Xatolik: {error_count}'))
