import { afterEach, describe, expect, it, vi } from 'vitest';
import { rateLimit, rateLimitHeaders } from '../lib/rateLimit';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('rate limit helper', () => {
  it('allows within the limit and blocks above it', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000);

    const first = rateLimit('ip:test-1', 2, 60_000);
    const second = rateLimit('ip:test-1', 2, 60_000);
    const third = rateLimit('ip:test-1', 2, 60_000);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it('formats response headers', () => {
    vi.spyOn(Date, 'now').mockReturnValue(2_000_000);
    const result = rateLimit('ip:test-2', 5, 30_000);
    const headers = rateLimitHeaders(result);

    expect(headers['X-RateLimit-Remaining']).toBe(String(result.remaining));
    expect(headers['Retry-After']).toBe(String(result.retryAfterSeconds));
  });
});
