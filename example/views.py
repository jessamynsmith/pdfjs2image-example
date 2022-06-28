from django.views.generic import ListView

from example import models


class ContentListView(ListView):
    model = models.Content
    # template_name = 'example/content_list.html'
