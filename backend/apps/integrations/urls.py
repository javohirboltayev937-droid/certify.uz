from django.urls import path
from . import views

urlpatterns = [
    path('webhook/', views.TelegramWebhookView.as_view(), name='telegram-webhook'),
    path('send-certificate/', views.SendCertificateView.as_view(), name='send-certificate'),
]
