from django.urls import path
from . import views

urlpatterns = [
    path('directions/', views.DTMDirectionListView.as_view(), name='dtm-directions'),
    path('directions/<int:pk>/', views.DTMDirectionDetailView.as_view(), name='dtm-direction-detail'),
    path('categories/', views.DTMCategoriesView.as_view(), name='dtm-categories'),
    path('directions/<int:direction_id>/subjects/', views.DTMSubjectInfoView.as_view(), name='dtm-subjects'),
]
