from django.db import models
from django.utils.text import slugify


class Subject(models.Model):
    SUBJECT_CHOICES = [
        ('english', 'Ingliz tili'),
        ('russian', 'Rus tili'),
        ('german', 'Nemis tili'),
        ('french', 'Fransuz tili'),
        ('uzbek', 'O\'zbek tili'),
        ('mathematics', 'Matematika'),
        ('physics', 'Fizika'),
        ('chemistry', 'Kimyo'),
        ('biology', 'Biologiya'),
        ('history', 'Tarix'),
        ('geography', 'Geografiya'),
        ('informatics', 'Informatika'),
        ('literature', 'Adabiyot'),
        ('social_studies', 'Jamiyatshunoslik'),
        ('drawing', 'Chizma'),
        ('music', 'Musiqa'),
        ('economics', 'Iqtisodiyot'),
        ('law', 'Huquq'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    subject_type = models.CharField(max_length=30, choices=SUBJECT_CHOICES, unique=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, default='#4F46E5')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Fan'
        verbose_name_plural = 'Fanlar'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.subject_type)
        super().save(*args, **kwargs)


class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Boshlang\'ich'),
        ('intermediate', 'O\'rta'),
        ('advanced', 'Yuqori'),
    ]

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='courses/', null=True, blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    total_duration = models.IntegerField(default=0, help_text='Minutes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Kurs'
        verbose_name_plural = 'Kurslar'
        ordering = ['order']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Lesson(models.Model):
    LESSON_TYPE_CHOICES = [
        ('video', 'Video'),
        ('text', 'Matn'),
        ('quiz', 'Test'),
        ('audio', 'Audio'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPE_CHOICES, default='video')
    video_url = models.URLField(blank=True)
    content = models.TextField(blank=True)
    duration = models.IntegerField(default=0, help_text='Minutes')
    is_free = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Dars'
        verbose_name_plural = 'Darslar'
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class StudyMaterial(models.Model):
    MATERIAL_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('doc', 'DOC'),
        ('ppt', 'PPT'),
        ('image', 'Rasm'),
        ('link', 'Havola'),
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='materials', null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials', null=True, blank=True)
    title = models.CharField(max_length=200)
    material_type = models.CharField(max_length=20, choices=MATERIAL_TYPE_CHOICES)
    file = models.FileField(upload_to='materials/', null=True, blank=True)
    url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'O\'quv materiali'
        verbose_name_plural = 'O\'quv materiallari'

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Ro\'yxatga olish'
        verbose_name_plural = 'Ro\'yxatga olishlar'
        unique_together = ['user', 'course']

    def __str__(self):
        return f"{self.user} - {self.course}"
