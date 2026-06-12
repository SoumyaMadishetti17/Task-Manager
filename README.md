# TaskFlow — Role-Based Task Manager

A full-stack MERN application with role-based access control (Admin/User), activity tracking, and an admin dashboard.

🔗 **Live Demo:** https://task-manager-pink-nu.vercel.app  
🔧 **Backend API:** https://task-manager-2irq.onrender.com  
📁 **GitHub:** https://github.com/SoumyaMadishetti17/Task-Manager  
🔀 **Pull Request:** https://github.com/SoumyaMadishetti17/Task-Manager/pull/1

---

## Demo Accounts

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@demo.com  | admin123  |
| User  | user@demo.com   | user123   |

---

## Features

### Backend (Node.js + Express + MongoDB)
- **JWT Authentication** — register, login, protected routes
- **Role-Based Access** — Admin and User roles with separate permissions
- **Admin APIs** — view/delete users, toggle Active/Inactive status, view all tasks, delete any task, analytics
- **User APIs** — CRUD on own tasks only
- **Activity Log** — tracks LOGIN, TASK_CREATED, TASK_UPDATED, TASK_DELETED events
- **Authorization Middleware** — `protect` (JWT check) and `adminOnly` guards

### Frontend (React + Vite)
- **Auth flow** — Login / Register pages with token-based session
- **Role-Based Routing** — admins see admin routes, users are redirected
- **Admin Dashboard** — analytics, completion rate, task breakdown charts
- **User Management** — view all users, toggle status, delete users
- **Task Monitoring** — view all tasks across users, filter, delete
- **Activity Logs** — filterable event timeline
- **My Tasks (User)** — create, edit, delete own tasks with stats summary
- **Responsive UI** — dark theme, mobile-friendly sidebar

---

## Project Structure

```
taskmanager/
├── backend/
│   ├── src/
│   │   ├── controllers/   # auth, task, admin logic
│   │   ├── middleware/     # protect, adminOnly
│   │   ├── models/         # User, Task, ActivityLog
│   │   ├── routes/         # auth, task, admin, activity
│   │   └── index.js        # Express app entry
│   ├── seed.js             # Demo account seeder
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/            # axios client
    │   ├── components/     # Layout, TaskModal
    │   ├── context/        # AuthContext
    │   ├── pages/
    │   │   ├── admin/      # Dashboard, Users, Tasks, Activity
    │   │   └── user/       # UserTasksPage
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Setup & Run Locally

### 1. Clone & branch

```bash
git clone https://github.com/SoumyaMadishetti17/Task-Manager.git
cd Task-Manager
git checkout -b feature/role-based-access
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # set MONGO_URI and JWT_SECRET
npm install
node seed.js                  # create demo accounts
npm run dev                   # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:3000
```

---

## API Endpoints

### Auth
| Method | Path | Access |
|--------|------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Protected |

### Tasks (User — own tasks only)
| Method | Path | Access |
|--------|------|--------|
| GET | /api/tasks | Protected |
| POST | /api/tasks | Protected |
| PUT | /api/tasks/:id | Protected (owner) |
| DELETE | /api/tasks/:id | Protected (owner) |

### Admin
| Method | Path | Access |
|--------|------|--------|
| GET | /api/admin/users | Admin |
| DELETE | /api/admin/users/:id | Admin |
| PATCH | /api/admin/users/:id/status | Admin |
| GET | /api/admin/tasks | Admin |
| DELETE | /api/admin/tasks/:id | Admin |
| GET | /api/admin/analytics | Admin |

### Activity
| Method | Path | Access |
|--------|------|--------|
| GET | /api/activity | Protected (Admin sees all, User sees own) |

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://task-manager-pink-nu.vercel.app |
| Backend | Render | https://task-manager-2irq.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |