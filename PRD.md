# Product Requirements Document
## SIH26043 — Jharkhand Challenge Crowdsourcing Platform
### Smart India Hackathon 2026

---

## 1. Problem Statement

Government of Jharkhand lacks a structured digital channel to:
- Collect and triage societal challenges from citizens at scale
- Route validated problems to academic institutions for research-based solutions
- Facilitate industry CSR investment into real civic problems
- Track solution progress end-to-end with accountability

The result: citizen problems go unheard, universities work in isolation, and CSR funds are misaligned with actual need.

---

## 2. Product Vision

A unified digital platform where:
- **Citizens** report real challenges they face (flooding, infrastructure, health, education)
- **AI** triages, categorizes, and deduplicates submissions automatically
- **Universities** receive validated problem statements and build solution projects
- **Industry** funds or mentors the most impactful projects
- **Government** has a real-time dashboard of challenge status and resolution

---

## 3. Stakeholders

| Stakeholder | Role in Platform | Primary Need |
|---|---|---|
| Citizen | Submit challenges, track status | Easy submission, notification on progress |
| University | Receive and solve assigned challenges | Structured project workspace, milestone tracking |
| Industry | Browse challenges, offer funding/mentoring | Clear impact data, simple partnership flow |
| Admin (Govt.) | Oversee all data, assign challenges | Full visibility, control over routing |

---

## 4. User Roles & Permissions

| Action | Citizen | University | Industry | Admin |
|---|---|---|---|---|
| Submit challenge | ✅ | ❌ | ❌ | ✅ |
| View own submissions | ✅ | ❌ | ❌ | ✅ |
| View all challenges | ❌ | ✅ | ✅ | ✅ |
| Assign challenge to university | ❌ | ❌ | ❌ | ✅ |
| Create project | ❌ | ✅ | ❌ | ✅ |
| Add milestones | ❌ | ✅ | ❌ | ✅ |
| Offer partnership/funding | ❌ | ❌ | ✅ | ✅ |
| View analytics | ❌ | ❌ | ❌ | ✅ |
| Receive notifications | ✅ | ✅ | ✅ | ✅ |

---

## 5. Modules & Requirements

---

### Module 1 — Citizen Challenge Submission

**Goal**: Citizens can report a societal challenge with enough detail for AI and admins to act on it.

#### Functional Requirements
- FR1.1: Citizen must be authenticated (Clerk) to submit
- FR1.2: Submission form collects: title, description, domain (dropdown), location (text/GPS), optional media (image/video)
- FR1.3: Media is uploaded to Supabase Storage; URL stored in `challenge_media`
- FR1.4: On submission, ML service is called automatically (`/categorize`, `/deduplicate`)
- FR1.5: If duplicate detected, challenge is flagged `is_duplicate = true` and linked to original
- FR1.6: AI category is written back to `challenges.ai_category`
- FR1.7: Citizen receives in-app notification confirming submission

#### Non-Functional Requirements
- Max file size: 10MB per media file
- Supported formats: JPEG, PNG, MP4
- Response time: < 3s for submission (ML call is async if needed)

#### API Endpoints
```
POST   /api/challenges              — Submit challenge (citizen)
GET    /api/challenges/mine         — Get own submissions (citizen)
GET    /api/challenges/:id          — Get single challenge
```

#### Status Flow
```
submitted → under_review → assigned → in_progress → resolved
```

---

### Module 2 — AI Problem Management

**Goal**: Automatically process every challenge submission through ML to reduce admin triage load.

#### Functional Requirements
- FR2.1: On every new challenge, backend calls `POST ML_SERVICE_URL/categorize` with `{ title, description }`
- FR2.2: ML returns `{ category: string, confidence: float }` — written to `challenges.ai_category`
- FR2.3: Backend calls `POST ML_SERVICE_URL/deduplicate` with `{ title, description, challenge_id }`
- FR2.4: ML returns `{ is_duplicate: bool, similar_challenge_id: uuid | null }`
- FR2.5: If duplicate, set `challenges.is_duplicate = true`; admin is notified
- FR2.6: Admin can override AI category manually

