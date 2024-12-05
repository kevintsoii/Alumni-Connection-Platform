import jwt
import json
import bcrypt
import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from django.db import connection, transaction
from django.utils.decorators import method_decorator

SECRET_KEY = "DEVELOPMENT"

permissions = {
    'student': 0,
    'alumni': 1,
    'staff': 2,
}

def auth_middleware(required_permission_level='student'):
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
        "iat": datetime.datetime.utcnow(),  # Issued at
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return JsonResponse({"token": token, "permission_level": permission_level})

@api_view(['POST'])
def register_view(request):
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    first = data.get("first")
    last = data.get("last")
    major = data.get("major")
    degree = data.get("degree")
    gradMonth = data.get("gradMonth")
    gradYear = data.get("gradYear")
    type = data.get("type", "student") # only students allowed, approval required for alumni and staff

    if not type or type != 'student':
        return JsonResponse({"error": "Only students are allowed to register without authorization"}, status=400)
    if not email or not password or not first or not last or not gradYear:
        return JsonResponse({"error": "Missing required fields"}, status=400)
    if '@sjsu.edu' not in email:
        return JsonResponse({"error": "Only SJSU registrations are allowed"}, status=400)

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO User (email, password, first, last, major, degree, gradMonth, gradYear, type)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, [email, password_hash, first, last, major, degree, gradMonth, gradYear, type])
            user_id = cursor.lastrowid
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    payload = {
        "user_id": user_id,
        "permission_level": type,
        "iat": datetime.datetime.utcnow(),  # Issued at
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return JsonResponse({"token": token, "permission_level": type})

@api_view(['GET'])
@auth_middleware()
def user_view(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT userID, first, last, major, degree, gradMonth, gradYear, type
                FROM User
                WHERE userID = %s
            """, [id])
            user = cursor.fetchone()
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    if not user:
        return JsonResponse({"error": "User not found"}, status=404)
    
    return JsonResponse({
        "userID": user[0],
        "first": user[1],
        "last": user[2],
        "major": user[3],
        "degree": user[4],
        "gradMonth": user[5],
        "gradYear": user[6],
        "type": user[7],
    })

class ConnectionView(APIView):
    @method_decorator(auth_middleware())
    def post(self, request, id):
        user1 = request.session["id"]
        user2 = id

        if user1 == user2:
            return JsonResponse({"error": "Cannot connect to yourself"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO Connection (user1, user2)
                    VALUES (%s, %s)
                """, [user1, user2])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
        return JsonResponse({"message": "Connection request sent!"})

    @method_decorator(auth_middleware())
    def delete(self, request, id):
        user1 = request.session["id"]
        user2 = id

        if user1 == user2:
            return JsonResponse({"error": "Cannot connect to yourself"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM Connection
                    WHERE user1 = %s AND user2 = %s
                """, [user1, user2])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
        return JsonResponse({"message": "Connection request removed!"})
    
    @method_decorator(auth_middleware())
    def get(self, request, id):
        user1 = request.session["id"]
        user2 = id

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*)
                FROM Connection
                WHERE (user1 = %s AND user2 = %s)
            """, [user1, user2])
            connection_sent = cursor.fetchone()[0] > 0
        
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*)
                FROM Connection
                WHERE (user1 = %s AND user2 = %s)
            """, [user2, user1])
            connection_accepted = cursor.fetchone()[0] > 0
        
        if connection_sent and connection_accepted:
            return JsonResponse({"status": "connected"})
        elif connection_sent:
            return JsonResponse({"status": "sent"})
        elif connection_accepted:
            return JsonResponse({"status": "received"})
        else:
            return JsonResponse({"status": "not connected"})

@api_view(['GET'])
@auth_middleware()
def connections_view(request):
    user1 = request.session["id"]
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT c.user1, u.first, u.last
                FROM Connection c
                INNER JOIN User u ON c.user1 = u.userID
                WHERE c.user2 = %s
            """, [user1])
            rows = cursor.fetchall()

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT u.first, u.last
                FROM User u
                WHERE u.userID = %s
            """, [user1])
            user = cursor.fetchone()
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    connected_users = [
        {"userID": row[0], "first": row[1], "last": row[2]}
        for row in rows
    ]

    return JsonResponse({"connections": connected_users, "user": user[0] + " " + user[1]}, status=200)

class AlumniView(APIView):
    @method_decorator(auth_middleware(required_permission_level='alumni'))
    def post(self, request):
        data = json.loads(request.body)
        company = data.get("company")
        industry = data.get("industry")
        contacts = data.get("contacts", [])
        user = request.session["id"]

        if not company or not industry or len(contacts) > 5:
            return JsonResponse({"error": "Field validation error"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("BEGIN;")

                cursor.execute("""
                    INSERT INTO AlumniWall (user, company, industry)
                    VALUES (%s, %s, %s)
                """, [user, company, industry])

                for url in contacts:
                    if url:
                        cursor.execute("""
                            INSERT INTO AlumniContact (user, url)
                            VALUES (%s, %s)
                        """, [user, url])

                cursor.execute("COMMIT;")
        except Exception as e:
            with connection.cursor() as cursor:
                cursor.execute("ROLLBACK;")
            return JsonResponse({"error": str(e)}, status=500)
        
        return JsonResponse({"message": "Added to alumni wall!"})
    
    @method_decorator(auth_middleware())
    def get(self, request):
        grad_year = request.GET.get('gradYear', '').strip()
        major = request.GET.get('major', '').strip()
        company = request.GET.get('company', '').strip()
        industry = request.GET.get('industry', '').strip()

        try:
            query = """
                SELECT u.userID, u.first, u.last, u.major, u.degree, u.gradYear, a.company, a.industry
                FROM AlumniWall a
                INNER JOIN User u ON a.user = u.userID
            """
            conditions = []
            params = []

            if grad_year:
                conditions.append("u.gradYear = %s")
                params.append(grad_year)
            if major:
                conditions.append("MATCH(u.major) AGAINST(%s IN BOOLEAN MODE)")
                params.append(f'{major}*')
            if company:
                conditions.append("MATCH(a.company) AGAINST(%s IN BOOLEAN MODE)")
                params.append(f'{company}*')
            if industry:
                conditions.append("MATCH(a.industry) AGAINST(%s IN BOOLEAN MODE)")
                params.append(f'{industry}*')

            if conditions:
                query += " WHERE " + " AND ".join(conditions)

            with connection.cursor() as cursor:
                cursor.execute(query, params)
                rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        alumni = [
            {
                "userID": row[0],
                "first": row[1],
                "last": row[2],
                "major": row[3],
                "degree": row[4],
                "gradYear": row[5],
                "company": row[6],
                "industry": row[7],
            }
            for row in rows
        ]

        return JsonResponse({"alumni": alumni}, status=200)

@api_view(['GET'])
@auth_middleware()
def contact_view(request, id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT url
                FROM AlumniContact
                WHERE user = %s
            """, [id])
            rows = cursor.fetchall()
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    urls = [ row[0] for row in rows ]

    return JsonResponse({"urls": urls}, status=200)

