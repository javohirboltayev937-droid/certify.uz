from django.urls import re_path
from . import views

urlpatterns = [
    # Auth
    re_path(r'^register/?$', views.RegisterView.as_view(), name='register'),
    re_path(r'^login/?$', views.LoginView.as_view(), name='login'),
    re_path(r'^logout/?$', views.LogoutView.as_view(), name='logout'),

    # Profil
    re_path(r'^profile/?$', views.ProfileView.as_view(), name='profile'),
    re_path(r'^change-password/?$', views.ChangePasswordView.as_view(), name='change-password'),
    re_path(r'^stats/?$', views.UserStatsView.as_view(), name='user-stats'),

    # Telegram bog'lash
    re_path(r'^telegram/link-token/?$', views.TelegramLinkTokenView.as_view(), name='telegram-link-token'),
    re_path(r'^telegram/unlink/?$', views.TelegramUnlinkView.as_view(), name='telegram-unlink'),

    # Email tasdiqlash
    re_path(r'^verify-email/?$', views.VerifyEmailView.as_view(), name='verify-email'),
    re_path(r'^resend-verification/?$', views.ResendVerificationView.as_view(), name='resend-verification'),

    # Parol tiklash
    re_path(r'^forgot-password/?$', views.ForgotPasswordView.as_view(), name='forgot-password'),
    re_path(r'^reset-password/?$', views.ResetPasswordView.as_view(), name='reset-password'),
]
