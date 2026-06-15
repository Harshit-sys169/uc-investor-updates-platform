import { NextResponse } from 'next/server';
import { getEnvCheck } from '@/lib/env';

export async function GET() {
  const env = getEnvCheck();
  const status = env.ok ? 200 : 503;

  return NextResponse.json(
    {
      ok: env.ok,
      ready: env.ok,
      missing: env.missing,
      warnings: env.warnings,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