class PostView(APIView):
    @method_decorator(auth_middleware())
    def post(self, request):
        data = json.loads(request.body)
        title = data.get("title")
        text = data.get("text")
        medias = data.get("medias", [])
        user = request.session["id"]

        if not title or not text or len(medias) > 5:
            return JsonResponse({"error": "Error validating fields"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("BEGIN;")

                cursor.execute("""
                    INSERT INTO Post (user, title, text)
                    VALUES (%s, %s, %s)
                """, [user, title, text])
                post = cursor.lastrowid

                for url, type in medias:
                    cursor.execute("""
                        INSERT INTO Media (post, URL, type)
                        VALUES (%s, %s, %s)
                    """, [post, url, type])

                cursor.execute("COMMIT;")
        except Exception as e:
            with connection.cursor() as cursor:
                cursor.execute("ROLLBACK;")
            return JsonResponse({"error": str(e)}, status=500)
        
        return JsonResponse({"message": "Added to posts!", "test": medias})
    
    @method_decorator(auth_middleware())
    def get(self, request):
        search_query = request.GET.get('searchQuery')

        try:
            with connection.cursor() as cursor:
                if not search_query:
                    cursor.execute("""
                        SELECT p.postID, p.title, p.text, u.first, u.last,
                            (
                                SELECT COUNT(*) 
                                FROM `Like` l 
                                WHERE l.post = p.postID
                            ) AS likes,
                            GROUP_CONCAT(m.URL) AS media_urls,
                            GROUP_CONCAT(m.type) AS media_types
                        FROM Post p
                        INNER JOIN User u ON p.user = u.userID
                        LEFT JOIN Media m ON p.postID = m.post
                        GROUP BY p.postID
                        ORDER BY p.postID DESC
                    """)
                    rows = cursor.fetchall()
                else:
                    cursor.execute("""
                        SELECT p.postID, p.title, p.text, u.first, u.last,
                            (
                                SELECT COUNT(*) 
                                FROM `Like` l 
                                WHERE l.post = p.postID
                            ) AS likes,
                            GROUP_CONCAT(m.URL) AS media_urls,
                            GROUP_CONCAT(m.type) AS media_types
                        FROM Post p
                        INNER JOIN User u ON p.user = u.userID
                        LEFT JOIN Media m ON p.postID = m.post
                        WHERE MATCH(p.title) AGAINST(%s IN BOOLEAN MODE)
                        GROUP BY p.postID
                        ORDER BY p.postID DESC
                    """, [f'{search_query}*'])
                    rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        posts = [
            {
                "postID": row[0],
                "title": row[1],
                "text": row[2],
                "creator": row[3] + " " + row[4],
                "likes": row[5],
                "media": [
                    {"url": url, "type": type}
                    for url, type in zip(row[6].split(","), row[7].split(","))
                ] if row[6] else [],
            }
            for row in rows
        ]

        return JsonResponse({"posts": posts}, status=200)

@api_view(['POST', 'DELETE'])
@auth_middleware()
def like_view(request, id):
    user = request.session["id"]

    if request.method == 'POST':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO `Like` (user, post)
                    VALUES (%s, %s)
                """, [user, id])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
        return JsonResponse({"message": "Liked!"})
    else:
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM `Like`
                    WHERE user = %s AND post = %s
                """, [user, id])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
        return JsonResponse({"message": "Unliked!"})

class CommentView(APIView):
    @method_decorator(auth_middleware())
    def post(self, request, id):
        data = json.loads(request.body)
        comment = data.get("comment")
        user = request.session["id"]

        if not comment:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO Comment (user, post, comment)
                    VALUES (%s, %s, %s)
                """, [user, id, comment])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
        return JsonResponse({"message": "Added comment!"})
    
    @method_decorator(auth_middleware())
    def get(self, request, id):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT c.comment, u.userID, u.first, u.last
                    FROM Comment c                               
                    INNER JOIN User u ON c.user = u.userID
                    WHERE c.post = %s
                """, [id])
                rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        comments = [
            {
                "comment": row[0],
                "userID": row[1],
                "first": row[2],
                "last": row[3],
            }
            for row in rows
        ]

        return JsonResponse({"comments": comments}, status=200)
    
