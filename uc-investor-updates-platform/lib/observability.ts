
export type ObservabilitySeverity = 'low' | 'medium' | 'high';
export type ObservabilityStatus = 'healthy' | 'degraded' | 'critical';

export type ServiceMetric = {
  id: string;
  service: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  status: ObservabilityStatus;
  timestamp: string;
};

export type TraceSpan = {
  id: string;
  requestId: string;
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  durationMs: number;
  service: string;
  outcome: 'ok' | 'warn' | 'error';
  timestamp: string;
};

export type Incident = {
  id: string;
  title: string;
  service: string;
  severity: ObservabilitySeverity;
  status: 'open' | 'investigating' | 'resolved';
  owner: string;
  detectedAt: string;
  summary: string;
};

export type AlertRule = {
  id: string;
  name: string;
  service: string;
  condition: string;
  threshold: string;
  status: 'firing' | 'ok' | 'scheduled';
  lastTriggeredAt?: string;
};

export type ObservabilitySnapshot = {
  uptime: string;
  requestCount: number;
  p95LatencyMs: number;
  errorRate: string;
  openIncidents: number;
  alertsFiring: number;
  services: Array<{
    service: string;
    status: ObservabilityStatus;
    metricCount: number;
    traceCount: number;
  }>;
  metrics: ServiceMetric[];
  traces: TraceSpan[];
  incidents: Incident[];
  alerts: AlertRule[];
};

const base = new Date('2026-05-23T03:15:00.000Z');

