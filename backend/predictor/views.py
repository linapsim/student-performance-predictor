import pandas as pd
import mysql.connector

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.models import User
from rest_framework.decorators import api_view

from django.contrib.auth.models import User

from .models import Prediction


def load_model():

    conn = mysql.connector.connect(
        host="db",
        user="root",
        password="",
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
def predict(request):

    try:

        model = load_model()

        hours = float(request.data['hours'])
        scores = float(request.data['scores'])
        activities = int(request.data['activities'])
        sleep = float(request.data['sleep'])
        papers = float(request.data['papers'])

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
            user_id=1,
            hours=hours,
            scores=scores,
            activities=activities,
            sleep=sleep,
            papers=papers,
            result=result
)

        return Response({
            "prediction": result,
        })

    except Exception as e:

        print(e)

        return Response({
            "error": str(e)
        }, status=400)
    




@api_view(['GET'])
def get_predictions(request):

    predictions = Prediction.objects.all().values()

    return Response(predictions)

@api_view(['POST'])
def register(request):

    username = request.data['username']
    password = request.data['password']

    if User.objects.filter(username=username).exists():

        return Response({
            'error': 'Username already exists'
        }, status=400)

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response({
        'message': 'User created successfully'
    })   

@api_view(['DELETE'])
def delete_prediction(request, id):

    prediction = Prediction.objects.get(id=id)

    prediction.delete()

    return Response({
        "message": "Prediction deleted"
    })