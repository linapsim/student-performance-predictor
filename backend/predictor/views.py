import pandas as pd
import mysql.connector

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth.models import User

from .models import Prediction


def load_model():

    conn = mysql.connector.connect(
        host="db",
        port=3306,
        user="root",
        password="root",
        database="student_data"
    )

    query = "SELECT * FROM performance"

    data = pd.read_sql_query(query, conn)

    conn.close()

    data['result'] = data['Performance Index'].apply(
        lambda x: 1 if x >= 50 else 0
    )

    data['Extracurricular Activities'] = data[
        'Extracurricular Activities'
    ].map({
        'Yes': 1,
        'No': 0
    })

    X = data[[
        'Hours Studied',
        'Previous Scores',
        'Extracurricular Activities',
        'Sleep Hours',
        'Sample Question Papers Practiced'
    ]]

    y = data['result']

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    model = LogisticRegression()

    model.fit(X_train, y_train)

    return model


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict(request):

    try:

        model = load_model()

        hours = float(request.data.get('hours', 0))
        scores = float(request.data.get('scores', 0))
        activities = int(request.data.get('activities', 0))
        sleep = float(request.data.get('sleep', 0))
        papers = float(request.data.get('papers', 0))

        if hours < 0:

            return Response({
                "error": "Hours cannot be negative"
            }, status=400)

        if scores < 0 or scores > 100:

            return Response({
                "error": "Scores must be between 0 and 100"
            }, status=400)

        if sleep < 0 or sleep > 24:

            return Response({
                "error": "Sleep hours must be between 0 and 24"
            }, status=400)

        if papers < 0:

            return Response({
                "error": "Practice papers cannot be negative"
            }, status=400)

        new_data = pd.DataFrame([[
            hours,
            scores,
            activities,
            sleep,
            papers
        ]], columns=[
            'Hours Studied',
            'Previous Scores',
            'Extracurricular Activities',
            'Sleep Hours',
            'Sample Question Papers Practiced'
        ])

        prediction = model.predict(new_data)[0]

        result = "PASS" if prediction == 1 else "FAIL"

        Prediction.objects.create(
            user=request.user,
            hours=hours,
            scores=scores,
            activities=activities,
            sleep=sleep,
            papers=papers,
            result=result
        )

        return Response({
            "prediction": result
        })

    except Exception as e:

        print("========== ERROR ==========")
        print(e)
        print("===========================")

        return Response({
            "error": str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_predictions(request):

    predictions = Prediction.objects.filter(
        user=request.user
    ).order_by('-id').values()

    return Response(predictions)


@api_view(['POST'])
def register(request):

    username = request.data['username']
    password = request.data['password']

    if User.objects.filter(username=username).exists():

        return Response({
            'error': 'Username already exists'
        }, status=400)

    User.objects.create_user(
        username=username,
        password=password
    )

    return Response({
        'message': 'User created successfully'
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_prediction(request, id):

    try:

        prediction = Prediction.objects.get(
            id=id,
            user=request.user
        )

        prediction.delete()

        return Response({
            "message": "Prediction deleted"
        })

    except Prediction.DoesNotExist:

        return Response({
            "error": "Prediction not found"
        }, status=404)