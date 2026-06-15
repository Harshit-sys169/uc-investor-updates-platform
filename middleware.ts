import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';
import { rateLimit } from '@/lib/rateLimit';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/health') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  if (pathname.startsWith('/api/')) {
    const env = getEnv();
    const ip = request.ip ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const result = rateLimit(`${ip}:${pathname}`, env.RATE_LIMIT_MAX, env.RATE_LIMIT_WINDOW_MS);

    response.headers.set('X-RateLimit-Limit', String(env.RATE_LIMIT_MAX));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.floor(result.resetAt / 1000)));

    if (!result.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Rate limit exceeded.',
          retryAfterSeconds: result.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfterSeconds),
            ...Object.fromEntries(response.headers.entries()),
          },
        },
      );
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
