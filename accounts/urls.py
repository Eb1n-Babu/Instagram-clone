from django.urls import path
from  .views import register_view , logout_view , login_view

urlpatterns = [
    path('', register_view , name = 'register_view'),
    path('login/', login_view , name = 'login_view'),
    path('logout/', logout_view, name='logout_view'),
]
