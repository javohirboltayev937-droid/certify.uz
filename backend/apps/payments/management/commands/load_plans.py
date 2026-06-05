from django.core.management.base import BaseCommand
from apps.payments.models import SubscriptionPlan


PLANS = [
    {
        'name': 'Bepul',
        'plan_type': 'free',
        'price_uzs': 0,
        'duration_days': 0,
        'description': 'Asosiy imkoniyatlar bilan bepul foydalaning',
        'features': [
            '5 ta bepul dars',
            'Cheklangan testlar',
            'DTM yo\'nalishlari ko\'rish',
            'Natijalar tahlili',
        ],
        'is_popular': False,
    },
    {
        'name': 'Oylik',
        'plan_type': 'monthly',
        'price_uzs': 79000,
        'duration_days': 30,
        'description': 'Bir oylik to\'liq kirish huquqi',
        'features': [
            'Barcha kurslar va darslar',
            'Cheksiz testlar',
            'IELTS, CEFR, Milliy sertifikat',
            'DTM to\'liq tayyorgarlik',
            'Shaxsiy progress tahlili',
            'Yutuqlar tizimi',
            '24/7 qo\'llab-quvvatlash',
        ],
        'is_popular': False,
    },
    {
        'name': '3 Oylik',
        'plan_type': 'quarterly',
        'price_uzs': 199000,
        'duration_days': 90,
        'description': '3 oylik obuna - 16% tejash',
        'features': [
            'Oylik rejaning barcha imkoniyatlari',
            '16% chegirma',
            'Offline materiallar',
            'Mock imtihonlar',
            'Shaxsiy mentor',
        ],
        'is_popular': True,
        'discount_percent': 16,
    },
    {
        'name': 'Yillik',
        'plan_type': 'annual',
        'price_uzs': 599000,
        'duration_days': 365,
        'description': 'Yillik obuna - 37% tejash',
        'features': [
            '3 oylik rejaning barcha imkoniyatlari',
            '37% chegirma',
            'Sertifikat tayyorlash kurslari',
            'Guruh darslari',
            'Imtihonga yozilishda yordam',
            'Reytingda alohida belgi',
        ],
        'is_popular': False,
        'discount_percent': 37,
    },
]


class Command(BaseCommand):
    help = 'Obuna rejalarini bazaga yuklaydi'

    def handle(self, *args, **options):
        for p in PLANS:
            plan, created = SubscriptionPlan.objects.get_or_create(
                plan_type=p['plan_type'],
                defaults=p
            )
            status = '✓ Yaratildi' if created else '→ Mavjud'
            self.stdout.write(f'{status}: {plan.name} - {plan.price_uzs:,} so\'m')
