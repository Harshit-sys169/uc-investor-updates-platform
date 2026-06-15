import { NextResponse } from 'next/server';
import { sampleJobs, transitionJob } from '@/lib/jobQueue';
import { createDeliveryJob, runDeliveryPipeline } from '@/lib/delivery';

export async function POST() {
  const dueJobs = sampleJobs.filter((job) => job.status === 'queued' || job.status === 'scheduled').slice(0, 3);
  const updatedJobs = dueJobs.map((job) => transitionJob(job, 'running'));
  const tasks = updatedJobs.map((job) => createDeliveryJob(job, 'queued'));
  const pipeline = runDeliveryPipeline(tasks);

  return NextResponse.json({
    ok: true,
    processed: updatedJobs.length,
    jobs: updatedJobs,
    delivery: pipeline,
  });
}
