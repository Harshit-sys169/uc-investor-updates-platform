import { describe, expect, it } from 'vitest';
import {
  enqueueJob,
  jobStatusLabel,
  jobTypeLabel,
  jobsByStatus,
  jobsDueSoon,
  sampleJobs,
  summarizeJobs,
  transitionJob,
} from '../lib/jobQueue';

describe('job queue helpers', () => {
  it('returns readable labels', () => {
    expect(jobTypeLabel('send_update')).toBe('Send update');
    expect(jobStatusLabel('failed')).toBe('Failed');
  });

  it('summarizes queue status', () => {
    const summary = summarizeJobs(sampleJobs);
    expect(summary.queued).toBeGreaterThan(0);
    expect(summary.failed).toBeGreaterThan(0);
    expect(summary.nextRunLabel).toBeTruthy();
  });

  it('groups jobs by status', () => {
    const grouped = jobsByStatus(sampleJobs);
    expect(grouped.find((item) => item.status === 'failed')?.count).toBe(1);
  });

  it('sorts due jobs', () => {
    const dueSoon = jobsDueSoon(sampleJobs, 3);
    expect(dueSoon).toHaveLength(3);
    expect(dueSoon[0].scheduledFor <= dueSoon[1].scheduledFor).toBe(true);
  });

  it('enqueues and transitions jobs', () => {
    const queued = enqueueJob(sampleJobs, {
      companyId: 'acme-foods',
      companyName: 'Acme Foods',
      type: 'daily_digest',
      status: 'queued',
      priority: 'normal',
      scheduledFor: new Date().toISOString(),
      maxAttempts: 3,
      target: 'Demo inbox',
      notes: 'Queued by test',
    });

    expect(queued.length).toBe(sampleJobs.length + 1);

    const failed = transitionJob(queued.at(-1)!, 'failed', 'Timeout');
    expect(failed.status).toBe('failed');
    expect(failed.lastError).toBe('Timeout');
    expect(failed.attempts).toBe(1);
  });
});
