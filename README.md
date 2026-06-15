# UC Investor Updates Platform

A portfolio-ready founder communication platform for drafting, sending, tracking, and optimizing investor updates.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## What this is

A SaaS-style investor relations platform for founders who need to:
- keep an organized investor database
- draft updates faster
- send updates with tracking
- review engagement
- run follow-ups
- manage team access
- observe production health

## Why this repository is interesting

This repo is structured like a real product instead of a toy demo:
- multi-tenant application shell
- investor CRM and update composer
- AI-assisted drafting layer
- analytics and recommendation surfaces
- enterprise controls and auditability
- job pipeline and observability
- tests, deployment, and documentation
- showcase page for recruiters and reviewers

## Core capabilities

- **Investor CRM** — import, dedupe, tag, search, and inspect investor records
- **Update composer** — block-based drafting with live preview
- **AI tools** — subject lines, tone rewrites, scoring, and follow-ups
- **Analytics** — engagement, clicks, replies, and trends
- **Investor intelligence** — ranking, similarity matching, and fit scoring
- **Enterprise layer** — roles, audit logs, billing, and admin controls
- **Observability** — metrics, traces, alerts, and incidents
- **Delivery pipeline** — queue, cron, webhooks, and retry scaffolding
- **Showcase layer** — a route and docs that help a reviewer understand the project quickly

## Recommended review order

1. `/`
2. `/showcase`
3. `/dashboard`
4. `/investors`
5. `/updates`
6. `/ai`
7. `/analytics`
8. `/intelligence`
9. `/enterprise`
10. `/observability`

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js, React, TypeScript, Tailwind-style CSS |
| Backend | Next.js route handlers |
| Database | PostgreSQL + Prisma |
| Auth | Clerk-style session layer |
| AI | OpenAI |
| Email | Resend |
| Ops | Queue, cron, logging, health, Docker |

## Quick start

```bash
git clone https://github.com/Harshit-sys169/uc-investor-updates-platform.git
cd uc-investor-updates-platform
npm install
cp .env.example .env.local
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`

## Demo flow

1. Open the landing page.
2. Open the showcase page.
3. Inspect the dashboard and workspace shell.
4. Review investor CRM features.
5. Open the update composer and AI assistant.
6. Open analytics and intelligence.
7. Review enterprise and observability surfaces.
8. Read the docs and architecture notes.

## Docs

- [Showcase Guide](docs/SHOWCASE.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Project Highlights](docs/PROJECT_HIGHLIGHTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Testing](docs/TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Observability](docs/OBSERVABILITY.md)

## Milestones

- Foundation and routing
- Authentication and tenant isolation
- Investor CRM and import
- Update composer and email builder
- Analytics and tracking
- Jobs and delivery pipeline
- Production hardening
- Tests and CI
- AI layer
- Integrations
- Investor intelligence
- Enterprise controls
- Observability
- Showcase layer

## Portfolio message

This repository is strongest when presented as:
- a SaaS product
- a systems design exercise
- a product management artifact
- a full-stack engineering portfolio piece

## License

MIT
