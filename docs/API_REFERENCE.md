# API Reference

## Authentication

All routes require Clerk authentication. Include valid session cookies.

## Companies

### `GET /api/companies`
Get current user's company.

```json
{
  "id": "company_123",
  "name": "Ultimate Chicken",
  "slug": "ultimate-chicken"
}
```

## Investors

### `GET /api/investors`
List investors for company.

Query: `limit`, `offset`

### `POST /api/investors`
Create investor.

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "type": "institutional"
}
```

### `DELETE /api/investors/[id]`
Remove investor.

## Updates

### `POST /api/drafts`
Generate and save draft.

```json
{
  "companySlug": "ultimate-chicken",
  "title": "Q1 Update",
  "highlights": "Strong growth",
  "metrics": "ARR: $2.5M",
  "challenges": "Supply chain",
  "goals": "Double customers"
}
```

### `GET /api/updates`
List updates. Query: `status`, `limit`

### `POST /api/updates/[id]/ready`
Mark as ready to send.

### `POST /api/preview-send`
Send test email.

```json
{
  "updateId": "update_123",
  "recipientEmail": "founder@example.com"
}
```

### `POST /api/send-ready`
Broadcast to all investors.

```json
{
  "updateId": "update_123"
}
```

## Scheduling

### `POST /api/schedule`
Create/update recurring schedule.

```json
{
  "dayOfMonth": 15,
  "hour": 9,
  "minute": 0,
  "timezone": "America/New_York",
  "isActive": true
}
```

### `GET /api/schedule`
Get active schedule.

### `POST /api/run-schedules`
Execute due schedules (cron-only). Header: `Authorization: Bearer {CRON_SECRET}`

## Inbox

### `GET /api/inbox`
List replies. Query: `handled`

### `POST /api/inbox/[id]/handled`
Mark reply as handled.

## Tracking

### `GET /api/open/[token]`
Track email opens (pixel endpoint).

### `GET /api/unsubscribe?token=...`
Unsubscribe investor.

## Team

### `GET /api/team`
Get members, invites, audit logs.

### `POST /api/team/invite`
Invite team member.

```json
{
  "email": "bob@example.com",
  "role": "admin"
}
```

### `POST /api/team/accept-invite`
Accept invite.

```json
{
  "token": "inv_..."
}
```

## AI

### `POST /api/ai/rewrite`
Rewrite text.

```json
{
  "text": "We launched",
  "tone": "professional"
}
```

### `POST /api/email/render`
Render email blocks.

```json
{
  "blocks": [...]
}
```

## Error Responses

- `401 Unauthorized` — No session
- `403 Forbidden` — No permission
- `404 Not Found` — Resource missing
- `400 Bad Request` — Invalid input
- `429 Too Many Requests` — Rate limited
- `500 Internal Server Error` — Server error