#### ML Payload Contracts (keep minimal for ML guy)
```js
// Categorize request
{ title: string, description: string }

// Categorize response
{ category: string, confidence: number }

// Deduplicate request  
{ challenge_id: string, title: string, description: string }

// Deduplicate response
{ is_duplicate: boolean, similar_challenge_id: string | null }
```

#### API Endpoints
```
PATCH  /api/challenges/:id/category    — Admin override AI category
GET    /api/challenges                 — List all with filters (admin)
```

---

### Module 3 — University Collaboration

**Goal**: Admins assign validated challenges to universities. Universities create structured solution projects.

#### Functional Requirements
- FR3.1: Admin can assign a challenge to a university (sets `challenges.assigned_to_university_id`, status → `assigned`)
- FR3.2: University creates a project linked to the challenge
- FR3.3: Project includes: faculty mentor name, team members array, status
- FR3.4: University is notified when a challenge is assigned to them
- FR3.5: University can view only challenges assigned to them

#### API Endpoints
```
PATCH  /api/challenges/:id/assign      — Assign to university (admin)
POST   /api/projects                   — Create project (university)
GET    /api/projects                   — List own projects (university)
GET    /api/projects/:id               — Get project details
```

---

### Module 4 — Industry Partnership

**Goal**: Industry users can browse challenges and offer CSR funding or mentoring.

#### Functional Requirements
- FR4.1: Industry can view all non-duplicate challenges with status `assigned` or `in_progress`
- FR4.2: Industry submits a partnership offer: type (funding/mentoring/csr), amount (if funding), message
- FR4.3: Partnership is stored with status `proposed`
- FR4.4: Admin approves/rejects the partnership (status → `approved` or `rejected`)
- FR4.5: University is notified when funding is approved for their project's challenge

#### API Endpoints
```
GET    /api/challenges/open            — Browse open challenges (industry)
POST   /api/partnerships               — Submit partnership offer (industry)
GET    /api/partnerships/mine          — View own offers (industry)
PATCH  /api/partnerships/:id/status   — Approve/reject (admin)
```

---

### Module 5 — Project Lifecycle Management

**Goal**: Universities track progress via milestones. Admins can monitor all projects.

#### Functional Requirements
- FR5.1: University can add milestones to their project (title, due_date)
- FR5.2: University can mark a milestone as completed
- FR5.3: Admin can view all projects and their milestone status
- FR5.4: When all milestones complete, project status can be set to `completed`

#### API Endpoints
```
POST   /api/milestones                 — Add milestone (university)
PATCH  /api/milestones/:id/complete    — Mark complete (university)
GET    /api/projects/:id/milestones    — List milestones for project
```

---

### Module 6 — Analytics Dashboard

**Goal**: Admin sees a real-time bird's-eye view of platform activity.

#### Functional Requirements
- FR6.1: Dashboard shows total challenge counts by status
- FR6.2: Domain/category breakdown (pie or bar data)
- FR6.3: Total projects created, active, completed
- FR6.4: Total funding committed across all partnerships
- FR6.5: Recent activity feed (last 10 challenges submitted)

#### API Endpoints
```
GET    /api/analytics/overview         — Summary stats (admin)
GET    /api/analytics/domains          — Domain breakdown (admin)
GET    /api/analytics/recent           — Recent challenges (admin)
```

#### Response Shape
```js
// GET /api/analytics/overview
{
  success: true,
  data: {
    total_challenges: 142,
    by_status: { submitted: 40, assigned: 60, resolved: 42 },
    total_projects: 38,
    total_funding: 2500000,
    active_partnerships: 12
  }
}
```

---

### Module 7 — Notifications

**Goal**: All users are kept informed of relevant events via in-app notifications and email.

