from django.urls import path

from .user import *

urlpatterns = [
    path('users/', users, name='users'),
]
