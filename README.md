# UC Investor Updates Platform

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)](#)

> **Streamline founder-to-investor communication with an intelligent, all-in-one investor update platform.** Draft, review, send, track, and manage investor updates with AI-powered suggestions, team collaboration tools, and automated scheduling.

## 🚀 Features

### Core Capabilities
- **Smart Draft Generation** — Create structured investor updates from highlights, metrics, challenges, and goals
- **AI-Powered Content** — OpenAI-assisted rewriting, formatting suggestions, and tone optimization
- **Rich Email Builder** — Block-based visual composer with templates, branding controls, and live preview
- **Team Collaboration** — Role-based access (Owner, Admin, Member, Viewer), invite workflows, and audit trails
- **Multi-Investor Management** — Centralized investor database with contact management and investor segmentation
- **Email Tracking** — Open/click tracking, delivery monitoring, and engagement analytics
- **Inbox Management** — Capture and organize investor replies with reply tracking and handled status
- **Automated Scheduling** — Set recurring update schedules (daily, weekly, monthly) with timezone support
- **Security & Compliance** — Unsubscribe management, authentication via Clerk, domain verification for production

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 13+, React, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Authentication** | Clerk |
| **Email Delivery** | Resend |
| **AI Services** | OpenAI |
| **Scheduling** | Luxon, Cron jobs |

## 📖 Documentation

- [Getting Started](docs/GETTING_STARTED.md) — Setup instructions and first steps
- [Architecture](docs/ARCHITECTURE.md) — System design and data model
- [API Reference](docs/API_REFERENCE.md) — Complete endpoint documentation
- [Database Schema](docs/DATABASE_SCHEMA.md) — Entity relationships
- [Email Builder Guide](docs/EMAIL_BUILDER.md) — Block-based composer usage
- [Roadmap](docs/ROADMAP.md) — Planned features
- [Contributing](CONTRIBUTING.md) — Guidelines for contributions

## 🏃 Quick Start

### Prerequisites
- Node.js 18+, npm/yarn, PostgreSQL 12+

### Installation

```bash
git clone https://github.com/Harshit-sys169/uc-investor-updates-platform.git
cd uc-investor-updates-platform
npm install
cp .env.example .env.local
# Configure your .env.local
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000

## 📋 Core Workflow

1. Create company profile and add investors
2. Draft update with highlights, metrics, challenges, goals
3. Use AI for content suggestions
4. Review and approve
5. Send test email to yourself
6. Broadcast to all investors
7. Track opens, clicks, and replies
8. Manage responses in inbox
9. Schedule recurring updates

## 🔐 Security

- Enterprise authentication via Clerk
- Role-based access control (RBAC)
- Company-scoped data isolation
- Complete audit logging
- DKIM/SPF/DMARC via Resend
- Rate limiting on sensitive endpoints

## 📈 Roadmap

- Advanced investor analytics
- PDF export
- Slack/Discord notifications
- Two-factor authentication (2FA)
- Multi-language support
- Custom domains
- API webhooks

See [ROADMAP.md](docs/ROADMAP.md) for details.

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License — see [LICENSE](LICENSE)

## 💬 Support

- [Issues](https://github.com/Harshit-sys169/uc-investor-updates-platform/issues)
- [Discussions](https://github.com/Harshit-sys169/uc-investor-updates-platform/discussions)

---

**Built with ❤️ by [Harshit Saini](https://github.com/Harshit-sys169)**
