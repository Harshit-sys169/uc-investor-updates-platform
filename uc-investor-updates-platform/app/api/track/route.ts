import { NextResponse } from 'next/server';
import { makeTrackingEvent, type TrackingEventType } from '@/lib/analytics';

type TrackBody = {
  companyId?: string;
  companyName?: string;
  updateId?: string;
  updateTitle?: string;
  investorName?: string;
  type?: TrackingEventType;
  channel?: 'email' | 'web' | 'manual';
  label?: string;
  url?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as TrackBody | null;

  if (!body?.companyId || !body?.companyName || !body?.updateId || !body?.updateTitle || !body?.type || !body?.channel || !body?.label) {
    return NextResponse.json(
      { ok: false, error: 'Missing required tracking fields.' },
      { status: 400 },
    );
  }

  const event = makeTrackingEvent({
    companyId: body.companyId,
    companyName: body.companyName,
    updateId: body.updateId,
    updateTitle: body.updateTitle,
    investorName: body.investorName,
    type: body.type,
    channel: body.channel,
    label: body.label,
    url: body.url,
  });

  return NextResponse.json({ ok: true, event });
}
