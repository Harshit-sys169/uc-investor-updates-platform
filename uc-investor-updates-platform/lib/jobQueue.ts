export type JobType =
  | 'send_update'
  | 'send_test_email'
  | 'sync_inbox'
  | 'retry_failed_delivery'
  | 'generate_ai_summary'
  | 'daily_digest';

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'scheduled';

export type JobRecord = {
  id: string;
  companyId: string;
  companyName: string;
  type: JobType;
  status: JobStatus;
  priority: 'low' | 'normal' | 'high';
  scheduledFor: string;
  attempts: number;
  maxAttempts: number;
  target: string;
  notes: string;
  lastRunAt?: string;
  lastError?: string;
};

export type JobSummary = {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  scheduled: number;
  nextRunLabel: string;
};

const base = new Date('2026-05-21T03:30:00.000Z');

export const sampleJobs: JobRecord[] = [
  {
    id: 'job_001',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    type: 'send_update',
    status: 'queued',
    priority: 'high',
    scheduledFor: new Date(base.getTime() + 1000 * 60 * 18).toISOString(),
    attempts: 0,
    maxAttempts: 3,
    target: 'All active investors',
    notes: 'Send the May founder update after final review.',
  },
  {
    id: 'job_002',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    type: 'send_test_email',
    status: 'running',
    priority: 'normal',
    scheduledFor: new Date(base.getTime() + 1000 * 60 * 4).toISOString(),
    attempts: 1,
    maxAttempts: 2,
    target: 'founders@acmefoods.example',
    notes: 'Deliver a proof copy to the internal inbox.',
    lastRunAt: new Date(base.getTime() + 1000 * 60 * 3).toISOString(),
  },
  {
    id: 'job_003',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    type: 'sync_inbox',
    status: 'scheduled',
    priority: 'low',
    scheduledFor: new Date(base.getTime() + 1000 * 60 * 60 * 2).toISOString(),
    attempts: 0,
    maxAttempts: 5,
    target: 'Investor reply inbox',
    notes: 'Pull replies and link them to the latest update.',
  },
  {
    id: 'job_004',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    type: 'generate_ai_summary',
    status: 'completed',
    priority: 'normal',
    scheduledFor: new Date(base.getTime() - 1000 * 60 * 45).toISOString(),
    attempts: 1,
    maxAttempts: 1,
    target: 'May founder update',
    notes: 'Generated a concise exec summary for distribution.',
    lastRunAt: new Date(base.getTime() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'job_005',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    type: 'daily_digest',
    status: 'failed',
    priority: 'normal',
    scheduledFor: new Date(base.getTime() - 1000 * 60 * 9).toISOString(),
    attempts: 3,
    maxAttempts: 3,
    target: 'Operations digest',
    notes: 'Digest email failed after delivery provider timeout.',
    lastRunAt: new Date(base.getTime() - 1000 * 60 * 8).toISOString(),
    lastError: 'Upstream email provider timeout',
  },
  {
    id: 'job_006',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    type: 'retry_failed_delivery',
    status: 'scheduled',
    priority: 'high',
    scheduledFor: new Date(base.getTime() + 1000 * 60 * 35).toISOString(),
    attempts: 0,
    maxAttempts: 4,
    target: 'Failed deliveries queue',
    notes: 'Retry failed deliveries with backoff.',
  },
];

export function jobTypeLabel(type: JobType) {
  switch (type) {
    case 'send_update':
      return 'Send update';
    case 'send_test_email':
      return 'Send test email';
    case 'sync_inbox':
      return 'Sync inbox';
    case 'retry_failed_delivery':
      return 'Retry deliveries';
    case 'generate_ai_summary':
      return 'Generate AI summary';
    case 'daily_digest':
      return 'Daily digest';
  }
}

export function jobStatusLabel(status: JobStatus) {
  switch (status) {
    case 'queued':
      return 'Queued';
    case 'running':
      return 'Running';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'scheduled':
      return 'Scheduled';
  }
}

export function summarizeJobs(jobs: JobRecord[]): JobSummary {
  const queued = jobs.filter((job) => job.status === 'queued').length;
  const running = jobs.filter((job) => job.status === 'running').length;
  const completed = jobs.filter((job) => job.status === 'completed').length;
  const failed = jobs.filter((job) => job.status === 'failed').length;
  const scheduled = jobs.filter((job) => job.status === 'scheduled').length;

  const nextRunLabel =
    jobs
      .filter((job) => job.status === 'queued' || job.status === 'scheduled' || job.status === 'running')
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0]?.scheduledFor ?? 'No jobs scheduled';

  return {
    queued,
    running,
    completed,
    failed,
    scheduled,
    nextRunLabel: nextRunLabel === 'No jobs scheduled' ? nextRunLabel : formatDateTime(nextRunLabel),
  };
}

export function jobsByStatus(jobs: JobRecord[]) {
  const order: JobStatus[] = ['queued', 'running', 'scheduled', 'completed', 'failed'];
  return order.map((status) => ({
    status,
    label: jobStatusLabel(status),
    count: jobs.filter((job) => job.status === status).length,
  }));
}

export function jobsDueSoon(jobs: JobRecord[], limit = 5) {
  return [...jobs]
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
    .slice(0, limit);
}

export function enqueueJob(jobs: JobRecord[], job: Omit<JobRecord, 'id' | 'attempts' | 'lastRunAt'> & { attempts?: number; id?: string; lastRunAt?: string }) {
  return [
    ...jobs,
    {
      ...job,
      id: job.id ?? `job_${Math.random().toString(36).slice(2, 9)}`,
      attempts: job.attempts ?? 0,
    },
  ];
}

export function transitionJob(job: JobRecord, status: JobStatus, error?: string): JobRecord {
  return {
    ...job,
    status,
    lastRunAt: new Date().toISOString(),
    lastError: error,
    attempts: status === 'failed' ? Math.min(job.attempts + 1, job.maxAttempts) : job.attempts,
  };
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
}

export function queueMetrics(jobs: JobRecord[]) {
  return {
    total: jobs.length,
    ready: jobs.filter((job) => job.status === 'queued' || job.status === 'scheduled').length,
    active: jobs.filter((job) => job.status === 'running').length,
    blocked: jobs.filter((job) => job.status === 'failed').length,
  };
}
