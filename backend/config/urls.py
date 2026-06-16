from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


def health_check(request):
    return JsonResponse({'status': 'ok', 'service': 'certify-uz'})

schema_view = get_schema_view(
    openapi.Info(
        title="Certify.uz API",
        default_version='v1',
        description="Certify.uz - O'zbekiston sertifikat va imtihon tayyorgarlik platformasi",
        contact=openapi.Contact(email="info@certify.uz"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('api/health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),

    re_path(r'^api/auth/', include('apps.accounts.urls')),
    re_path(r'^api/auth/token/refresh/?$', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^api/courses/', include('apps.courses.urls')),
    re_path(r'^api/exams/', include('apps.exams.urls')),
    re_path(r'^api/questions/', include('apps.questions.urls')),
    re_path(r'^api/dtm/', include('apps.dtm.urls')),
    re_path(r'^api/payments/', include('apps.payments.urls')),
    re_path(r'^api/progress/', include('apps.progress.urls')),
    re_path(r'^api/telegram/', include('apps.integrations.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
