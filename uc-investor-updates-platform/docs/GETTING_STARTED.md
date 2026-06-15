# Getting Started

This guide will help you set up the UC Investor Updates Platform locally and deploy it to production.

## Prerequisites

- Node.js 18.17+
- npm 9+ or yarn
- PostgreSQL 12+
- Git

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Harshit-sys169/uc-investor-updates-platform.git
cd uc-investor-updates-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

Configure the following sections:

## Environment Configuration

### Database Setup

**Option A: Local PostgreSQL**

```bash
creatdb uc_investor_updates
```

Add to `.env.local`:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/uc_investor_updates"
```

**Option B: Docker Compose**

Create `docker-compose.yml`:

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: investor_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: uc_investor_updates
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

### Clerk Authentication

1. Sign up at [clerk.com](https://clerk.com)
2. Create application
3. Copy API keys
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Resend Email Service

1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Verify domain (or use sandbox for testing)
4. Add to `.env.local`:

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### OpenAI Integration

1. Create account at [openai.com/api](https://openai.com/api/)
2. Generate API key
3. Add to `.env.local`:

```bash
OPENAI_API_KEY=sk_...
```

### Application Settings

```bash
APP_URL=http://localhost:3000
CRON_SECRET=your_secure_random_token_here
```

Generate secure token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Setup

### Initialize Prisma

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev --name init
```

### View Database

```bash
npx prisma studio
```

Open http://localhost:5555

## Running the Application

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Production Build

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run type-check
```

## Common Tasks

### Reset Database

```bash
npx prisma migrate reset
```

⚠️ **Warning**: This deletes all data.

### Create Database Migration

After updating `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name describe_changes
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

### Environment Variables for Production

Ensure all `.env.local` variables are set in your deployment platform:

- `DATABASE_URL` — Production database
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk production key
- `CLERK_SECRET_KEY` — Clerk production secret
- `RESEND_API_KEY` — Resend production key
- `RESEND_FROM_EMAIL` — Verified production domain
- `OPENAI_API_KEY` — OpenAI API key
- `APP_URL` — Your production domain
- `CRON_SECRET` — Secure token for scheduled tasks

## Troubleshooting

### "Cannot find module 'next'"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error

Verify `DATABASE_URL` and that PostgreSQL is running.

### Clerk Keys Not Working

Ensure:
- Keys are correct format (pk_ for public, sk_ for secret)
- localhost:3000 is allowed in Clerk dashboard
- Environment variables are reloaded

### Email Not Sending

- Check `RESEND_API_KEY`
- Verify `RESEND_FROM_EMAIL` domain is verified
- Check Resend dashboard for errors

## Next Steps

- Read [Architecture](./ARCHITECTURE.md) for system design
- Check [API Reference](./API_REFERENCE.md) for endpoints
- Review [Database Schema](./DATABASE_SCHEMA.md) for data model

