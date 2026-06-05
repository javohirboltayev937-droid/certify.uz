from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.SubjectListView.as_view(), name='subject-list'),
    path('', views.CourseListView.as_view(), name='course-list'),
    path('<slug:slug>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('<int:course_id>/enroll/', views.EnrollView.as_view(), name='enroll'),
    path('my/courses/', views.MyCoursesView.as_view(), name='my-courses'),
]
