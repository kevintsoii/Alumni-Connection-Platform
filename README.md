# Alumni-Connection-Platform

CS 157A Final Project

## Set Up

1. Install prerequisites

   - [Docker](https://www.docker.com/)

2. Run Docker

   ```
   docker-compose up --build
   ```

   - When the build finishes, it should say `django-1  | Watching for file changes with StatReloader`

3. Visit the website at http://localhost:5173/

   - There are valid accounts for testing

   ```
   student1@sjsu.edu
   alumni1@sjsu.edu
   staff1@sjsu.edu
   Password: password
   ```

4. Optionally run custom SQL in CMD line (initial data is automatically added when you run Docker)

   ```
   docker exec -it mysql mysql -u root -ppassword
   use spartan_outreach;
   ```

6. Clean Up Docker files

   ```
   docker-compose down -v --rmi all
   ```

## Division of Work

- Kevin: Architecture, Docker, SQL statements, Indexing, Django backend, Authentication front-end
- Huy: Relational DB Design, Normalization, Project Report, Home & Login & Register & Fundraiser front-end
- Samson: ER, Backend API list, Postman testing APIs, Initial data, Navbar & Routing & Posts & Jobs front-end
- Marvin: ER constraints, 1NF, front-end design, Presentation and Video Editing, Alumni & Profile & Connections front-end
