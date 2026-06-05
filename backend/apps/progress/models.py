from django.db import models


class TestAttempt(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'Jarayonda'),
        ('completed', 'Yakunlangan'),
        ('abandoned', 'Tashlab ketilgan'),
    ]

    EXAM_TYPE_CHOICES = [
        ('dtm', 'DTM'),
        ('ielts', 'IELTS'),
        ('cefr', 'CEFR'),
        ('national', 'Milliy sertifikat'),
        ('practice', 'Mashq'),
    ]

    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='test_attempts')
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    direction = models.ForeignKey('dtm.DTMDirection', on_delete=models.SET_NULL, null=True, blank=True)
    subjects = models.ManyToManyField('courses.Subject', blank=True)
    score = models.FloatField(default=0)
    max_score = models.FloatField(default=100)
    percentage = models.FloatField(default=0)
    correct_answers = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    time_taken = models.IntegerField(default=0, help_text='Seconds')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Test urinishi'
        verbose_name_plural = 'Test urinishlari'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user} - {self.title} - {self.score}"


class TestAnswer(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey('questions.Question', on_delete=models.CASCADE)
    selected_answer = models.ForeignKey('questions.Answer', on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    time_taken = models.IntegerField(default=0, help_text='Seconds')

    class Meta:
        verbose_name = 'Test javobi'
        verbose_name_plural = 'Test javoblari'
        unique_together = ['attempt', 'question']


class LessonProgress(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    watch_time = models.IntegerField(default=0, help_text='Seconds watched')
    last_position = models.IntegerField(default=0, help_text='Video seconds')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Dars progressi'
        verbose_name_plural = 'Dars progresslari'
        unique_together = ['user', 'lesson']


class Achievement(models.Model):
    TYPE_CHOICES = [
        ('first_test', 'Birinchi test'),
        ('perfect_score', 'To\'liq ball'),
        ('streak_7', '7 kunlik ketma-ketlik'),
        ('streak_30', '30 kunlik ketma-ketlik'),
        ('tests_10', '10 test yakunlangan'),
        ('tests_50', '50 test yakunlangan'),
        ('tests_100', '100 test yakunlangan'),
        ('premium', 'Premium obuna'),
    ]

    name = models.CharField(max_length=100)
    achievement_type = models.CharField(max_length=30, choices=TYPE_CHOICES, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=100, default='🏆')
    xp_reward = models.IntegerField(default=100)

    class Meta:
        verbose_name = 'Yutuq'
        verbose_name_plural = 'Yutuqlar'

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'achievement']
        verbose_name = 'Foydalanuvchi yutug\'i'
        verbose_name_plural = 'Foydalanuvchi yutuqlari'

    def __str__(self):
        return f"{self.user} - {self.achievement.name}"


class DailyStreak(models.Model):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='streak')
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity = models.DateField(null=True, blank=True)
    total_xp = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Kunlik ketma-ketlik'
        verbose_name_plural = 'Kunlik ketma-ketliklar'
