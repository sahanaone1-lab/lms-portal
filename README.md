# Company LMS Portal (Elevate Academy)

Elevate Academy is a premium, full-stack corporate Learning Management System (LMS) designed for managing courses, tracking intern achievements, administering quizzes, submitting assignments, grading work, and claiming completion certificates.

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide icons, Axios, React Query, React Router.
- **Backend**: NestJS, PostgreSQL, Prisma ORM, Passport, JWT Authentication (Stateful refresh cookies + Stateless authorization header).

---

## 📁 Project Structure

```
/Users/sahanas/career solution/
├── backend/                  # NestJS backend application
│   ├── src/
│   │   ├── prisma/          # Global Prisma module & service wrapper
│   │   ├── auth/            # JWT validation, cookie session, roles decorators
│   │   ├── users/           # User profiles, passwords, directory updates
│   │   ├── courses/         # Syllabus catalog and enrollments CRUD
│   │   ├── lessons/         # Video links and sequential study guides
│   │   ├── assignments/     # Project Coordinators practical tasks board
│   │   ├── submissions/     # Intern assignments entries and project coordinator grading flow
│   │   ├── quizzes/         # Multiple-choice questionnaire tests and auto-grading
│   │   ├── certificates/    # Claim check requirements audits and PDF printing
│   │   └── notifications/   # In-app alert logs for interns and project coordinators
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL database mapping models
│   │   └── seed.ts          # Default mock database values seed script
│   ├── .env                 # Database and JWT configuration keys
│   └── package.json
│
└── frontend/                 # Vite React TypeScript frontend application
    ├── src/
    │   ├── components/      # Common UI primitives (Button, Input, Card, Modal, Tabs)
    │   ├── layouts/         # Role-based sidebars, header, and notifications bell layout
    │   ├── pages/           # Login, Register, Profile Settings, and Roles Dashboards
    │   ├── services/        # Axios clients, Interceptors for token-refresh, and endpoints
    │   ├── store/           # AuthContext login, logout, and token session contexts
    │   ├── types/           # Core TypeScript types and roles contracts
    │   └── utils/           # Class merges tailwindcn utilities
    └── package.json
```

---

## ⚙️ Setup and Running Guide

### Step 1: Database Setup (Manual)
1. Install and start **PostgreSQL** on your local machine (e.g. using Postgres.app on Mac, brew, or docker).
2. Create a new database named `company_lms` or adjust the connection string.
3. Configure the connection URL in the backend `.env` file (`backend/.env`):
   ```ini
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/company_lms?schema=public"
   ```

### Step 2: Backend Migrations
Run these commands inside the `backend` folder to run database migrations:
```bash
# Go to backend directory
cd backend

# Apply migrations
npx prisma migrate dev --name init
```

### Step 3: Launch Local Servers

#### 1. Start NestJS Backend
Run this command inside the `backend` directory:
```bash
npm run start:dev
```
The server will boot and listen on **http://localhost:3000**.

#### 2. Start Vite React Frontend
In a new terminal shell, run this command inside the `frontend` directory:
```bash
cd frontend
npm run dev
```
The client dashboard will boot and listen on **http://localhost:5173**.

---

## 🔑 Default Credentials

You can sign in using the following default accounts (already present in the permanent database):

| Role | Corporate Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@company.com` | `admin123` | Create project coordinators/interns, delete users, view total analytics, verify course logs. |
| **Project Coordinator** | `coordinator@company.com` (or `EMP-001`) | `1985-06-15` (DOB) | Create courses, write lessons, issue assignments, draft multiple-choice quizzes, grade entries. |
| **Intern** | `intern@company.com` | `intern123` | Enroll in courses, watch lesson videos, upload tasks, answer interactive quizzes, download PDF certificate. |
