from django.urls import path
from example import views


urlpatterns = [
    path('', views.ContentListView.as_view(), name='content-list'),
]