export const sampleMetrics: ServiceMetric[] = [
  {
    id: 'metric_1',
    service: 'api',
    name: 'Request latency',
    value: 182,
    unit: 'ms',
    target: 250,
    status: 'healthy',
    timestamp: new Date(base.getTime() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 'metric_2',
    service: 'api',
    name: 'Error rate',
    value: 1.2,
    unit: '%',
    target: 2,
    status: 'healthy',
    timestamp: new Date(base.getTime() - 1000 * 60 * 9).toISOString(),
  },
  {
    id: 'metric_3',
    service: 'jobs',
    name: 'Queue depth',
    value: 14,
    unit: 'jobs',
    target: 20,
    status: 'healthy',
    timestamp: new Date(base.getTime() - 1000 * 60 * 6).toISOString(),
  },
  {
    id: 'metric_4',
    service: 'delivery',
    name: 'Delivery success',
    value: 98.7,
    unit: '%',
    target: 97,
    status: 'healthy',
    timestamp: new Date(base.getTime() - 1000 * 60 * 7).toISOString(),
  },
  {
    id: 'metric_5',
    service: 'ai',
    name: 'AI request latency',
    value: 640,
    unit: 'ms',
    target: 800,
    status: 'degraded',
    timestamp: new Date(base.getTime() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'metric_6',
    service: 'db',
    name: 'Query p95',
    value: 310,
    unit: 'ms',
    target: 300,
    status: 'degraded',
    timestamp: new Date(base.getTime() - 1000 * 60 * 15).toISOString(),
  },
];

export const sampleTraces: TraceSpan[] = [
  { id: 'trace_1', requestId: 'req_1001', route: '/api/track', method: 'POST', durationMs: 94, service: 'api', outcome: 'ok', timestamp: new Date(base.getTime() - 1000 * 60 * 2).toISOString() },
  { id: 'trace_2', requestId: 'req_1002', route: '/api/jobs', method: 'GET', durationMs: 121, service: 'api', outcome: 'ok', timestamp: new Date(base.getTime() - 1000 * 60 * 5).toISOString() },
  { id: 'trace_3', requestId: 'req_1003', route: '/api/ai', method: 'POST', durationMs: 684, service: 'ai', outcome: 'warn', timestamp: new Date(base.getTime() - 1000 * 60 * 8).toISOString() },
  { id: 'trace_4', requestId: 'req_1004', route: '/api/cron/deliveries', method: 'POST', durationMs: 402, service: 'jobs', outcome: 'ok', timestamp: new Date(base.getTime() - 1000 * 60 * 10).toISOString() },
  { id: 'trace_5', requestId: 'req_1005', route: '/api/webhooks/deliveries', method: 'POST', durationMs: 532, service: 'delivery', outcome: 'error', timestamp: new Date(base.getTime() - 1000 * 60 * 13).toISOString() },
  { id: 'trace_6', requestId: 'req_1006', route: '/api/health', method: 'GET', durationMs: 18, service: 'api', outcome: 'ok', timestamp: new Date(base.getTime() - 1000 * 60 * 17).toISOString() },
];

export const sampleIncidents: Incident[] = [
  {
    id: 'inc_1',
    title: 'AI latency above target',
    service: 'ai',
    severity: 'medium',
    status: 'investigating',
    owner: 'Platform team',
    detectedAt: new Date(base.getTime() - 1000 * 60 * 11).toISOString(),
    summary: 'Model response time spiked during high volume draft generation.',
  },
  {
    id: 'inc_2',
    title: 'Webhook delivery timeout',
    service: 'delivery',
    severity: 'high',
    status: 'open',
    owner: 'Ops on-call',
    detectedAt: new Date(base.getTime() - 1000 * 60 * 29).toISOString(),
    summary: 'External provider timeout caused a retry loop in the outbound pipeline.',
  },
  {
    id: 'inc_3',
    title: 'Database query slowdown',
    service: 'db',
    severity: 'low',
    status: 'resolved',
    owner: 'Backend team',
    detectedAt: new Date(base.getTime() - 1000 * 60 * 95).toISOString(),
    summary: 'A slow index-free query path was optimized and retested.',
  },
];

export const sampleAlerts: AlertRule[] = [
  { id: 'alert_1', name: 'API latency', service: 'api', condition: 'p95 > 250ms for 5m', threshold: '250ms', status: 'ok' },
  { id: 'alert_2', name: 'Queue depth', service: 'jobs', condition: 'queued jobs > 50', threshold: '50 jobs', status: 'ok' },
  { id: 'alert_3', name: 'AI latency', service: 'ai', condition: 'p95 > 800ms for 10m', threshold: '800ms', status: 'firing', lastTriggeredAt: new Date(base.getTime() - 1000 * 60 * 7).toISOString() },
  { id: 'alert_4', name: 'Webhook errors', service: 'delivery', condition: 'error rate > 2%', threshold: '2%', status: 'firing', lastTriggeredAt: new Date(base.getTime() - 1000 * 60 * 18).toISOString() },
  { id: 'alert_5', name: 'DB p95', service: 'db', condition: 'p95 > 300ms for 5m', threshold: '300ms', status: 'scheduled' },
];

export function percent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDuration(ms: number) {
  return `${ms.toLocaleString('en-IN')} ms`;
}

export function getObservabilitySnapshot(): ObservabilitySnapshot {
  const requestCount = sampleTraces.length;
  const p95LatencyMs = sampleTraces.map((trace) => trace.durationMs).sort((a, b) => a - b)[Math.max(0, Math.ceil(sampleTraces.length * 0.95) - 1)] ?? 0;
  const errorRate = percent((sampleTraces.filter((trace) => trace.outcome === 'error').length / requestCount) * 100);
  const openIncidents = sampleIncidents.filter((incident) => incident.status !== 'resolved').length;
  const alertsFiring = sampleAlerts.filter((alert) => alert.status === 'firing').length;

  const services = ['api', 'jobs', 'delivery', 'ai', 'db'].map((service) => ({
    service,
    status: service === 'ai' || service === 'db' ? 'degraded' as const : 'healthy' as const,
    metricCount: sampleMetrics.filter((metric) => metric.service === service).length,
    traceCount: sampleTraces.filter((trace) => trace.service === service).length,
  }));

  return {
    uptime: '99.93%',
    requestCount,
    p95LatencyMs,
    errorRate,
    openIncidents,
    alertsFiring,
    services,
    metrics: sampleMetrics,
    traces: sampleTraces,
    incidents: sampleIncidents,
    alerts: sampleAlerts,
  };
}

export function severityBadge(severity: ObservabilitySeverity) {
  return severity === 'high' ? 'High' : severity === 'medium' ? 'Medium' : 'Low';
}

export function statusBadge(status: ObservabilityStatus) {
  return status === 'critical' ? 'Critical' : status === 'degraded' ? 'Degraded' : 'Healthy';
}

export function summarizeServiceHealth(metrics: ServiceMetric[]) {
  return ['api', 'jobs', 'delivery', 'ai', 'db'].map((service) => {
    const serviceMetrics = metrics.filter((metric) => metric.service === service);
    const healthy = serviceMetrics.filter((metric) => metric.status === 'healthy').length;
    const degraded = serviceMetrics.filter((metric) => metric.status === 'degraded').length;
    const status = degraded > 0 ? 'degraded' : 'healthy';
    return {
      service,
      healthy,
      degraded,
      status,
    };
  });
}

export function recentTraces(traces: TraceSpan[], limit = 5) {
  return [...traces].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}

export function activeIncidents(incidents: Incident[]) {
  return incidents.filter((incident) => incident.status !== 'resolved');
}
