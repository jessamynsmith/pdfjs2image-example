from django.views.generic import ListView

from rest_framework import serializers, viewsets

from example import models


class ContentListView(ListView):
    model = models.Content


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Content
        fields = '__all__'


class ContentViewSet(viewsets.ModelViewSet):
    queryset = models.Content.objects.all()
    serializer_class = ContentSerializer
