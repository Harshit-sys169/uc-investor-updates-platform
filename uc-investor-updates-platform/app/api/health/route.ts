import { NextResponse } from 'next/server';
import { getEnvCheck } from '@/lib/env';

export async function GET() {
  const env = getEnvCheck();

  return NextResponse.json({
    ok: true,
    service: 'uc-investor-updates-platform',
    status: env.ok ? 'ready' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: env.values.NODE_ENV,
    checks: env,
  });
}