class FundraiserView(APIView):
    @method_decorator(auth_middleware(required_permission_level='staff'))
    def post(self, request):
        data = json.loads(request.body)
        name = data.get("name")
        goal = data.get("goal")
        description = data.get("description", "")
        ends = data.get("ends")
        creator = request.session["id"]

        if not all([name, ends]):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO Fundraiser (creator, goal, description, ends, name)
                    VALUES (%s, %s, %s, %s, %s)
                """, [creator, goal, description, ends, name])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"message": "Fundraiser created!"})
    
    @method_decorator(auth_middleware())
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT f.fundraiserID, f.name, f.goal, f.description, f.ends,
                        COALESCE(SUM(d.amount), 0) AS raised
                    FROM Fundraiser f
                    LEFT JOIN Donation d ON f.fundraiserID = d.fundraiser
                    GROUP BY f.fundraiserID
                    ORDER BY f.ends
                """)
                rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        fundraisers = [
            {
                "fundraiserID": row[0],
                "name": row[1],
                "goal": row[2],
                "description": row[3],
                "ends": row[4],
                "raised": row[5],
            }
            for row in rows
        ]

        return JsonResponse({"fundraisers": fundraisers}, status=200)

class SocialEventView(APIView):
    @method_decorator(auth_middleware(required_permission_level='staff'))
    def post(self, request):
        data = json.loads(request.body)
        name = data.get("name")
        timestamp = data.get("timestamp")
        street = data.get("street", "")
        city = data.get("city", "")
        state = data.get("state", "")
        ZIP = data.get("ZIP", "")
        description = data.get("description", "")
        creator = request.session["id"]

        if not all([name, timestamp]):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO SocialEvent (name, creator, timestamp, street, state, city, ZIP, description)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, [name, creator, timestamp, street, state, city, ZIP, description])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"message": "Social event created!"})

    @method_decorator(auth_middleware())
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT e.eventID, e.name, e.timestamp, e.street, e.state, e.city, e.ZIP, e.description,
                        COUNT(r.user) AS rsvpCount,
                        GROUP_CONCAT(CONCAT(u.first, ' ', u.last) SEPARATOR ', ') AS rsvpers
                    FROM SocialEvent e
                    LEFT JOIN RSVP r ON e.eventID = r.event
                    LEFT JOIN User u ON r.user = u.userID
                    GROUP BY e.eventID
                    ORDER BY e.timestamp DESC;
                """)
                rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        events = [
            {
                "eventID": row[0],
                "name": row[1],
                "timestamp": row[2],
                "street": row[3],
                "state": row[4],
                "city": row[5],
                "ZIP": row[6],
                "description": row[7],
                "rsvpCount": row[8],
                "rsvpers": row[9].split(", ") if row[9] else [],
            }
            for row in rows
        ]

        return JsonResponse({"events": events}, status=200)

class JobView(APIView):
    @method_decorator(auth_middleware(required_permission_level='staff'))
    def post(self, request):
        data = json.loads(request.body)
        title = data.get("title")
        URL = data.get("url")
        description = data.get("description", "")
        creator = request.session["id"]

        if not all([title, URL]):
            return JsonResponse({"error": "Missing required fields"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO JobPosting (creator, URL, description, title)
                    VALUES (%s, %s, %s, %s)
                """, [creator, URL, description, title])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"message": "Job posting created!"})

    @method_decorator(auth_middleware())
    def get(self, request):
        search_query = request.GET.get('searchQuery')
        
        try:
            with connection.cursor() as cursor:
                if search_query:
                    cursor.execute("""
                        SELECT j.jobID, j.title, j.URL, j.description
                        FROM JobPosting j
                        WHERE MATCH(j.title) AGAINST(%s IN BOOLEAN MODE);
                    """, [f'{search_query}*'])
                else:
                    cursor.execute("""
                        SELECT j.jobID, j.title, j.URL, j.description
                        FROM JobPosting j
                    """)
                rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        jobs = [
            {
                "jobID": row[0],
                "title": row[1],
                "URL": row[2],
                "description": row[3],
            }
            for row in rows
        ]

        return JsonResponse({"jobs": jobs, 
                "query": search_query}, status=200)

