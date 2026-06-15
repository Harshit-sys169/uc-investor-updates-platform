import { sampleJobs, type JobRecord, type JobType, formatDateTime, jobTypeLabel, transitionJob } from '@/lib/jobQueue';
import { makeTrackingEvent, type TrackingEvent, type TrackingEventType } from '@/lib/analytics';

export type DeliveryTask = {
  id: string;
  companyId: string;
  companyName: string;
  jobId: string;
  title: string;
  status: 'queued' | 'sending' | 'delivered' | 'failed';
  scheduledFor: string;
  channel: 'email' | 'webhook';
  recipient: string;
  retryCount: number;
  lastError?: string;
};

const base = new Date('2026-05-21T03:30:00.000Z');

export const sampleDeliveryTasks: DeliveryTask[] = [
  {
    id: 'del_001',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    jobId: 'job_001',
    title: 'May founder update to all investors',
    status: 'queued',
    scheduledFor: new Date(base.getTime() + 1000 * 60 * 18).toISOString(),
    channel: 'email',
    recipient: 'All active investors',
    retryCount: 0,
  },
  {
    id: 'del_002',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    jobId: 'job_002',
    title: 'Internal test email',
    status: 'sending',
    scheduledFor: new Date(base.getTime() + 1000 * 60 * 4).toISOString(),
    channel: 'email',
    recipient: 'founders@acmefoods.example',
    retryCount: 0,
  },
  {
    id: 'del_003',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    jobId: 'job_005',
    title: 'Operations digest',
    status: 'failed',
    scheduledFor: new Date(base.getTime() - 1000 * 60 * 9).toISOString(),
    channel: 'email',
    recipient: 'ops@acmefoods.example',
    retryCount: 3,
    lastError: 'Upstream email provider timeout',
  },
];

export function buildWebhookTrackingEvent(task: DeliveryTask, type: TrackingEventType, label: string, url?: string): TrackingEvent {
  return makeTrackingEvent({
    companyId: task.companyId,
    companyName: task.companyName,
    updateId: task.jobId,
    updateTitle: task.title,
    type,
    channel: 'web',
    label,
    url,
    investorName: task.recipient,
  });
}

export function createDeliveryJob(job: JobRecord, nextStatus: DeliveryTask['status']): DeliveryTask {
  return {
    id: `del_${job.id}`,
    companyId: job.companyId,
    companyName: job.companyName,
    jobId: job.id,
    title: `${jobTypeLabel(job.type)}: ${job.target}`,
    status: nextStatus,
    scheduledFor: job.scheduledFor,
    channel: 'email',
    recipient: job.target,
    retryCount: job.attempts,
    lastError: job.lastError,
  };
}

export function runDeliveryPipeline(tasks: DeliveryTask[]) {
  const events = tasks.map((task) =>
    buildWebhookTrackingEvent(
      task,
      task.status === 'failed' ? 'bounce' : task.status === 'delivered' ? 'open' : 'scheduled',
      task.status === 'failed' ? 'Delivery failed' : task.status === 'delivered' ? 'Delivered to inbox' : 'Queued for delivery',
    ),
  );

  return {
    tasks,
    events,
    completedAt: new Date().toISOString(),
  };
}

export function jobPipelineSnapshot() {
  const scheduledJobs = sampleJobs.filter((job) => job.status === 'queued' || job.status === 'scheduled');
  const deliveryTasks = scheduledJobs.slice(0, 3).map((job) => createDeliveryJob(job, 'queued'));

  return {
    jobs: scheduledJobs,
    deliveryTasks,
    nextRunLabel: scheduledJobs[0] ? formatDateTime(scheduledJobs[0].scheduledFor) : 'No jobs scheduled',
  };
}

export function replayFailedJobs(jobs: JobRecord[]) {
  return jobs.map((job) => (job.status === 'failed' ? transitionJob(job, 'queued') : job));
}
