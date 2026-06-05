from django.urls import path
from . import views

urlpatterns = [
    path('types/', views.ExamTypeListView.as_view(), name='exam-types'),
    path('types/<slug:slug>/', views.ExamTypeDetailView.as_view(), name='exam-type-detail'),
    path('mocks/', views.MockExamListView.as_view(), name='mock-exams'),
    path('ielts/tips/', views.IELTSTipsView.as_view(), name='ielts-tips'),
    path('national/', views.NationalCertListView.as_view(), name='national-certs'),
]
