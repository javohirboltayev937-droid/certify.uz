"""
Development sozlamalari — SQLite, xotiradagi cache, sodda pochta.
Ishlatish: DJANGO_SETTINGS_MODULE=config.settings_dev
"""
from .settings import *  # noqa

# drf_yasg ni o'chirib qo'yamiz (setuptools versiya konflikti)
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != 'drf_yasg']

# Swagger URL larni o'chirish uchun
ROOT_URLCONF = 'config.urls_dev'

# SQLite (PostgreSQL o'rniga)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Xotiradagi cache (Redis o'rniga)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Email konsolda ko'rinsin
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# CORS — barcha origins ruxsat
CORS_ALLOW_ALL_ORIGINS = True

# Swagger uchun
DEBUG = True
