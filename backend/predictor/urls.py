from django.urls import path
from .views import (
    predict,
    register,
    get_predictions,
    delete_prediction
)

urlpatterns = [
    path('predict/', predict),
    path('register/', register),
    path('predictions/', get_predictions),
    path('predictions/delete/<int:id>/', delete_prediction),
]