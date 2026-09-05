Employee HelpDesk & Ticketing System



A full-stack employee helpdesk and ticketing application that allows employees to raise support requests and enables support agents, department managers, and administrators to manage, track, resolve, and report on those requests.

Project Overview
The system provides a centralized platform for company support requests across departments such as IT Support, Human Resources, Finance, and Administration.

Main Workflow
Employee creates ticket → Support Agent receives/accepts ticket → Ticket is assigned and worked on → Agent adds comments/resolution → Employee confirms resolution → Ticket is closed.

Features
Employee
Register and login

JWT-based authentication

Create support tickets

Select department and category

Set priority: Low, Medium, High, Critical

Add ticket description and attachment

View own tickets

Search and filter tickets

View ticket details

Reply/comment on tickets

Confirm ticket resolution

Reopen a resolved ticket

Manage profile

Support Agent
Secure role-based login

View assigned/available tickets

Accept and assign tickets

Update ticket status

Update priority

Add comments/replies

Transfer tickets

Add resolution notes

Work with ticket attachments

Admin
Admin dashboard statistics

View and manage all tickets

Search/filter tickets

Manage users

Activate/deactivate users

Manage departments

Reports and analytics

Ticket status, priority, department, category and agent workload reports

Critical and overdue ticket monitoring

Security
Password hashing with bcryptjs

JWT authentication

Protected API routes

Role-based authorization

Admin-only routes

Environment variables for secrets

Technology Stack
Frontend
React

Vite

React Router

Axios

Bootstrap / Bootstrap Icons

Recharts

Backend
Node.js

Express.js

MongoDB

Mongoose

JWT

bcryptjs

Multer

CORS

dotenv

Tools & Deployment
Git

GitHub

Postman

MongoDB Atlas

Vercel — Frontend

Render — Backend

Project Structure
HelpDesk/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── .env
│   ├── package.json
│   └── ...
│
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    ├── .env
    ├── package.json
    └── server.js
Database Schema
User
_id

name

email

password

department

role

phone

profileImage

isActive

createdAt

updatedAt

Roles:

employee

supportAgent

manager

admin

Ticket
_id

title

description

department

category

priority

status

slaDeadline

createdBy → User

assignedTo → User

attachment

resolution

comments[]

createdAt

updatedAt

Ticket priorities:

Low

Medium

High

Critical

Ticket statuses:

Open

Assigned

In Progress

Waiting for Employee

Resolved

Closed

Department
_id

name

description

isActive

createdAt

updatedAt

Note: In the current implementation, department in User and Ticket is stored as a string. The createdBy, assignedTo, and comment user fields are MongoDB ObjectId references to User.

SLA Rules
The backend calculates an SLA deadline when a ticket is created:

Priority	SLA
Critical	4 hours
High	8 hours
Medium	24 hours
Low	48 hours
A ticket is considered overdue when its SLA deadline has passed and its status is not Resolved or Closed.

API Overview
Base URL:

/api
Authentication
POST /api/auth/register
POST /api/auth/login
Employee/User
GET /api/users/profile
Tickets
POST   /api/tickets
GET    /api/tickets
GET    /api/tickets/:id

GET    /api/tickets/agent/all
PUT    /api/tickets/:id/assign
PUT    /api/tickets/:id/accept
PUT    /api/tickets/:id/status
PUT    /api/tickets/:id/priority
POST   /api/tickets/:id/comments
PUT    /api/tickets/:id/transfer
PUT    /api/tickets/:id/resolve
PUT    /api/tickets/:id/confirm
PUT    /api/tickets/:id/reopen
Admin
GET    /api/admin/dashboard
GET    /api/admin/tickets
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id/status

GET    /api/admin/departments
POST   /api/admin/departments
PUT    /api/admin/departments/:id
DELETE /api/admin/departments/:id

GET    /api/admin/reports
All protected endpoints require:

Authorization: Bearer <JWT_TOKEN>
Installation
1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd HelpDesk
2. Backend setup
cd backend
npm install
npm run dev
Backend runs locally on:

http://localhost:5000
3. Frontend setup
Open another terminal:

cd frontend
npm install
npm run dev
Frontend runs locally on the Vite development URL shown in the terminal.

Environment Variables
Backend
Create:

backend/.env
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
Frontend
Create:

frontend/.env
VITE_API_URL=http://localhost:5000/api
For production, replace it with the deployed Render backend API URL.

Deployment
Backend — Render
The backend is deployed as a Render Web Service.

Recommended Render settings:

Root Directory: backend
Build Command: npm install
Start Command: npm start
Required Render environment variables:

MONGO_URI
JWT_SECRET
Frontend — Vercel
The frontend is deployed from the frontend directory.

Recommended Vercel settings:

Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Required Vercel environment variable:

VITE_API_URL=https://YOUR-RENDER-BACKEND-URL/api
Authentication & Authorization
JWT tokens are generated after successful login and stored on the frontend.

The Axios API client automatically sends the token using:

Authorization: Bearer <token>
Role-based access is used for:

Employee

Support Agent

Department Manager

Admin

Testing
The project can be tested using:

Browser UI

Postman

MongoDB Atlas

Browser developer console

Recommended test flow:

Register employee

Login as employee

Create ticket

Login as support agent

Assign/accept ticket

Update status and priority

Add comment

Add resolution

Login as employee

Confirm or reopen ticket

Login as admin

Verify dashboard statistics

Verify users, departments, tickets and reports

Screenshots
Add project screenshots here before final submission.

Example:

docs/screenshots/
├── login.png
├── register.png
├── employee-dashboard.png
├── create-ticket.png
├── ticket-details.png
├── agent-dashboard.png
├── agent-tickets.png
├── admin-dashboard.png
├── admin-tickets.png
├── admin-users.png
├── admin-departments.png
└── admin-reports.png
ER Diagram
The project includes a database ER/schema document covering:

User

Ticket

Department

User-to-Ticket relationships

Ticket assignment relationships

Department relationships

Future Improvements
Persistent cloud file storage for ticket attachments

Email notifications

Password reset through email

More detailed SLA history

Resolution-time analytics using a dedicated resolvedAt field

Real-time ticket notifications

Department ObjectId references for stronger database normalization

Security Notes
Never commit .env files, database passwords, JWT secrets, or other credentials to GitHub.

Recommended .gitignore:

Backend
node_modules/
.env
uploads/
Frontend
node_modules/
dist/
.env
Project Submission
Live Frontend: YOUR_VERCEL_URL

Live Backend: YOUR_RENDER_URL

GitHub Repository: YOUR_GITHUB_URL

Database: MongoDB Atlas

API Testing: Postman

ER Diagram: Employee_HelpDesk_ER_Diagram.pdf

Documentation: README.md

Author
Gayathri Devi

Employee HelpDesk & Ticketing System — Internship Project