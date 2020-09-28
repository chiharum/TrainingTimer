from django.urls import path

from . import views

urlpatterns = [
    path('', views.top),
    path('test', views.test),
]