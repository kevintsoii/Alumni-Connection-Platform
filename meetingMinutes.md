# Meeting Minutes

## November 12, 5:45pm - 6:45pm
- Review proposal and make some changes to our final product
  - No chat feature, add comments and likes on posts instead
  - Make Jobs / Events / Fundraisers separate categories on the website
  - Students / Alumni / SJSU Staff are the different user types
  - We will track Donations, RSVPs, and post likes
- Decided technology stack
  - React frontend, Django backend, MySQL database

## November 14, 12:00pm - 1:00pm
- Decided to use Docker since team members have different OS and Python versions
- Decided to start with ER diagram
- Kevin: Worked on integrating MySQL and Django containers into Docker
- Samson: Start working on ER as first step

## November 18, 5:00pm - 6:00pm
- Samson: Create all ER entities and relationships
- Marvin, Huy: Update ER diagram with constraint clarification, weak keys, and defining entities vs relationships
- Kevin: Add React / Vite app container to Docker

## November 21, 5:00pm - 6:00pm
- Kevin: Created Project Report and Presentation
- Samson: Started backend architecture and Filled Report
- Huy: Finished DB Design / ER & started DB Schema
- Marvin: Started Front End designing and prototype

## November 23, 3:00pm - 4:15pm
- Kevin: Add DB initialization script to Docker, work on Django auth for login
- Huy: home, login, signup pages
- Samson: navbar, react router, home page

## November 26, 7:00pm - 8:30pm
- Kevin: add backend endpoints for users, connections, alumni wall
- Huy, Samson: Finish DB Design, FD, Candidate Keys
- Marvin: do 1NF

## December 1, 12:00pm - 2:50pm
- Kevin: finish backend endpoints for events, jobs, fundraisers tables
- Huy, Marvin: finish 2NF → BCNF
- Samson: write backend endpoint examples in Postman

## December 2, 10:00am - 12:00pm
- Kevin: added indexes and finished backend APIs
- Huy: report goals & overview
- Samson: write out Functional Requirements
- Marvin: write out our architecture design, realized to transfer documents to github

## December 3, 7:00pm - 8:30pm
- Kevin: Connected login and alumni frontends to backend endpoints
- Huy: Connected signup and fundraiser frontends to backend endpoints
- Samson: Connected job frontend to backend endpoints, updated navbar
- Marvin: Implemented connections between users, routed alumni wall to profiles
