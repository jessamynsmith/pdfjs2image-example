from django.urls import path
from example import views


urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
]
