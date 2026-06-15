import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('UC Investor Updates Platform'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  DATABASE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
});

export type AppEnv = z.infer<typeof envSchema>;

export type EnvCheck = {
  ok: boolean;
  missing: string[];
  warnings: string[];
  values: Pick<AppEnv, 'NODE_ENV' | 'NEXT_PUBLIC_APP_NAME' | 'RATE_LIMIT_WINDOW_MS' | 'RATE_LIMIT_MAX'>;
};

export function getEnv(): AppEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function getEnvCheck(): EnvCheck {
  const parsed = envSchema.safeParse(process.env);
  const data = parsed.success ? parsed.data : {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'UC Investor Updates Platform',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
    RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
    RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? 60),
  } as AppEnv;

  const missing: string[] = [];
  const warnings: string[] = [];

  if (!data.DATABASE_URL) warnings.push('DATABASE_URL is not set. Database-backed features remain scaffolded.');
  if (!data.OPENAI_API_KEY) warnings.push('OPENAI_API_KEY is not set. AI routes should use mock responses.');
  if (!data.RESEND_API_KEY) warnings.push('RESEND_API_KEY is not set. Email sending should remain disabled.');
  if (!data.CLERK_SECRET_KEY || !data.CLERK_PUBLISHABLE_KEY) warnings.push('Clerk keys are not set. Auth stays in scaffold mode.');
  if (!data.CRON_SECRET) warnings.push('CRON_SECRET is not set. Cron endpoints should be protected before production.');
  if (!data.NEXT_PUBLIC_APP_URL) warnings.push('NEXT_PUBLIC_APP_URL is not set. Absolute links may be incomplete.');

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      missing.push(issue.path.join('.'));
    }
  }

  return {
    ok: missing.length === 0,
    missing,
    warnings,
    values: {
      NODE_ENV: data.NODE_ENV,
      NEXT_PUBLIC_APP_NAME: data.NEXT_PUBLIC_APP_NAME,
      RATE_LIMIT_WINDOW_MS: data.RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_MAX: data.RATE_LIMIT_MAX,
    },
  };
}
