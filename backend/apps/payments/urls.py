from django.urls import path
from . import views

urlpatterns = [
    # Obuna rejalari
    path('plans/', views.SubscriptionPlanListView.as_view(), name='subscription-plans'),
    path('subscribe/', views.CreateSubscriptionView.as_view(), name='subscribe'),
    path('my-subscription/', views.MySubscriptionView.as_view(), name='my-subscription'),
    path('history/', views.PaymentHistoryView.as_view(), name='payment-history'),
    path('status/<int:payment_id>/', views.PaymentStatusView.as_view(), name='payment-status'),

    # Payme Merchant API (JSON-RPC 2.0)
    path('payme/', views.PaymeWebhookView.as_view(), name='payme-webhook'),

    # Click Merchant API
    path('click/prepare/', views.ClickPrepareView.as_view(), name='click-prepare'),
    path('click/complete/', views.ClickCompleteView.as_view(), name='click-complete'),

    # SMS OTP
    path('otp/send/', views.SendOTPView.as_view(), name='otp-send'),
    path('otp/verify/', views.VerifyOTPView.as_view(), name='otp-verify'),
]
