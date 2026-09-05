# SIH26043 — Backend Service

> Smart India Hackathon 2026 | Government of Jharkhand
> Digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.

---

## Overview

This is the core backend API for SIH26043, built with Node.js + Express using a strict 4-layer architecture. It powers 7 modules across citizen submissions, AI-assisted problem management, university collaboration, industry partnerships, project lifecycle tracking, analytics, and notifications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk (JWT, 4 roles) |
| File Storage | Supabase Storage |
| Email | Resend |
| ML Integration | Python + FastAPI (external service) V1|

---

## Architecture

```
Request
  └── Router         (src/routes/)       — URL mapping only
        └── Controller  (src/controllers/)  — req/res handling
              └── Service    (src/services/)    — business logic
                    └── Repository (src/repositories/) — Supabase queries
```

Each module follows this 4-layer pattern strictly. No layer skips another.

---

## Project Structure

```
sih26043-backend/
├── src/
│   ├── routes/
│   │   ├── challenge.routes.js
│   │   ├── project.routes.js
│   │   ├── milestone.routes.js
│   │   ├── partnership.routes.js
│   │   ├── analytics.routes.js
│   │   └── notification.routes.js
│   ├── controllers/
│   │   ├── challenge.controller.js
│   │   ├── project.controller.js
│   │   ├── milestone.controller.js
│   │   ├── partnership.controller.js
│   │   ├── analytics.controller.js
│   │   └── notification.controller.js
│   ├── services/
│   │   ├── challenge.service.js
│   │   ├── project.service.js
│   │   ├── milestone.service.js
│   │   ├── partnership.service.js
│   │   ├── analytics.service.js
│   │   └── notification.service.js
│   ├── repositories/
│   │   ├── challenge.repository.js
│   │   ├── project.repository.js
│   │   ├── milestone.repository.js
│   │   ├── partnership.repository.js
│   │   ├── analytics.repository.js
│   │   └── notification.repository.js
│   ├── middlewares/
│   │   ├── auth.middleware.js      — Clerk JWT verification
│   │   ├── role.middleware.js      — Role-based access guard
│   │   └── error.middleware.js     — Global error handler
│   ├── utils/
│   │   ├── supabaseClient.js       — Supabase client singleton
│   │   ├── resend.js               — Email utility
│   │   └── mlClient.js             — FastAPI ML service client
│   └── app.js                      — Express app setup
├── index.js                        — Server entry point
├── .env                            — Environment variables (never commit)
├── .env.example                    — Template for env vars
├── .gitignore
└── package.json
```

---

## Modules

| # | Module | Key Endpoints |
|---|---|---|
| 1 | Citizen Submission | `POST /api/challenges` |
| 2 | AI Problem Management | Auto-triggered on submission |
| 3 | University Collaboration | `POST /api/projects` |
| 4 | Industry Partnership | `POST /api/partnerships` |
| 5 | Project Lifecycle | `POST /api/milestones` |
| 6 | Analytics Dashboard | `GET /api/analytics` |
| 7 | Notifications | `GET /api/notifications` |

---

## Roles

| Role | Access |
|---|---|
| `citizen` | Submit challenges, view own submissions, receive notifications |
| `university` | View assigned challenges, create projects, manage milestones |
| `industry` | Browse challenges, offer partnerships and CSR funding |
| `admin` | Full access — assign challenges, manage all data |

Roles are stored in Clerk session metadata (`sessionClaims.metadata.role`).

---

## Database Tables (Supabase)

```sql
users_metadata       — clerk_user_id, role, org_name
challenges           — title, description, domain, location, status, ai_category, priority_score
challenge_media      — challenge_id, file_url, file_type
university_projects  — challenge_id, university_id, mentor, team, status
project_milestones   — project_id, title, due_date, completed
industry_partnerships— challenge_id, industry_id, type, funding_amount, status
notifications        — clerk_user_id, message, is_read
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- A [Supabase](https://supabase.com) project
- A [Clerk](https://clerk.com) application
- A [Resend](https://resend.com) account

### Installation

```bash
git clone https://github.com/your-org/sih26043-backend.git
cd sih26043-backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Environment Variables

```env
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Resend
RESEND_API_KEY=re_...

# ML Service
ML_SERVICE_URL=http://localhost:8000
```

### Scripts

```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Production start
```

### Health Check

```bash
GET /health
# → { "status": "ok", "project": "SIH26043" }
```

---

## API Reference

Full API documentation is maintained separately by the docs team.
Base URL: `http://localhost:3000/api`

All protected routes require:
```
Authorization: Bearer <clerk_jwt_token>
```

---

## Team

| Name | Role |
|---|---|
| Argha | Core backend — Express, Supabase, Clerk, deployment |
| Nibedita | Supporting backend — notifications, milestones, file uploads |
| Pradipta | FastAPI ML service (`/categorize`, `/deduplicate`) |
| Aditya, Soumili | React UI via v0/Bolt |
| Baibhab | PPT, demo script, API documentation |

---

## Demo Flow

1. **Citizen** submits a flood challenge with photo + location
2. **ML service** auto-categorizes → `"Disaster Management"` tag applied
3. **Admin** assigns challenge to a university
4. **University** creates project, adds mentor, sets milestones
5. **Industry** offers CSR funding
6. **Analytics dashboard** shows live counts and domain breakdown
7. **Citizen** receives in-app + email notification

---

## License

Government of Jharkhand / Smart India Hackathon 2026. Internal use only, for development purpose
