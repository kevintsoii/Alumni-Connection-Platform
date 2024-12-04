from django.urls import path

from .views import *

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),

    path('users/', UsersView.as_view(), name='all users'),
    path('users/<int:id>/', user_view, name='user'),
    
    path('connections/', connections_view, name='all connections'),
    path('connections/<int:id>/', ConnectionView.as_view(), name='connection'),

    path('alumni/', AlumniView.as_view(), name='alumni'),
    path('contacts/<int:id>/', contact_view, name='get contacts'),

    path('posts/', PostView.as_view(), name='get contacts'),
    path('media/<int:id>/', media_view, name='get media'),

    path('likes/<int:id>/', like_view, name='add like'),

    path('comments/<int:id>/', CommentView.as_view(), name='comments'),

    path('fundraisers/', FundraiserView.as_view(), name='fundraisers'),
    path('events/', SocialEventView.as_view(), name='social events'),
    path('jobs/', JobView.as_view(), name='job postings'),

    path('donations/<int:id>/', DonationView.as_view(), name='job postings'),
    path('rsvps/<int:id>/', RSVPView.as_view(), name='job postings'),

    path('rsvps/', rsvps_view, name='get user rsvps'),
    path('likes/', likes_view, name='get user likes'),
]
