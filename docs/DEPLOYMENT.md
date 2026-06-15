# Deployment

## Minimum production checklist

- Set `DATABASE_URL`
- Set `NEXT_PUBLIC_APP_URL`
- Set `OPENAI_API_KEY` only when AI routes are enabled
- Set `RESEND_API_KEY` only when email delivery is enabled
- Set `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` only when production auth is enabled
- Set `CRON_SECRET` before enabling scheduled delivery endpoints
- Confirm `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS`

## Local production-like run

```bash
npm install
npm run build
npm run start
```

## Docker

```bash
docker build -t uc-investor-updates-platform .
docker run --rm -p 3000:3000 --env-file .env.production uc-investor-updates-platform
```

## Health checks

- `GET /api/health`
- `GET /api/ready`

`/api/ready` returns `503` when critical environment values are missing.
