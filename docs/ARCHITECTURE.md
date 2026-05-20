# Architecture

## System Overview

The UC Investor Updates Platform is built as a Next.js App Router application with five distinct layers:

1. **Presentation Layer** — UI pages and components
2. **API Layer** — Route handlers for CRUD and business logic
3. **Domain Layer** — Business rules and workflows
4. **Integration Layer** — External services (Clerk, Resend, OpenAI)
5. **Persistence Layer** — PostgreSQL database via Prisma

## Request Flows

### Draft Update Flow

```
User Input (highlights, metrics, challenges, goals)
  ↓
POST /api/drafts
  ↓
Validate authentication (Clerk)
  ↓
Generate email content (OpenAI)
  ↓
Create draft record in database
  ↓
Return draft to UI
```

### Send Update Flow

```
User clicks "Send Update"
  ↓
POST /api/send-ready
  ↓
Validate user owns company
  ↓
Check update status = "ready"
  ↓
Fetch all active investors
  ↓
For each investor: Send via Resend
  ↓
Create EmailEvent records
  ↓
Update status to "sent"
  ↓
Return success response
```

### Reply Tracking Flow

```
Investor replies to email
  ↓
Resend webhook triggers
  ↓
POST /api/webhooks/inbound-email
  ↓
Store InboundMessage in database
  ↓
Create EmailEvent record
  ↓
Display in inbox UI
```

### Scheduled Send Flow

```
External cron service calls /api/run-schedules
  ↓
Query UpdateSchedule records
  ↓
Check if schedule is due
  ↓
If due: Trigger send flow for that company
  ↓
Record execution in EmailEvent
  ↓
Return results
```

## Security Model

- **Authentication** — All routes verified via Clerk session
- **Authorization** — Company isolation via database queries
- **Public Routes** — Email opens, unsubscribe, webhooks only
- **Role-Based Access** — Owner, Admin, Member, Viewer
- **Audit Logging** — All user actions recorded

## Data Model

### Core Entities

- **Company** — Top-level tenant
- **Investor** — Recipient records
- **Update** — Draft and sent updates
- **UpdateSchedule** — Recurring schedules
- **EmailEvent** — Email activity stream
- **InboundMessage** — Captured replies
- **Membership** — Team access
- **CompanyInvite** — Invite lifecycle
- **AuditLog** — Change history

## Integrations

### Clerk
User authentication and session management.

### Resend
Email delivery, bounce handling, and webhook events.

### OpenAI
Content generation, rewriting, and formatting suggestions.

### PostgreSQL + Prisma
Relational data persistence and ORM.

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL 12+, Prisma ORM
- **Auth**: Clerk
- **Email**: Resend
- **AI**: OpenAI
- **Scheduling**: Luxon, Cron jobs

## Deployment Architecture

```
Client Browser
  ↓
Vercel (Next.js App)
  ↓
Clerk Auth
Resend Email Service
OpenAI API
  ↓
PostgreSQL Database
  ↓
S3 or CDN (Static Assets)
```

