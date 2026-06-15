import { NextResponse } from 'next/server';
import { buildInvestorIntelligence } from '@/lib/investorIntelligence';
import type { InvestorRecord } from '@/lib/investorCRM';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        companyName?: string;
        focusTags?: string[];
        investors?: InvestorRecord[];
      }
    | null;

  if (!body || !Array.isArray(body.investors)) {
    return NextResponse.json({ error: 'Invalid intelligence request' }, { status: 400 });
  }

  const report = buildInvestorIntelligence(
    body.investors,
    Array.isArray(body.focusTags) ? body.focusTags.filter((item): item is string => typeof item === 'string') : [],
    body.companyName ?? 'Workspace',
  );

  return NextResponse.json(report);
}
