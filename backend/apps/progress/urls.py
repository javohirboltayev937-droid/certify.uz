from django.urls import path
from . import views

urlpatterns = [
    path('start-test/', views.StartTestView.as_view(), name='start-test'),
    path('submit-test/', views.SubmitTestView.as_view(), name='submit-test'),
    path('history/', views.TestHistoryView.as_view(), name='test-history'),
    path('results/<int:pk>/', views.TestResultView.as_view(), name='test-result'),
    path('my-progress/', views.UserProgressView.as_view(), name='my-progress'),
    path('lesson-progress/', views.UpdateLessonProgressView.as_view(), name='lesson-progress'),
]
