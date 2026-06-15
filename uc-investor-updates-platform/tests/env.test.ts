import { afterEach, describe, expect, it, vi } from 'vitest';
import { getEnv, getEnvCheck } from '../lib/env';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

describe('environment helpers', () => {
  it('returns a validation check even with optional values missing', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'development',
      NEXT_PUBLIC_APP_NAME: 'UC Investor Updates Platform',
      RATE_LIMIT_WINDOW_MS: '60000',
      RATE_LIMIT_MAX: '60',
    };

    const check = getEnvCheck();
    expect(check.values.NODE_ENV).toBe('development');
    expect(check.warnings.length).toBeGreaterThan(0);
  });

  it('parses environment configuration', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      NEXT_PUBLIC_APP_NAME: 'UC Investor Updates Platform',
      RATE_LIMIT_WINDOW_MS: '120000',
      RATE_LIMIT_MAX: '10',
    };

    const env = getEnv();
    expect(env.NODE_ENV).toBe('test');
    expect(env.RATE_LIMIT_WINDOW_MS).toBe(120000);
    expect(env.RATE_LIMIT_MAX).toBe(10);
  });
});
