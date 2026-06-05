from django.urls import path
from . import views

urlpatterns = [
    path('', views.QuestionListView.as_view(), name='question-list'),
    path('generate/', views.GenerateTestView.as_view(), name='generate-test'),
    path('ai-generate/', views.AIGenerateTestView.as_view(), name='ai-generate-test'),
]
