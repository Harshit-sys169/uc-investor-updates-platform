# UC Investor Updates Platform - Development Guide

## Quick Reference

### Install & Run

```bash
npm install
cp .env.example .env.local
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Common Commands

```bash
npm run type-check       # Type checking
npm run build            # Build for production
npm run lint             # Run linter
npx prisma studio       # View database GUI
```

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API route handlers
│   ├── dashboard/       # Dashboard page
│   ├── investors/       # Investor pages
│   ├── updates/         # Update management
│   ├── review/          # Review and send
│   ├── inbox/           # Reply inbox
│   ├── schedule/        # Scheduling
│   ├── team/            # Team management
│   └── email/           # Email builder
├── components/          # Reusable components
├── lib/                 # Utilities and helpers
└── middleware.ts        # Auth middleware
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk
- **Email**: Resend
- **AI**: OpenAI

## Development Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally: `npm run dev`
4. Type check: `npm run type-check`
5. Commit: `git commit -m "feat: description"`
6. Push and create PR

## Troubleshooting

```bash
# Dependencies issue
rm -rf node_modules && npm install

# Prisma type errors
npx prisma generate

# Database connection
Check DATABASE_URL in .env.local
```

---

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.
