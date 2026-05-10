from django.urls import path
from . import views
from .views import (
    predict,
    register,
    get_predictions,
    delete_prediction
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('predict/', predict),
    path('register/', register),
    path('predictions/', get_predictions),
    path('predictions/delete/<int:id>/', delete_prediction),
    path('api/login/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('delete/<int:id>/',views.delete_prediction,
),
]