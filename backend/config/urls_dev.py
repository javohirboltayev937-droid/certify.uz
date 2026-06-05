from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/courses/', include('apps.courses.urls')),
    path('api/exams/', include('apps.exams.urls')),
    path('api/questions/', include('apps.questions.urls')),
    path('api/dtm/', include('apps.dtm.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/progress/', include('apps.progress.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
