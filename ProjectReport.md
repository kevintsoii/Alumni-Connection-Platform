# CS 157A Final Project Report

Members
- Kevin Tsoi - 016999879 - kevin.tsoi@sjsu.edu
- Samson Xu - 016959371 - samson.xu@sjsu.edu
- Huy Duong - 017083716 - huy.n.duong@sjsu.edu
- Marvin Zhai - 017076930 - marvin.zhai@sjsu.edu

## Goals & Overview

Our goal is to facilitate meaningful connections among San Jose State University (SJSU) students, alumni, and professors. University is a difficult endeavor for many people, and a place for professional networking, mentorship, and collaboration would benefit both students and graduates by helping them meet others. Alumni and staff have connections and opportunities that are helpful to students, but these are often difficult to find on existing platforms like Handshake which are flooded with outside opportunities that have a low response rate. Our website, Spartan Outreach, will provide a centralized and SJSU-exclusive social media platform to solve these problems.

Users on our website can sign up using an SJSU email address and password and filling out information such as graduation year and current status. Currently, only students can sign up without approval to keep the site secure. After logging in with their credentials, students can view an alumni wall to connect and view contact information. On the posts page, anyone can share their stories or experiences, similar to a social media website. There will also be pages for events, job opportunities, and fundraisers. Here, alumni and staff can post jobs they are hiring for, advertise research positions, and invite others to events. Anyone can donate, RSVP, and apply externally to these listings. With all these new tools available, we hope that students, alumni, and staff can make meaningful connections and advance their careers.

## Functional Requirements

Users must sign up and login with an email and password. They must enter a first and last name and graduation year. Optionally, they can include a major, degree, and graduation month. By default, only students with a SJSU email address can sign up, and alumni and staff need approved accounts with higher permission levels.

Alumni accounts can optionally add themselves to be displayed on the alumni wall with their current company, industry, and external contact links. The alumni wall can be filtered by company, industry, graduation year, and major. Any user can click on their profile and send a connection request and further contact them off-site through contact links if desired. Connections can be pending, accepted, or not exist. 

Posts can be done by anyone, and contain title, text, and possible media URLs (URL, photo, or video). All posts will be displayed and are able to be filtered by substrings in the title. Users can like a post at most once and add multiple textual comments. A total comment and like counter will be shown. Comments will be displayed in a toggleable dropdown. 

Staff can create fundraisers to raise money. They can set a name, goal, description, and end date. Donations are not validated but are tracked on the website to show total donations and the names of the donors. Users can donate multiple times.

Staff can also create events for others to join. They can input a name, date, description, and an optional address. Anyone can RSVP, and the list of attendees will be publicly visible alongside a total attendee count. 
Both alumni and staff can post job postings. These will contain a job title that can be searched, a description, and an external URL to apply.

## Architecture

For our project, we aimed to follow a three-tier architecture with MVC (Model-View-Controller) principles. Our model is MySQL, which we used as our database. The view is the React frontend. The controller is the Django (Python) backend where we serve our API endpoints. This separated the responsibilities cleanly and allowed for an easier way to manage the many pieces of our website. To facilitate collaboration across our different OS and to make running the application easier, we used Docker to have isolated containers for React, MySQL, and Django.

Although Django is known for being a monolithic solution with its built in ORM and ability to render pages, we did not use these functionalities. We wrote our own SQL statements for all database manipulations. Users interact with frontend React components, which use APIs to send data to Django. The Django API endpoints process the data and run SQL queries in the MySQL database and return result messages back to the frontend to update the display.

SQL table creation statements and initial data insertion can be found in /db/init.sql. The rest of our query statements and manipulation statements are in /server/api/views.py. In general, /client contains all the frontend code while /server contains the backend.

## ER Design

