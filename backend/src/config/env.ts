import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(16).default('urban_ledger_secure_jwt_secret_key_2026_odoo'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/urban_ledger?schema=public'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment configuration:');
    const issues = result.error.issues || [];
    for (const issue of issues) {
      console.error(` - ${issue.path.join('.')}: ${issue.message}`);
    }
    throw new Error('Environment validation failed. Please check backend/.env');
  }

  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
