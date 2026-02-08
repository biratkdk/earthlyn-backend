import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRATION: z.string().default('7d'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  MESSAGE_ENCRYPTION_KEY: z.string().min(1, 'MESSAGE_ENCRYPTION_KEY is required'),
  CORS_ORIGIN: z.string().default('*'),
  THROTTLE_TTL: z.string().default('60'),
  THROTTLE_LIMIT: z.string().default('10'),
  ALLOW_ADMIN_REGISTRATION: z.enum(['true', 'false']).default('false'),
  AUTO_FULFILL: z.enum(['true', 'false']).default('false'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: NodeJS.ProcessEnv): Env {
  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map(err => \: \)
        .join('\n');
      throw new Error(
        \Environment validation failed:\n\
      );
    }
    throw error;
  }
}
