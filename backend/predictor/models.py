from django.db import models
from django.contrib.auth.models import User


class Prediction(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    hours = models.FloatField()

    scores = models.FloatField()

    activities = models.IntegerField()

    sleep = models.FloatField()

    papers = models.FloatField()

    result = models.CharField(
        max_length=20
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.result