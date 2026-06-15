# Architecture

## System overview

The application is organized as a layered Next.js SaaS product:

1. Presentation layer — pages and shared components
2. Domain layer — investor, update, AI, and operations logic
3. API layer — route handlers and server actions
4. Integration layer — auth, email, AI, and webhooks
5. Persistence layer — PostgreSQL via Prisma

## Main product surfaces

- Dashboard
- Investor CRM
- Update composer
- AI assistant
- Analytics
- Intelligence
- Enterprise controls
- Observability
- Showcase

## Diagram

See [`docs/ARCHITECTURE_DIAGRAM.md`](./ARCHITECTURE_DIAGRAM.md) for a compact diagram.

## Deployment view

The app is designed to run on a typical SaaS stack:
- browser
- Next.js app
- auth provider
- email provider
- AI provider
- PostgreSQL database
- job worker / cron surface

## Reviewer value

The architecture demonstrates:
- multi-tenant app structure
- reusable UI shell
- workflow-driven product design
- operational maturity
- documentation-first delivery
