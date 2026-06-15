
import Link from 'next/link';
import { getEnvCheck } from '@/lib/env';
import {
  activeIncidents,
  formatDuration,
  getObservabilitySnapshot,
  recentTraces,
  severityBadge,
  statusBadge,
  summarizeServiceHealth,
} from '@/lib/observability';

export default function ObservabilityPage() {
  const env = getEnvCheck();
  const snapshot = getObservabilitySnapshot();
  const serviceHealth = summarizeServiceHealth(snapshot.metrics);
  const incidents = activeIncidents(snapshot.incidents);
  const traces = recentTraces(snapshot.traces, 6);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Observability</p>
          <h1>System health and telemetry</h1>
          <p className="lede">Metrics, traces, incidents, alert states, and readiness signals for the production layer.</p>
        </div>
        <div className="actions">
          <Link className="button buttonSecondary" href="/api/health">Health JSON</Link>
          <Link className="button buttonSecondary" href="/api/ready">Readiness JSON</Link>
        </div>
      </section>

      <section className="statsGrid">
        <article className="card">
          <p className="cardLabel">Uptime</p>
          <h2>{snapshot.uptime}</h2>
          <p>Service availability across the current scaffold.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Request count</p>
          <h2>{snapshot.requestCount}</h2>
          <p>Sampled requests across tracked endpoints.</p>
        </article>
        <article className="card">
          <p className="cardLabel">P95 latency</p>
          <h2>{formatDuration(snapshot.p95LatencyMs)}</h2>
          <p>Computed from trace spans in the observability sample set.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Open incidents</p>
          <h2>{snapshot.openIncidents}</h2>
          <p>{snapshot.alertsFiring} alerts currently firing.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Error rate</p>
          <h2>{snapshot.errorRate}</h2>
          <p>Derived from the latest trace sample set.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Service health</p>
            <h2>Subsystem status</h2>
          </div>
          <p className="muted">Environment: {env.values.NODE_ENV}</p>
        </div>
        <div className="grid">
          {serviceHealth.map((service) => (
            <article key={service.service} className="card">
              <p className="cardLabel">{service.service}</p>
              <h2>{statusBadge(service.status)}</h2>
              <p>{service.healthy} healthy checks, {service.degraded} degraded checks.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="analyticsLayout">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Traces</p>
              <h2>Recent spans</h2>
            </div>
          </div>
          <div className="timeline">
            {traces.map((trace) => (
              <div key={trace.id} className="timelineItem">
                <div>
                  <p className="timelineTitle">{trace.route}</p>
                  <p className="timelineMeta">{trace.requestId} · {trace.service} · {trace.method}</p>
                </div>
                <span className="timelineStatus">{formatDuration(trace.durationMs)} · {trace.outcome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Alerts</p>
              <h2>Alert rules</h2>
            </div>
          </div>
          <div className="timeline">
            {snapshot.alerts.map((alert) => (
              <div key={alert.id} className="timelineItem">
                <div>
                  <p className="timelineTitle">{alert.name}</p>
                  <p className="timelineMeta">{alert.service} · {alert.condition}</p>
                </div>
                <span className="timelineStatus">{alert.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="analyticsLayout">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Incidents</p>
              <h2>Active issues</h2>
            </div>
          </div>
          <div className="timeline">
            {incidents.map((incident) => (
              <div key={incident.id} className="timelineItem">
                <div>
                  <p className="timelineTitle">{incident.title}</p>
                  <p className="timelineMeta">{incident.service} · {severityBadge(incident.severity)} · {incident.owner}</p>
                </div>
                <span className="timelineStatus">{incident.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Readiness</p>
              <h2>Operational checks</h2>
            </div>
          </div>
          <div className="grid">
            <article className="card">
              <p className="cardLabel">Health endpoint</p>
              <h2>{env.ok ? 'Ready' : 'Degraded'}</h2>
              <p>{env.warnings.length} warnings surfaced from the runtime environment.</p>
            </article>
            <article className="card">
              <p className="cardLabel">Open traces</p>
              <h2>{snapshot.traces.length}</h2>
              <p>Spans available for debugging route performance.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
