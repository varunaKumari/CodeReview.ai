import { config } from 'dotenv';
import { z } from 'zod';

// Load .env file before validation
config();

/**
 * Zod schema defining all required and optional environment variables
 * with their types, defaults, and constraints.
 */
const envSchema = z.object({
  /** Server port number */
  PORT: z
    .string()
    .default('3001')
    .transform((val) => {
      const parsed = Number.parseInt(val, 10);
      if (Number.isNaN(parsed) || parsed < 1 || parsed > 65535) {
        throw new Error(`Invalid PORT value: ${val}. Must be a number between 1 and 65535.`);
      }
      return parsed;
    }),

  /** Application environment */
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  /** PostgreSQL connection URL (pooled — for queries via Neon/Supabase) */
  DATABASE_URL: z
    .string()
    .url({ message: 'DATABASE_URL must be a valid URL' })
    .default('postgresql://postgres:password@localhost:5432/codereview_ai'),

  /** Direct (non-pooled) PostgreSQL URL — required for Prisma migrations */
  DIRECT_URL: z
    .string()
    .url({ message: 'DIRECT_URL must be a valid URL' })
    .optional(),

  /** Redis connection URL (Upstash or standard Redis) */
  REDIS_URL: z
    .string()
    .url({ message: 'REDIS_URL must be a valid URL' })
    .default('redis://localhost:6379'),

  /** Allowed CORS origin */
  CORS_ORIGIN: z
    .string()
    .default('http://localhost:3000'),

  /** Pino log level */
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),

  /** Clerk secret key for JWT verification */
  CLERK_SECRET_KEY: z
    .string()
    .min(1, 'CLERK_SECRET_KEY is required')
    .default('sk_test_placeholder'),

  /** Clerk webhook secret for Svix signature verification */
  CLERK_WEBHOOK_SECRET: z
    .string()
    .min(1, 'CLERK_WEBHOOK_SECRET is required')
    .default('whsec_placeholder'),

  /** AES-256 encryption key (32 bytes = 64 hex characters) for token encryption */
  ENCRYPTION_KEY: z
    .string()
    .length(64, 'ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)')
    .regex(/^[0-9a-f]{64}$/i, 'ENCRYPTION_KEY must be a valid hex string')
    .default('0'.repeat(64)),
});

/** Inferred TypeScript type for the validated environment */
export type Env = z.infer<typeof envSchema>;

/**
 * Parses and validates `process.env` against the schema.
 * Throws a descriptive error on failure so the server never starts
 * with an invalid configuration.
 */
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  ✗ ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\n━━━ Environment Validation Failed ━━━\n${formatted}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    );
  }

  return result.data;
}

/** Validated environment variables – import this everywhere */
export const env: Env = validateEnv();
