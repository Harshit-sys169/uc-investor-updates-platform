# UC Investor Updates Platform

Founder communication platform. Draft, send, track investor updates with AI assistance.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/) [![MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## Features

- **AI-powered drafting** with OpenAI content suggestions
- **Email tracking** — opens, clicks, delivery, reply capture
- **Team collaboration** — role-based access, invite workflows, audit logs
- **Scheduling** — recurring updates, timezone support
- **Investor database** — segmentation, contact management
- **Block-based email builder** — templates, branding, preview
- **Security** — Clerk auth, RBAC, unsubscribe management

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, TypeScript, Tailwind |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | Clerk |
| Email | Resend |
| AI | OpenAI |

## Quick Start

```bash
git clone https://github.com/Harshit-sys169/uc-investor-updates-platform.git
cd uc-investor-updates-platform
npm install
cp .env.example .env.local
# Configure .env.local
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000

## Workflow

1. Add company & investors
2. Draft with highlights/metrics/challenges
3. AI content suggestions
4. Review → send
5. Track opens/clicks/replies

## Docs

- [Getting Started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Email Builder](docs/EMAIL_BUILDER.md)
- [Contributing](CONTRIBUTING.md)

## Roadmap

- Advanced analytics
- PDF export
- Slack/Discord notifications
- 2FA, multi-language, custom domains

See [ROADMAP.md](docs/ROADMAP.md)

---

Built by [Harshit Saini](https://github.com/Harshit-sys169) | MIT License
