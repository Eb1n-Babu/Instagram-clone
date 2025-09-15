from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import register_view, logout_view, login_view, welcome_view, add_comment

urlpatterns = [
    path('', register_view, name='register_view'),
    path('login/', login_view, name='login_view'),
    path('logout/', logout_view, name='logout_view'),
    path('welcome/', welcome_view, name='welcome_view'),  # 🏠 Feed page
    path('comment/<int:post_id>/', add_comment, name='add_comment'),  # 💬 Comment endpoint
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)