import { NextResponse } from 'next/server';
import { generateAIResponse, type AIAction, type AIDraftInput } from '@/lib/ai';

function isAction(value: unknown): value is AIAction {
  return value === 'subject_lines' || value === 'rewrite' || value === 'score' || value === 'follow_up' || value === 'investor_summary';
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as (AIDraftInput & { action?: string; text?: string; investorName?: string }) | null;
  if (!body || !isAction(body.action)) {
    return NextResponse.json({ error: 'Invalid AI request' }, { status: 400 });
  }

  const result = generateAIResponse(body.action, {
    companyName: body.companyName ?? 'Company',
    updateTitle: body.updateTitle ?? 'Update',
    audience: body.audience ?? 'Investors',
    summary: body.summary ?? body.text ?? '',
    metrics: body.metrics ?? [],
    asks: body.asks ?? [],
    tone: body.tone,
    text: body.text,
    investorName: body.investorName,
  });

  return NextResponse.json(result);
}
