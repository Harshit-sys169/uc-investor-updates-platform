import { NextResponse } from 'next/server';
import { sampleJobs, transitionJob, type JobStatus } from '@/lib/jobQueue';

type Params = { params: { jobId: string } };

export async function GET(_: Request, { params }: Params) {
  const job = sampleJobs.find((item) => item.id === params.jobId);

  if (!job) {
    return NextResponse.json({ ok: false, error: 'Job not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, job });
}

export async function PATCH(request: Request, { params }: Params) {
  const body = (await request.json().catch(() => null)) as { status?: JobStatus; error?: string } | null;
  const job = sampleJobs.find((item) => item.id === params.jobId);

  if (!job) {
    return NextResponse.json({ ok: false, error: 'Job not found.' }, { status: 404 });
  }

  if (!body?.status) {
    return NextResponse.json({ ok: false, error: 'Missing status.' }, { status: 400 });
  }

  const updated = transitionJob(job, body.status, body.error);
  return NextResponse.json({ ok: true, job: updated });
}
