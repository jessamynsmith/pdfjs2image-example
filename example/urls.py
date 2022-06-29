from django.urls import include, path

from rest_framework import routers

from example import views


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'content', views.ContentViewSet)


urlpatterns = [
    path('', views.ContentListView.as_view(), name='content-list'),
    path('api/v1/', include(router.urls)),
]
