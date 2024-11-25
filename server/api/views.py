import jwt
import json
import bcrypt
import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db import connection
from django.utils.decorators import method_decorator

SECRET_KEY = "DEVELOPMENT"

permissions = {
    'student': 0,
    'alumni': 1,
    'staff': 2,
}

def auth_middleware(required_permission_level):
    def decorator(view_func):
        def wrapped_view(request, *args, **kwargs):
            token = request.headers.get("Authorization")
            if not token:
                return JsonResponse({"error": "Unauthorized"}, status=401)

            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                return JsonResponse({"error": "Token expired"}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({"error": "Invalid token"}, status=401)

            if permissions[payload["permission_level"]] < permissions[required_permission_level]:
                return JsonResponse({"error": f'Forbidden {permissions[payload["permission_level"]]} < {permissions[required_permission_level]}'}, status=403)

            request.session = {
                "id": payload["user_id"],
                "permission_level": payload["permission_level"],
            }

            return view_func(request, *args, **kwargs)
        return wrapped_view
    return decorator


@api_view(['POST'])
def login_view(request):
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Missing email or password"}, status=400)

    with connection.cursor() as cursor:
        cursor.execute("SELECT userID, password, type FROM User WHERE email = %s", [email])
        user = cursor.fetchone()

    if not user:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    user_id, password_hash, permission_level = user

    if not bcrypt.checkpw(password.encode(), password_hash.encode()):
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    payload = {
        "user_id": user_id,
        "permission_level": permission_level,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),  # Token expires in 1 day
        "iat": datetime.datetime.utcnow(),  # Issued at
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return JsonResponse({"token": token, "permission_level": permission_level})

class UsersView(APIView):
    @method_decorator(auth_middleware(required_permission_level='staff'))
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT userID, email, first, last, gradYear, type
                    FROM User
                """)
                rows = cursor.fetchall()
            
            users = [
                {
                    "userID": row[0],
                    "email": row[1],
                    "first": row[2],
                    "last": row[3],
                    "gradYear": row[4],
                    "type": row[5],
                }
                for row in rows
            ]

            return Response(users)
        except Exception as e:
            return Response({"error": str(e)}, status=500)