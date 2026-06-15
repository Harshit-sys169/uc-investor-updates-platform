export type TrackingEventType =
  | 'open'
  | 'click'
  | 'reply'
  | 'bounce'
  | 'unsubscribe'
  | 'draft_saved'
  | 'test_sent'
  | 'scheduled';

export type TrackingEvent = {
  id: string;
  companyId: string;
  companyName: string;
  updateId: string;
  updateTitle: string;
  investorName?: string;
  type: TrackingEventType;
  channel: 'email' | 'web' | 'manual';
  label: string;
  url?: string;
  timestamp: string;
};

export type TrackingSummary = {
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
};

export type SeriesPoint = {
  label: string;
  value: number;
};

const base = new Date('2026-05-01T09:00:00.000Z');

export const sampleTrackingEvents: TrackingEvent[] = [
  {
    id: 'evt_001',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_may_2026',
    updateTitle: 'May founder update',
    investorName: 'Apex Ventures',
    type: 'open',
    channel: 'email',
    label: 'Opened from inbox',
    timestamp: new Date(base.getTime() + 1000 * 60 * 9).toISOString(),
  },
  {
    id: 'evt_002',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_may_2026',
    updateTitle: 'May founder update',
    investorName: 'Nexa Capital',
    type: 'open',
    channel: 'email',
    label: 'Opened from inbox',
    timestamp: new Date(base.getTime() + 1000 * 60 * 22).toISOString(),
  },
  {
    id: 'evt_003',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_may_2026',
    updateTitle: 'May founder update',
    investorName: 'Nexa Capital',
    type: 'click',
    channel: 'email',
    label: 'Clicked metrics link',
    url: 'https://example.com/updates/may-2026',
    timestamp: new Date(base.getTime() + 1000 * 60 * 37).toISOString(),
  },
  {
    id: 'evt_004',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_may_2026',
    updateTitle: 'May founder update',
    investorName: 'Blue Ridge Fund',
    type: 'reply',
    channel: 'email',
    label: 'Replied with questions',
    timestamp: new Date(base.getTime() + 1000 * 60 * 71).toISOString(),
  },
  {
    id: 'evt_005',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_may_2026',
    updateTitle: 'May founder update',
    type: 'draft_saved',
    channel: 'manual',
    label: 'Draft saved in composer',
    timestamp: new Date(base.getTime() + 1000 * 60 * 95).toISOString(),
  },
  {
    id: 'evt_006',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_may_2026',
    updateTitle: 'May founder update',
    type: 'test_sent',
    channel: 'manual',
    label: 'Test email sent',
    timestamp: new Date(base.getTime() + 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'evt_007',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_apr_2026',
    updateTitle: 'April founder update',
    investorName: 'Summit Group',
    type: 'open',
    channel: 'email',
    label: 'Opened from inbox',
    timestamp: new Date(base.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'evt_008',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_apr_2026',
    updateTitle: 'April founder update',
    investorName: 'Summit Group',
    type: 'click',
    channel: 'email',
    label: 'Clicked deck link',
    url: 'https://example.com/deck',
    timestamp: new Date(base.getTime() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'evt_009',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_apr_2026',
    updateTitle: 'April founder update',
    investorName: 'Apex Ventures',
    type: 'reply',
    channel: 'email',
    label: 'Asked for updated numbers',
    timestamp: new Date(base.getTime() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 31).toISOString(),
  },
  {
    id: 'evt_010',
    companyId: 'acme-foods',
    companyName: 'Acme Foods',
    updateId: 'upd_apr_2026',
    updateTitle: 'April founder update',
    type: 'scheduled',
    channel: 'manual',
    label: 'Scheduled for Friday 09:00 IST',
    timestamp: new Date(base.getTime() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45).toISOString(),
  },
];

export function makeTrackingEvent(input: Omit<TrackingEvent, 'id' | 'timestamp'> & { timestamp?: string; id?: string }): TrackingEvent {
  return {
    ...input,
    id: input.id ?? `evt_${Math.random().toString(36).slice(2, 10)}`,
    timestamp: input.timestamp ?? new Date().toISOString(),
  };
}

export function sortEvents(events: TrackingEvent[]) {
  return [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function summarizeTracking(events: TrackingEvent[]): TrackingSummary {
  const sent = events.filter((event) => event.type === 'scheduled' || event.type === 'test_sent').length || 1;
  const opened = events.filter((event) => event.type === 'open').length;
  const clicked = events.filter((event) => event.type === 'click').length;
  const replied = events.filter((event) => event.type === 'reply').length;
  const bounced = events.filter((event) => event.type === 'bounce').length;
  const unsubscribed = events.filter((event) => event.type === 'unsubscribe').length;

  return {
    sent,
    opened,
    clicked,
    replied,
    bounced,
    unsubscribed,
    openRate: roundPercent(opened / sent),
    clickRate: roundPercent(clicked / sent),
    replyRate: roundPercent(replied / sent),
  };
}

export function eventsByType(events: TrackingEvent[]) {
  const order: TrackingEventType[] = ['open', 'click', 'reply', 'bounce', 'unsubscribe', 'draft_saved', 'test_sent', 'scheduled'];
  return order.map((type) => ({
    type,
    count: events.filter((event) => event.type === type).length,
  }));
}

export function eventsByDay(events: TrackingEvent[], days = 7): SeriesPoint[] {
  const map = new Map<string, number>();
  const sorted = sortEvents(events);
  const latestTimestamp = sorted[0]?.timestamp ?? new Date().toISOString();
  const end = new Date(latestTimestamp);

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(end);
    date.setUTCDate(date.getUTCDate() - i);
    const key = date.toISOString().slice(0, 10);
    map.set(key, 0);
  }

  for (const event of sorted) {
    const key = event.timestamp.slice(0, 10);
    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

export function eventsByInvestor(events: TrackingEvent[]) {
  const counts = new Map<string, number>();
  for (const event of events) {
    if (!event.investorName) continue;
    counts.set(event.investorName, (counts.get(event.investorName) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

export function eventsByUpdate(events: TrackingEvent[]) {
  const counts = new Map<string, { title: string; count: number }>();
  for (const event of events) {
    const current = counts.get(event.updateId) ?? { title: event.updateTitle, count: 0 };
    current.count += 1;
    counts.set(event.updateId, current);
  }
  return [...counts.entries()]
    .map(([updateId, item]) => ({ updateId, ...item }))
    .sort((a, b) => b.count - a.count);
}

export function roundPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
