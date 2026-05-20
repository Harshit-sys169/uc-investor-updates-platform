# Database Schema

## Tables

### Company
Top-level tenant.

- `id` (UUID, PK)
- `name` (String)
- `slug` (String, unique)
- `clerkUserId` (String)
- `createdAt`, `updatedAt`

### Investor
Recipient record.

- `id` (UUID, PK)
- `companyId` (FK to Company)
- `name` (String)
- `email` (String)
- `type` (enum: angel, institutional, family_office)
- `unsubscribed` (Boolean, default: false)
- `unsubscribeToken` (String, unique)
- `replyToken` (String, unique)
- `repliedAt` (DateTime, nullable)
- `replyNotes` (Text)
- `createdAt`, `updatedAt`

Unique constraint: (companyId, email)

### Update
Investor update record.

- `id` (UUID, PK)
- `companyId` (FK)
- `title` (String)
- `content` (Text)
- `periodStart` (DateTime)
- `periodEnd` (DateTime)
- `sentAt` (DateTime, nullable)
- `status` (enum: draft, ready, sent)
- `createdAt`, `updatedAt`

### UpdateSchedule
Recurring schedule.

- `id` (UUID, PK)
- `companyId` (FK)
- `dayOfMonth` (Int, 1-31)
- `dayOfWeek` (Int, 0-6, nullable)
- `hour` (Int, 0-23)
- `minute` (Int, 0-59)
- `timezone` (String)
- `isActive` (Boolean)
- `lastRunAt` (DateTime, nullable)
- `nextRunAt` (DateTime, nullable)
- `createdAt`, `updatedAt`

### EmailEvent
Email activity stream.

- `id` (UUID, PK)
- `companyId` (FK)
- `investorId` (FK, nullable)
- `updateId` (FK, nullable)
- `type` (enum: sent, open, click, reply, handled, bounced, failed)
- `meta` (JSON)
- `createdAt`

### InboundMessage
Captured reply.

- `id` (UUID, PK)
- `companyId` (FK)
- `investorId` (FK, nullable)
- `fromEmail` (String)
- `subject` (String)
- `body` (Text)
- `htmlBody` (Text, nullable)
- `receivedAt` (DateTime)
- `providerMsgId` (String)
- `threadId` (String)
- `handled` (Boolean, default: false)
- `createdAt`

### Membership
Team access.

- `id` (UUID, PK)
- `userId` (String, Clerk ID)
- `companyId` (FK)
- `role` (enum: owner, admin, member, viewer)
- `createdAt`, `updatedAt`

Unique constraint: (userId, companyId)

### CompanyInvite
Invite lifecycle.

- `id` (UUID, PK)
- `email` (String)
- `role` (enum: admin, member, viewer)
- `token` (String, unique)
- `companyId` (FK)
- `invitedById` (String)
- `acceptedAt` (DateTime, nullable)
- `expiresAt` (DateTime)
- `createdAt`

### AuditLog
Change history.

- `id` (UUID, PK)
- `companyId` (FK)
- `actorId` (String, Clerk ID)
- `action` (String)
- `entityType` (String)
- `entityId` (String)
- `meta` (JSON)
- `createdAt`

## Indexes

```sql
CREATE INDEX idx_investor_company_email ON Investor(companyId, email);
CREATE INDEX idx_update_company_status ON Update(companyId, status);
CREATE INDEX idx_email_event_investor ON EmailEvent(investorId);
CREATE INDEX idx_inbound_message_company_handled ON InboundMessage(companyId, handled);
CREATE INDEX idx_membership_user ON Membership(userId);
```

