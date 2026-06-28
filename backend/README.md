# Pluto AI — Backend API
AI Code Security Analyzer

## Team Information

| Name | Student ID | Role |
|------|-----------|------|
| Sadia Islam Jhumur | 11230121171  | Team Leader |
| Sakil Hasan Saikot | 11230121188 | AI Intigration |
| Tanjilanta Kanchi | 11220121034 | Backend |
| Farin Islam Mim | 11230121061 | Frontend |

## Project Overview

Pluto AI is an AI-powered source code security analyzer.
Users submit source code through file upload, direct paste,
or GitHub URL. The system analyzes the code for security
vulnerabilities, classifies severity levels, generates
remediation recommendations, and produces downloadable reports.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js v4 |
| Database | PostgreSQL |
| ORM | Sequelize v6 |
| Authentication | JWT |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| Security | helmet, cors |
| Logging | morgan |

## Prerequisites

- Node.js LTS — https://nodejs.org
- PostgreSQL — https://www.postgresql.org/download
- Postman — https://www.postman.com/downloads

## Setup Instructions

### Step 1 — Clone the repository
```
git clone https://github.com/0xSaikat/pluto-ai.git
cd pluto-ai/backend
```

### Step 2 — Install dependencies
```
npm install
```

### Step 3 — Configure environment variables

Create a .env file and fill in your values:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pluto_db
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Step 4 — Create PostgreSQL database

Open pgAdmin and create a database named: pluto_db

### Step 5 — Start the server
```
npm run dev
```

### Step 6 — Verify server is running

Open browser and go to: http://localhost:5000

Expected response:
```
{
  "message": "Pluto AI Backend is running",
  "status": "ok",
  "version": "1.0.0"
}
```

## Database Structure

### Tables

| Table | Purpose |
|-------|---------|
| users | User accounts and authentication |
| projects | Project groups belonging to users |
| scans | Individual security scan records |
| source_codes | Source code submitted for scanning |
| vulnerabilities | Vulnerabilities detected by AI engine |
| reports | Generated security reports |
| activity_logs | Audit trail of all user actions |
| feedback | User ratings and comments on reports |

### Relationships

- User has many Projects
- Project has many Scans
- Scan has one SourceCode
- Scan has many Vulnerabilities
- Scan has one Report
- User has many ActivityLogs
- User has many Feedback
- Report has many Feedback

## API Endpoints

Base URL: http://localhost:5000

### Authentication — No token required

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get token |
| GET | /api/auth/me | Get current user |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users | Admin | List all users |
| GET | /api/users/me | Yes | Get my profile |

### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/projects | Yes | Create project |
| GET | /api/projects | Yes | List my projects |
| GET | /api/projects/:id | Yes | Get one project |
| PUT | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Delete project |

### Scans

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/scans | Yes | Submit code for scan |
| GET | /api/scans | Yes | List my scans |
| GET | /api/scans/:id | Yes | Get scan with results |
| POST | /api/scans/:id/rescan | Yes | Run scan again |

### Vulnerabilities

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/vulnerabilities | Yes | List vulnerabilities |
| GET | /api/vulnerabilities/:id | Yes | Get one vulnerability |
| PUT | /api/vulnerabilities/:id/status | Yes | Update status |

### Reports

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/reports | Yes | List all reports |
| GET | /api/reports/:id | Yes | Get one report |
| GET | /api/reports/:id/download | Yes | Download as JSON |

### Activity Logs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/activity-logs | Admin | All activity logs |
| GET | /api/activity-logs/me | Yes | My activity logs |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/dashboard | Yes | Stats and activity |

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden — admin only |
| 404 | Not found |
| 500 | Server error |

## Error Response Format

All errors return this format:
```
{
  "success": false,
  "message": "Description of error"
}
```

## AI Integration

The system uses a Mock AI Security Engine that simulates
the Pluto AI platform. It returns realistic vulnerabilities with:

- CWE IDs (Common Weakness Enumeration)
- Four severity levels: CRITICAL, HIGH, MEDIUM, LOW
- Detailed vulnerability descriptions
- Remediation recommendations
- Risk score from 0 to 100

To replace with real AI: edit src/services/mockAI.service.js
and replace the analyzeCode function with real API calls.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── models/
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Scan.js
│   │   ├── SourceCode.js
│   │   ├── Vulnerability.js
│   │   ├── Report.js
│   │   ├── ActivityLog.js
│   │   └── Feedback.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   ├── scan.controller.js
│   │   ├── vulnerability.controller.js
│   │   ├── report.controller.js
│   │   ├── activity.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validate.js
│   │   ├── errorHandler.js
│   │   └── activityLogger.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   ├── scan.routes.js
│   │   ├── vulnerability.routes.js
│   │   ├── report.routes.js
│   │   ├── activity.routes.js
│   │   └── dashboard.routes.js
│   └── services/
│       ├── mockAI.service.js
│       ├── report.service.js
│       └── activity.service.js
├── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── pluto-api-collection.json
```