#### Functional Requirements
- FR7.1: Notification row created in DB for relevant events (see trigger table below)
- FR7.2: Resend email sent for the same events
- FR7.3: User can fetch their unread notifications
- FR7.4: User can mark notifications as read

#### Notification Triggers

| Event | Recipient | Message |
|---|---|---|
| Challenge submitted | Citizen | "Your challenge has been received and is under review." |
| Challenge assigned to university | University | "A new challenge has been assigned to your institution." |
| Challenge assigned (citizen view) | Citizen | "Your challenge is now being worked on by [University]." |
| Partnership approved | Industry | "Your partnership offer has been approved." |
| Funding approved | University | "Industry funding has been approved for your project." |
| Milestone completed | Admin | "[University] completed a milestone on [Challenge]." |

#### API Endpoints
```
GET    /api/notifications              — Get own notifications (any role)
PATCH  /api/notifications/:id/read    — Mark as read
PATCH  /api/notifications/read-all    — Mark all as read
```

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| API response time | < 500ms (excluding ML calls) |
| File upload size limit | 10MB |
| Auth | All routes except `/health` require Clerk JWT |
| Error handling | Global error middleware, consistent response shape |
| CORS | Enabled for frontend origin |
| Env config | All secrets via `.env`, never hardcoded |

---

## 7. API Response Contract (Global)

Every endpoint returns this exact shape:

```js
// Success
{ success: true,  data: <payload>, error: null }

// Error
{ success: false, data: null, error: "Human-readable message" }
```

HTTP status codes:
- `200` — OK
- `201` — Created
- `400` — Bad request / validation error
- `401` — Not authenticated
- `403` — Forbidden (wrong role)
- `404` — Not found
- `500` — Internal server error

---

## 8. Demo Flow Mapping

| Demo Step | Module(s) Involved | Must Work for Demo |
|---|---|---|
| 1. Citizen submits flood challenge + photo | M1 | ✅ Critical |
| 2. ML auto-categorizes → "Disaster Management" | M2 | ✅ Critical |
| 3. Admin assigns to university | M3 | ✅ Critical |
| 4. University creates project + milestones | M3, M5 | ✅ Critical |
| 5. Industry offers CSR funding | M4 | ✅ Critical |
| 6. Analytics dashboard shows live stats | M6 | ✅ Critical |
| 7. Citizen gets notification | M7 | ✅ Critical |

**All 7 demo steps are critical. Nothing is optional.**

---

## 9. Out of Scope (for this hackathon)

- Real-time websockets (polling is fine for demo)
- Mobile app
- Multi-language support
- Payment gateway integration
- Actual ML model training (rule-based categorization acceptable for demo)
- Row-level security in Supabase (service role key used throughout)
- CI/CD pipeline

---

## 10. Build Priority Order

Given the 5-day deadline:

```
Day 1: DB setup + project scaffold + auth middleware
Day 2: Module 1 (challenge submission + file upload) + Module 2 (ML integration)
Day 3: Module 3 (university projects) + Module 5 (milestones)
Day 4: Module 4 (partnerships) + Module 7 (notifications)
Day 5: Module 6 (analytics) + end-to-end demo dry run + bug fixes
```

---

## 11. Tech Stack Decision Log

| Decision | Choice | Why |
|---|---|---|
| Module system | ESM (`import/export`) | Modern Node.js standard, cleaner syntax |
| ORM vs raw client | Supabase JS client (no ORM) | Fast setup, works natively with Supabase RPC and filters |
| Auth | Clerk | Prebuilt roles, JWT, social login — saves days vs rolling own |
| File storage | Supabase Storage | Same vendor as DB, no extra config |
| Email | Resend | Simplest API, generous free tier |
| ML integration | HTTP calls to FastAPI | Decoupled, ML guy owns it independently |
| Frontend build | v0/Bolt | Frontend team is non-technical — this is the only viable option |
| Deployment | TBD (Railway / Render recommended) | Simple Node.js hosting, free tier available |

