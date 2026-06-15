
import { describe, expect, it } from 'vitest';
import {
  activeIncidents,
  formatDuration,
  getObservabilitySnapshot,
  recentTraces,
  sampleAlerts,
  sampleIncidents,
  sampleMetrics,
  sampleTraces,
  severityBadge,
  statusBadge,
  summarizeServiceHealth,
} from '@/lib/observability';

describe('observability helpers', () => {
  it('builds a usable snapshot', () => {
    const snapshot = getObservabilitySnapshot();
    expect(snapshot.requestCount).toBeGreaterThan(0);
    expect(snapshot.alertsFiring).toBeGreaterThan(0);
    expect(snapshot.openIncidents).toBeGreaterThan(0);
  });

  it('formats service health', () => {
    const health = summarizeServiceHealth(sampleMetrics);
    expect(health.length).toBeGreaterThan(0);
    expect(health.some((item) => item.status === 'degraded')).toBe(true);
  });

  it('returns active incidents and recent traces', () => {
    expect(activeIncidents(sampleIncidents)).toHaveLength(2);
    expect(recentTraces(sampleTraces, 3)).toHaveLength(3);
  });

  it('formats labels', () => {
    expect(formatDuration(1234)).toContain('1,234');
    expect(severityBadge('high')).toBe('High');
    expect(statusBadge('degraded')).toBe('Degraded');
  });

  it('includes alert and trace samples', () => {
    expect(sampleAlerts.length).toBeGreaterThan(0);
    expect(sampleTraces.length).toBeGreaterThan(0);
  });
});
