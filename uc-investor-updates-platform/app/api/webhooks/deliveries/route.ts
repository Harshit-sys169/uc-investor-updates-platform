import { NextResponse } from 'next/server';
import { buildWebhookTrackingEvent, sampleDeliveryTasks } from '@/lib/delivery';

type WebhookBody = {
  taskId?: string;
  event?: 'delivered' | 'failed' | 'open' | 'click' | 'reply';
  label?: string;
  url?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as WebhookBody | null;

  if (!body?.taskId || !body?.event) {
    return NextResponse.json({ ok: false, error: 'Missing required webhook fields.' }, { status: 400 });
  }

  const task = sampleDeliveryTasks.find((item) => item.id === body.taskId);

  if (!task) {
    return NextResponse.json({ ok: false, error: 'Task not found.' }, { status: 404 });
  }

  const event = buildWebhookTrackingEvent(
    task,
    body.event,
    body.label ?? `Webhook event: ${body.event}`,
    body.url,
  );

  return NextResponse.json({ ok: true, event });
}
