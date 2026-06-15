import { jobsByStatus, queueMetrics, sampleJobs, summarizeJobs, jobTypeLabel, jobStatusLabel, formatDateTime } from '@/lib/jobQueue';
import { jobPipelineSnapshot } from '@/lib/delivery';

export function JobQueuePanel() {
  const summary = summarizeJobs(sampleJobs);
  const metrics = queueMetrics(sampleJobs);
  const statuses = jobsByStatus(sampleJobs);
  const pipeline = jobPipelineSnapshot();

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">Background jobs</p>
          <h2>Delivery pipeline</h2>
        </div>
        <p className="muted">Queue, cron, and webhook scaffolding for email delivery workflows.</p>
      </div>

      <div className="statsGrid" style={{ marginTop: 16 }}>
        <article className="card">
          <p className="cardLabel">Queued and scheduled</p>
          <h2>{metrics.ready}</h2>
          <p>Jobs waiting for the worker or a cron trigger.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Active workers</p>
          <h2>{metrics.active}</h2>
          <p>Jobs currently marked as running.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Blocked jobs</p>
          <h2>{metrics.blocked}</h2>
          <p>Jobs that need a retry or manual intervention.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Next run</p>
          <h2>{summary.nextRunLabel}</h2>
          <p>Earliest queued or scheduled job.</p>
        </article>
      </div>

      <div className="fieldGrid" style={{ marginTop: 16 }}>
        <article className="detailCard">
          <p className="cardLabel">Queue status</p>
          <div className="timeline">
            {statuses.map((item) => (
              <div key={item.status} className="timelineItem">
                <div>
                  <p className="timelineTitle">{item.label}</p>
                  <p className="timelineMeta">{item.count} jobs</p>
                </div>
                <span className="timelineStatus">{item.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="detailCard">
          <p className="cardLabel">Pipeline snapshot</p>
          <div className="timeline">
            {pipeline.deliveryTasks.map((task) => (
              <div key={task.id} className="timelineItem">
                <div>
                  <p className="timelineTitle">{task.title}</p>
                  <p className="timelineMeta">{task.recipient}</p>
                </div>
                <span className="timelineStatus">{task.status}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panelHeader">
          <h3>Queued jobs</h3>
          <p>Representative records for cron, queue, and worker integration.</p>
        </div>
        <div className="timeline">
          {sampleJobs.slice(0, 6).map((job) => (
            <div key={job.id} className="timelineItem">
              <div>
                <p className="timelineTitle">{jobTypeLabel(job.type)}</p>
                <p className="timelineMeta">
                  {job.companyName} · {job.target} · {formatDateTime(job.scheduledFor)}
                </p>
              </div>
              <span className="timelineStatus">{jobStatusLabel(job.status)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
