from django.db import models


class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Oson'),
        ('medium', 'O\'rta'),
        ('hard', 'Qiyin'),
    ]

    EXAM_TYPE_CHOICES = [
        ('dtm', 'DTM'),
        ('ielts', 'IELTS'),
        ('cefr', 'CEFR'),
        ('national', 'Milliy sertifikat'),
        ('practice', 'Mashq'),
    ]

    subject = models.ForeignKey('courses.Subject', on_delete=models.CASCADE, related_name='questions')
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES, default='dtm')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    question_text = models.TextField()
    question_image = models.ImageField(upload_to='questions/', null=True, blank=True)
    explanation = models.TextField(blank=True)
    explanation_image = models.ImageField(upload_to='explanations/', null=True, blank=True)
    points = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    is_ai_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    year = models.IntegerField(null=True, blank=True, help_text='DTM yili')
    topic = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = 'Savol'
        verbose_name_plural = 'Savollar'
        ordering = ['subject', 'difficulty']

    def __str__(self):
        return f"{self.subject.name} - {self.question_text[:60]}..."


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.TextField()
    answer_image = models.ImageField(upload_to='answers/', null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    order = models.CharField(max_length=1, choices=[('A','A'),('B','B'),('C','C'),('D','D')], default='A')

    class Meta:
        verbose_name = 'Javob'
        verbose_name_plural = 'Javoblar'
        ordering = ['order']

    def __str__(self):
        return f"{self.order}) {self.answer_text[:50]}"
