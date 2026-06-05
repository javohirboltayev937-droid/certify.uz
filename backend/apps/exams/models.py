from django.db import models


class ExamType(models.Model):
    TYPE_CHOICES = [
        ('ielts', 'IELTS'),
        ('cefr', 'CEFR'),
        ('national', 'Milliy Sertifikat'),
        ('dtm', 'DTM'),
        ('ielts_academic', 'IELTS Academic'),
        ('ielts_general', 'IELTS General Training'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    exam_type = models.CharField(max_length=30, choices=TYPE_CHOICES, unique=True)
    description = models.TextField()
    logo = models.ImageField(upload_to='exams/', null=True, blank=True)
    color = models.CharField(max_length=20, default='#4F46E5')
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    duration_minutes = models.IntegerField(default=0)
    total_sections = models.IntegerField(default=0)
    passing_score = models.CharField(max_length=50, blank=True)
    validity_years = models.IntegerField(default=2)
    fee_usd = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    official_website = models.URLField(blank=True)

    class Meta:
        verbose_name = 'Imtihon turi'
        verbose_name_plural = 'Imtihon turlari'

    def __str__(self):
        return self.name


class ExamSection(models.Model):
    SECTION_TYPE_CHOICES = [
        ('listening', 'Listening'),
        ('reading', 'Reading'),
        ('writing', 'Writing'),
        ('speaking', 'Speaking'),
        ('grammar', 'Grammar'),
        ('vocabulary', 'Vocabulary'),
        ('mixed', 'Aralash'),
    ]

    exam_type = models.ForeignKey(ExamType, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(max_length=100)
    section_type = models.CharField(max_length=20, choices=SECTION_TYPE_CHOICES)
    description = models.TextField(blank=True)
    duration_minutes = models.IntegerField(default=30)
    max_score = models.IntegerField(default=9)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Bo\'lim'
        verbose_name_plural = 'Bo\'limlar'
        ordering = ['order']

    def __str__(self):
        return f"{self.exam_type.name} - {self.name}"


class MockExam(models.Model):
    LEVEL_CHOICES = [
        ('A1', 'A1 - Beginner'),
        ('A2', 'A2 - Elementary'),
        ('B1', 'B1 - Intermediate'),
        ('B2', 'B2 - Upper Intermediate'),
        ('C1', 'C1 - Advanced'),
        ('C2', 'C2 - Proficiency'),
        ('4.0', 'IELTS 4.0'),
        ('4.5', 'IELTS 4.5'),
        ('5.0', 'IELTS 5.0'),
        ('5.5', 'IELTS 5.5'),
        ('6.0', 'IELTS 6.0'),
        ('6.5', 'IELTS 6.5'),
        ('7.0', 'IELTS 7.0'),
        ('7.5', 'IELTS 7.5'),
        ('8.0', 'IELTS 8.0'),
    ]

    exam_type = models.ForeignKey(ExamType, on_delete=models.CASCADE, related_name='mock_exams')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, blank=True)
    duration_minutes = models.IntegerField(default=60)
    total_questions = models.IntegerField(default=40)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Mock imtihon'
        verbose_name_plural = 'Mock imtihonlar'
        ordering = ['order']

    def __str__(self):
        return self.title


class IELTSTip(models.Model):
    SECTION_CHOICES = [
        ('listening', 'Listening'),
        ('reading', 'Reading'),
        ('writing', 'Writing'),
        ('speaking', 'Speaking'),
        ('general', 'Umumiy'),
    ]

    section = models.CharField(max_length=20, choices=SECTION_CHOICES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'IELTS maslahat'
        verbose_name_plural = 'IELTS maslahatlar'
        ordering = ['section', 'order']

    def __str__(self):
        return f"{self.section} - {self.title}"


class NationalCert(models.Model):
    CERT_LEVEL_CHOICES = [
        ('A1', 'A1'), ('A2', 'A2'),
        ('B1', 'B1'), ('B2', 'B2'),
        ('C1', 'C1'), ('C2', 'C2'),
    ]

    subject = models.ForeignKey('courses.Subject', on_delete=models.CASCADE, related_name='national_certs')
    level = models.CharField(max_length=5, choices=CERT_LEVEL_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    duration_minutes = models.IntegerField(default=90)
    total_questions = models.IntegerField(default=50)
    passing_percentage = models.IntegerField(default=70)
    is_active = models.BooleanField(default=True)
    fee_uzs = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)

    class Meta:
        verbose_name = 'Milliy sertifikat'
        verbose_name_plural = 'Milliy sertifikatlar'
        unique_together = ['subject', 'level']

    def __str__(self):
        return f"{self.subject.name} - {self.level}"
