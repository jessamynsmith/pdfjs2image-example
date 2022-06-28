from django.db import models


class Content(models.Model):
    name = models.CharField(max_length=30)
    pdf = models.FileField(upload_to='pdfs')
    image = models.FileField(upload_to='images', blank=True, null=True)

    def __str__(self):
        return '{}'.format(self.name)
