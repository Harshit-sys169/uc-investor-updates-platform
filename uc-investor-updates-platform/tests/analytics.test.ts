import { describe, expect, it } from 'vitest';
import {
  eventsByDay,
  eventsByInvestor,
  eventsByType,
  eventsByUpdate,
  makeTrackingEvent,
  roundPercent,
  sampleTrackingEvents,
  sortEvents,
  summarizeTracking,
} from '../lib/analytics';

describe('analytics helpers', () => {
  it('sorts events newest first', () => {
    const sorted = sortEvents(sampleTrackingEvents);
    expect(sorted[0].timestamp >= sorted[1].timestamp).toBe(true);
  });

  it('summarizes opens, clicks, and replies', () => {
    const summary = summarizeTracking(sampleTrackingEvents);
    expect(summary.sent).toBeGreaterThan(0);
    expect(summary.opened).toBeGreaterThan(0);
    expect(summary.clicked).toBeGreaterThan(0);
    expect(summary.replied).toBeGreaterThan(0);
    expect(summary.openRate).toMatch(/%$/);
    expect(summary.clickRate).toMatch(/%$/);
    expect(summary.replyRate).toMatch(/%$/);
  });

  it('groups events by type and investor', () => {
    const byType = eventsByType(sampleTrackingEvents);
    const openBucket = byType.find((item) => item.type === 'open');
    expect(openBucket?.count).toBe(3);

    const byInvestor = eventsByInvestor(sampleTrackingEvents);
    expect(byInvestor[0].value).toBeGreaterThanOrEqual(byInvestor[1].value);
  });

  it('groups events by update and day', () => {
    const byUpdate = eventsByUpdate(sampleTrackingEvents);
    expect(byUpdate[0].count).toBeGreaterThanOrEqual(byUpdate[1].count);

    const byDay = eventsByDay(sampleTrackingEvents, 5);
    expect(byDay).toHaveLength(5);
    expect(byDay.some((point) => point.value > 0)).toBe(true);
  });

  it('creates tracking events with defaults', () => {
    const event = makeTrackingEvent({
      companyId: 'acme-foods',
      companyName: 'Acme Foods',
      updateId: 'upd_demo',
      updateTitle: 'Demo update',
      type: 'open',
      channel: 'email',
      label: 'Opened email',
    });

    expect(event.id).toMatch(/^evt_/);
    expect(event.timestamp).toContain('T');
  });

  it('rounds percentages consistently', () => {
    expect(roundPercent(0)).toBe('0%');
    expect(roundPercent(0.615)).toBe('62%');
  });
});
