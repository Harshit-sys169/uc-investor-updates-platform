import { sampleJobs, transitionJob, type JobRecord } from '@/lib/jobQueue';
import { createDeliveryJob, runDeliveryPipeline } from '@/lib/delivery';

export type WorkerResult = {
  processed: number;
  successes: number;
  failures: number;
  jobs: JobRecord[];
};

export function runWorkerCycle() {
  const dueJobs = sampleJobs.filter((job) => job.status === 'queued' || job.status === 'scheduled').slice(0, 3);
  const processedJobs = dueJobs.map((job) => transitionJob(job, 'completed'));
  const deliveryTasks = processedJobs.map((job) => createDeliveryJob(job, 'delivered'));
  const pipeline = runDeliveryPipeline(deliveryTasks);

  const result: WorkerResult = {
    processed: processedJobs.length,
    successes: processedJobs.length,
    failures: 0,
    jobs: processedJobs,
  };

  return {
    result,
    pipeline,
  };
}
