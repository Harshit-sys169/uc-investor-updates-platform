import { NextResponse } from 'next/server';
import { enqueueJob, sampleJobs, type JobType } from '@/lib/jobQueue';

type JobBody = {
  companyId?: string;
  companyName?: string;
  type?: JobType;
  scheduledFor?: string;
  target?: string;
  priority?: 'low' | 'normal' | 'high';
  notes?: string;
};

export async function GET() {
  return NextResponse.json({ ok: true, jobs: sampleJobs });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as JobBody | null;

  if (!body?.companyId || !body?.companyName || !body?.type || !body?.scheduledFor || !body?.target) {
    return NextResponse.json({ ok: false, error: 'Missing required job fields.' }, { status: 400 });
  }

  const jobs = enqueueJob(sampleJobs, {
    companyId: body.companyId,
    companyName: body.companyName,
    type: body.type,
    status: 'queued',
    priority: body.priority ?? 'normal',
    scheduledFor: body.scheduledFor,
    target: body.target,
    notes: body.notes ?? 'Queued via API',
    maxAttempts: 3,
  });

  return NextResponse.json({ ok: true, jobs, created: jobs[jobs.length - 1] });
}
