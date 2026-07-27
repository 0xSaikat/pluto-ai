# 🛡️ Pluto AI — Code Security Analyzer

<div align="center">

![logo](assets/cover.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-CSE4104--7C--T04-181717?logo=github)](https://github.com/0xSaikat/pluto-ai)

**Pluto AI** is an AI-powered web platform that scans source code for security vulnerabilities, classifies risks using CWE standards, and generates detailed remediation reports.

[Features](#-core-features) • [Web Platform](#-web-platform) • [Getting Started](#-getting-started) • [Documentation](#-project-documentation) • [Team](#-team-information)

</div>

---

## Team Information

| Name | Student ID |
|------|-----------|
| Sadia Islam Jhumur | 11230121171 | 
| Sakil Hasan Saikot | 11230121188 | 
| Tanjilanta Kanchi | 11220321034 | 
| Farin Islam Mim | 11230121061 | 

---

## Problem Statement

Developers frequently introduce security vulnerabilities without 
realizing it. Most existing tools are either too complex, too 
expensive, or require deep security expertise to interpret results.

Pluto AI solves this by providing a simple web interface where 
any developer can paste code or submit a GitHub repository and 
instantly receive a clear, detailed vulnerability report with 
specific fix recommendations.

---

## What the Platform Does

- Accepts source code via direct paste or GitHub repository URL
- Analyzes code using an AI security engine
- Detects security weaknesses and classifies them by severity
- Maps each finding to its CWE standard classification
- Calculates an overall risk score from 0 to 100
- Generates a downloadable security report
- Tracks scan history and activity through a user dashboard

---

## ✨ Core Features

**User Authentication**
- Registration and login with JWT authentication
- Password hashing with bcrypt
- Protected routes and role-based access control

**Project Management**
- Create and organize multiple projects
- View project history and previous scans
- Full CRUD operations per project

**Source Code Scanning**
- Submit code via paste or GitHub repository URL
- Real-time scan status tracking
- Rescan capability on existing submissions

**AI-Powered Vulnerability Detection**
- Detects 12 types of real-world security vulnerabilities
- CWE standard classification for every finding
- Severity levels — CRITICAL, HIGH, MEDIUM, LOW
- Remediation recommendation for each vulnerability
- Risk score calculated from 0 to 100

**Security Reports**
- Auto-generated after every completed scan
- Full vulnerability summary with severity breakdown
- Downloadable report in JSON format

**Dashboard**
- Live statistics — total scans, threats found, safe projects
- Recent activity feed loaded from backend
- No hardcoded data

**Activity Logging**
- Every user action recorded automatically
- Full audit trail visible on dashboard

**Vulnerability Tracking**
- Mark each finding as open, fixed, or ignored
- Track remediation progress per scan
---

## Technology Stack

**Frontend**

| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 4 | Styling |
| React Router DOM | 6 | Navigation |

**Backend**

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | LTS | Runtime |
| Express.js | 4 | API framework |
| PostgreSQL | 18 | Database |
| Sequelize | 6 | ORM |
| JSON Web Token | 9 | Authentication |
| bcryptjs | 2 | Password security |

## Database
- PostgreSQL 18
- Sequelize ORM v6

## AI Services
- Google Gemini API

## Development Tools
- Git
- GitHub
- VS Code
- Postman
- pgAdmin
- Figma

## Deployment
- Vercel (Frontend)
- Render (Backend)
- Neon or Supabase (PostgreSQL cloud database)
---

## Repository Structure

```
pluto-ai/
├── frontend/               ← React.js web application
│   ├── src/
│   │   ├── pages/          ← All page components
│   │   ├── components/     ← Reusable UI components
│   │   └── api.js          ← Backend API service
│   └── README.md
├── backend/                ← Node.js REST API
│   ├── src/
│   │   ├── controllers/    ← Route handler functions
│   │   ├── models/         ← Sequelize database models
│   │   ├── routes/         ← API endpoint definitions
│   │   ├── middleware/     ← Auth and validation middleware
│   │   └── services/       ← Business logic and AI engine
│   └── README.md
├── database/               ← Database related files
├── documentation/          ← Weekly reports and documents
├── diagrams/               ← ER diagram, activity diagram, system design
└── README.md
```

---

## Getting Started

### Requirements
- Node.js LTS
- PostgreSQL 18
- npm

### Run Backend
```bash
cd backend
npm install
npm run dev
```
Server starts at `http://localhost:5000`

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```
App opens at `http://localhost:5173/pluto-ai/`

> Both servers must run at the same time.
> See each folder's README for full configuration details.

---

## Project Documentation

### Available Documents

| Document | Description |
|----------|-------------|
| Project Proposal | Initial project idea, objectives and scope |
| Team Information Sheet | Team members, roles and responsibilities |
| Software Requirements Specification | Functional and non-functional requirements |
| System Design Document | Architecture, API design and component breakdown |
| UI/UX Design Document | Screen designs and user flow |
| Backend Progress Report | API implementation and database documentation |
| Frontend Integration Report | UI development and backend connection details |
| Database Design Document | ER diagram, table schemas and relationships |
| API Collection | Postman collection for all 23 endpoints |

### Available Diagrams

| Diagram | Description |
|---------|-------------|
| System Architecture Diagram | Multi-layer system architecture overview |
| Entity Relationship Diagram | Database tables and relationships |
| Use Case Diagram | User and admin interactions with the system |
| Activity Diagram | Step-by-step scan workflow from submission to report |
---

## Development Progress

| Week | Deliverable | Status |
|------|-------------|--------|
| Week 01 | Team formation and idea selection | ✅ Done |
| Week 02 | Project proposal | ✅ Done |
| Week 03 | Software Requirements Specification | ✅ Done |
| Week 04 | System design and ER diagram | ✅ Done |
| Week 05 | UI/UX design | ✅ Done |
| Week 06 | Backend development and database | ✅ Done |
| Week 07 | Frontend development and integration | ✅ Done |
| Week 08 | Testing and deployment | 🔄 Upcoming |

---

## Disclaimer

This platform was developed for educational purposes as part of 
CSE4104 Software Development III coursework. It is intended for 
legitimate security analysis only. Always ensure you have 
permission before scanning code you do not own.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