class DonationView(APIView):
    @method_decorator(auth_middleware())
    def post(self, request, id):
        data = json.loads(request.body)
        amount = data.get("amount")
        user = request.session["id"]

        if not all([amount]) or amount <= 0:
            return JsonResponse({"error": "Invalid fields provided"}, status=400)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO Donation (fundraiser, user, amount)
                    VALUES (%s, %s, %s)
                """, [id, user, amount])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"message": "Donation added"})

    @method_decorator(auth_middleware())
    def get(self, request, id):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT d.donationID, d.amount, d.user, u.first, u.last
                    FROM Donation d
                    INNER JOIN User u ON d.user = u.userID
                    WHERE d.fundraiser = %s
                    ORDER BY d.amount DESC
                """, [id])
                rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        donations = [
            {
                "donationID": row[0],
                "amount": row[1],
                "user": {
                    "userID": row[2],
                    "first": row[3],
                    "last": row[4]
                },
            }
            for row in rows
        ]

        return JsonResponse({"donations": donations}, status=200)

class RSVPView(APIView):
    @method_decorator(auth_middleware())
    def post(self, request, id):
        user = request.session["id"]

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO RSVP (user, event)
                    VALUES (%s, %s)
                """, [user, id])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"message": "RSVP added"})
    
    @method_decorator(auth_middleware())
    def delete(self, request, id):
        user = request.session["id"]

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM RSVP
                    WHERE user = %s AND event = %s
                """, [user, id])
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"message": "RSVP removed"})

    @method_decorator(auth_middleware())
    def get(self, request, id):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT r.user, u.first, u.last
                    FROM RSVP r
                    INNER JOIN User u ON r.user = u.userID
                    WHERE r.event = %s
                """, [id])
                rows = cursor.fetchall()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

        rsvps = [
            {
                "userID": row[0],
                "first": row[1],
                "last": row[2]
            }
            for row in rows
        ]

        return JsonResponse({"rsvps": rsvps}, status=200)
    
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

            return JsonResponse(users)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

@api_view(['GET'])
@auth_middleware()
def rsvps_view(request):
    user = request.session["id"]

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT event
                FROM RSVP r
                WHERE user = %s;
            """, [user])
            rows = cursor.fetchall()
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"rsvped": [row[0] for row in rows]})

@api_view(['GET'])
@auth_middleware()
def likes_view(request):
    user = request.session["id"]

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT post
                FROM `Like` l
                WHERE user = %s;
            """, [user])
            rows = cursor.fetchall()
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"likes": [row[0] for row in rows]})
