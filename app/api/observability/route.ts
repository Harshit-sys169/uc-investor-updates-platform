
import { NextResponse } from 'next/server';
import { getEnvCheck } from '@/lib/env';
import { getObservabilitySnapshot } from '@/lib/observability';

export async function GET() {
  const env = getEnvCheck();
  const snapshot = getObservabilitySnapshot();

  return NextResponse.json({
    ok: true,
    ready: env.ok,
    environment: env.values.NODE_ENV,
    warnings: env.warnings,
    snapshot,
    timestamp: new Date().toISOString(),
  });
}
