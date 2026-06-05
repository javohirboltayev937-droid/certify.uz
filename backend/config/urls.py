from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

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
    path('admin/', admin.site.urls),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),

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
