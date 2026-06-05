from django.db import models


class DTMDirection(models.Model):
    CATEGORY_CHOICES = [
        ('technical', 'Texnika va texnologiya'),
        ('natural', 'Tabiiy fanlar'),
        ('medical', 'Tibbiyot'),
        ('economic', 'Ijtimoiy-iqtisodiy'),
        ('humanitarian', 'Gumanitar'),
        ('pedagogical', 'Pedagogika'),
        ('law', 'Huquq'),
        ('agriculture', 'Qishloq xo\'jaligi'),
        ('art', 'San\'at va madaniyat'),
        ('sports', 'Jismoniy tarbiya'),
        ('military', 'Harbiy'),
    ]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=300)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    university_type = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    grant_places = models.IntegerField(default=0)
    contract_places = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'DTM Yo\'nalish'
        verbose_name_plural = 'DTM Yo\'nalishlar'
        ordering = ['category', 'code']

    def __str__(self):
        return f"{self.code} - {self.name}"


class DTMSubjectGroup(models.Model):
    direction = models.ForeignKey(DTMDirection, on_delete=models.CASCADE, related_name='subject_groups')
    mandatory_subject = models.ForeignKey(
        'courses.Subject', on_delete=models.CASCADE,
        related_name='mandatory_for_groups',
        verbose_name='Majburiy fan (o\'zbek tili va matematika)'
    )
    first_subject = models.ForeignKey(
        'courses.Subject', on_delete=models.CASCADE,
        related_name='first_for_groups',
        verbose_name='1-fan'
    )
    second_subject = models.ForeignKey(
        'courses.Subject', on_delete=models.CASCADE,
        related_name='second_for_groups',
        verbose_name='2-fan'
    )
    note = models.CharField(max_length=300, blank=True)

    class Meta:
        verbose_name = 'DTM Fan guruhi'
        verbose_name_plural = 'DTM Fan guruhlari'

    def __str__(self):
        return f"{self.direction.code}: {self.first_subject} + {self.second_subject}"


class DTMPastYear(models.Model):
    direction = models.ForeignKey(DTMDirection, on_delete=models.CASCADE, related_name='past_years')
    year = models.IntegerField()
    grant_score = models.FloatField(null=True, blank=True, help_text='Grant ball chegarasi')
    contract_score = models.FloatField(null=True, blank=True, help_text='Kontrakt ball chegarasi')
    total_applicants = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'O\'tgan yil ma\'lumoti'
        verbose_name_plural = 'O\'tgan yillar ma\'lumotlari'
        unique_together = ['direction', 'year']
        ordering = ['-year']

    def __str__(self):
        return f"{self.direction.code} - {self.year}"