![image](https://github.com/user-attachments/assets/b3384a98-93f5-4316-b3af-fceee203e03c)


## DB Design

### Initial Relational Schema

We created our initial tables based off of the ER diagram and used underlines to show primary keys. Priamary keys are bolded since underlines did not work in markdown. Foreign key relationships are described in bullet points. Data types will be defined in the SQL. We ended up with 13 tables. To conform to relational design, we already split some atomic values that will be discussed in 1NF.

User(**userID**, email, password, first, last, major, degree, gradMonth, gradYear, type, department, title)

Connection(**user1, user2**)
- user1 is FK to User: userID
- user2 is FK to User: userID

AlumniWall(**user**, company, industry)
- user is FK to User: userID

AlumniContact(**user, url**)
- user is FK to User: userID

Post(**postID**, user, title, text)
- user is FK to User: userID

Media(**post, URL**, type)
- post is FK to Post: postID

Like(**user, post**)
- user is FK to User: userID
- post is FK to Post: postID

Comment(**commentID**, user, post, comment)
- user is FK to User: userID
- post is FK to Post: postID

Fundraiser(**fundraiserID**, creator, goal, description, ends, name)
- creator is FK to User: userID

Donation(**donationID**, fundraiser, user, amount)
- user is FK to User: userID
- fundraiser is FK to Fundraiser: fundraiserID

SocialEvent(**eventID**, name, creator, timestamp, street, state, city, ZIP, description)
- creator is FK to User: userID

RSVP(**user, event**)
- user is FK to User: userID
- event is FK to SocialEvent: eventID

JobPosting(**jobID**, creator, URL, description, title)
- creator is FK to User: userID

### Functional Dependencies:

We omitted 4 tables such as Connection(user1, user2) that only have trivial or redundant dependencies like user1, user2 → user1, user2.

User
- userID → email, password, name, major, degree, graduation, type, department, title
- email → userID, password, name, major, degree, graduation, type, department, title

AlumniWall
- user → company, industry

Post
- postID → user, title, text

Media
- post, URL → type

Comment
- commentID → user, post, comment

Fundraiser
- fundraiserID → creator, goal, description, ends, name

Donation
- donationID → fundraiser, user, amount

SocialEvent
- eventID → name, creator, timestamp, location, description

JobPosting
- jobID → creator, URL, description, title

### Candidate Keys:

User
- userID
- email

Connection
- user1, user2

AlumniWall
- user

AlumniContact
- user, url

Post
- postID

Media
- post, url

Like
- user, post

Comment
- commentID

Fundraiser
- fundraiserID

Donation
- donationID

SocialEvent
- eventID

RSVP
- user, event

JobPosting
- jobID

### 1NF

To be in 1NF, all attributes have to be atomic (indivisible) values. We made sure this was satisfied before making the relation design by splitting User’s graduation to gradMonth and gradYear. We had also split User’s name to first and last. Finally, we also previously split SocialEvent’s location to Street, City, State, and ZIP.

User(userID, email, password, first, last, major, degree, gradMonth, gradYear, type, department, title)

Connection(user1, user2)

AlumniWall(user, company, industry)

AlumniContact(user, url)

Post(postID, user, title, text)

Media(post, URL, type)

Like(user, post)

Comment(commentID, user, post, comment)

Fundraiser(fundraiserID, creator, goal, description, ends, name)

Donation(donationID, fundraiser, user, amount)

SocialEvent(eventID, name, creator, timestamp, street, state, city, ZIP, description)

RSVP(user, event)

JobPosting(jobID, creator, URL, description, title)

### 2NF

To be in 2NF, every non-candidate key attribute has to be fully functional dependent on the whole candidate key on top of satisfying 1NF. All our tables satisfy this already because all of our candidate keys are singular, so no non-candidate key attribute can be partially dependent on a subset. The only exception is post, URL → type in Media, but a post or URL alone can’t determine the type of Media accurately (a URL could be used as a URL type in one post and as a Photo type in another).

There is no change from the 1NF design.

### 3NF

To be in 3NF, no non-candidate key attributes are transitively dependent on a candidate key on top of satisfying 2NF. All our tables satisfy this already because all of the left hand sides of the FDs are candidate keys. There are no transitive dependencies originating from a non-candidate key to another non-candidate key.

There is no change from the 1NF design.

### BCNF
To be in BCNF, every functional dependency X → Y must have X as a candidate key, on top of satisfying 3NF. Since our schema already satisfies 3NF, and every X is a candidate key, this means that Boyce-Codd Normal Form is satisfied for our schema as well.

There is no change from the 1NF design.

## Major Design Decisions
We used indexing and transactions

## Implementation Details

## Demonstration
Video link

## Conclusion

We successfully created a full-stack web application with mySQL, React, and Django which allows users to 

A lesson we learned includes

Some future improvements we can make are to include a chat feature so that users could communicate with each other privately, instead of purely interacting off a post’s comments. 
