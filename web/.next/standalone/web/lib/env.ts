/**
 * Validated Environment Variables
 *
 * Ported from Vete (ai-whisperers/vete) - adapted for Builder.
 *
 * Features:
 * - Lazy evaluation for NEXT_PUBLIC_* vars (client-safe)
 * - Fails fast on server-side if required variables are missing
 * - Graceful degradation on client-side with console errors
 * - Type-safe access (no need for `!` assertions)
 *
 * @example
 * ```typescript
 * import { env } from '@/lib/env'
 * const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
 * ```
 */
import { logger } from '@/lib/logger'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `[ENV ERROR] Missing required environment variable: ${name}\n` +
        `Please ensure this variable is set in your .env.local file.`
    )
  }
  return value
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}

function optionalEnvOrUndefined(name: string): string | undefined {
  return process.env[name]
}

function boolEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name]
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL
    || process.env.NEXT_PUBLIC_BASE_URL
    || 'https://paragu-ai.com'
  return raw.replace(/\/+$/, '')
}

export const env = {
  // ===========================================================================
  // Supabase Configuration (Required)
  // ===========================================================================

  get SUPABASE_URL(): string {
    const value = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!value) {
      if (typeof window === 'undefined') {
        throw new Error(
          `[ENV ERROR] Missing required: NEXT_PUBLIC_SUPABASE_URL\n` +
            `Set this in your .env.local file.`
        )
      }
      logger.error('NEXT_PUBLIC_SUPABASE_URL is not defined (client)', {
        action: 'env.check',
        envVar: 'NEXT_PUBLIC_SUPABASE_URL',
      })
      return ''
    }
    return value
  },

  get SUPABASE_ANON_KEY(): string {
    // Supabase renamed "anon key" to "publishable key" — accept both
    const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!value) {
      if (typeof window === 'undefined') {
        throw new Error(
          `[ENV ERROR] Missing required: NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)\n` +
            `Set this in your .env.local file.`
        )
      }
      logger.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined (client)', {
        action: 'env.check',
        envVar: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      })
      return ''
    }
    return value
  },

  get SUPABASE_SERVICE_ROLE_KEY(): string {
    return requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  },

  // ===========================================================================
  // Application Configuration
  // ===========================================================================

  APP_URL: optionalEnv(
    'NEXT_PUBLIC_APP_URL',
    optionalEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
  ),

  NODE_ENV: optionalEnv('NODE_ENV', 'development'),

  get isDev(): boolean {
    return this.NODE_ENV === 'development'
  },

  get isProd(): boolean {
    return this.NODE_ENV === 'production'
  },

  get isTest(): boolean {
    return this.NODE_ENV === 'test'
  },

  // ===========================================================================
  // Monitoring (Optional)
  // ===========================================================================

  SENTRY_DSN: optionalEnvOrUndefined('NEXT_PUBLIC_SENTRY_DSN'),

  // ===========================================================================
  // Image Storage (Optional)
  // ===========================================================================

  CLOUDINARY_CLOUD_NAME: optionalEnvOrUndefined('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: optionalEnvOrUndefined('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: optionalEnvOrUndefined('CLOUDINARY_API_SECRET'),

  // ===========================================================================
  // Rate Limiting (Optional)
  // ===========================================================================

  UPSTASH_REDIS_REST_URL: optionalEnvOrUndefined('UPSTASH_REDIS_REST_URL'),
  UPSTASH_REDIS_REST_TOKEN: optionalEnvOrUndefined('UPSTASH_REDIS_REST_TOKEN'),

  // ===========================================================================
  // Commerce — Pagopar (required in production when commerce is enabled).
  // Per-merchant credentials eventually live in business_payment_credentials;
  // these env vars are only for Paragu-AI's own fallback / testing account.
  // ===========================================================================

  PAGOPAR_PUBLIC_TOKEN: optionalEnvOrUndefined('PAGOPAR_PUBLIC_TOKEN'),
  PAGOPAR_PRIVATE_TOKEN: optionalEnvOrUndefined('PAGOPAR_PRIVATE_TOKEN'),
  PAGOPAR_ENVIRONMENT: optionalEnv('PAGOPAR_ENVIRONMENT', 'sandbox'),

  // Paragu-AI's OWN Pagopar account — for split-billing commission
  // on tenant sales + future SaaS auto-invoicing. Optional.
  PARAGU_AI_PAGOPAR_PUBLIC_TOKEN: optionalEnvOrUndefined('PARAGU_AI_PAGOPAR_PUBLIC_TOKEN'),
  PARAGU_AI_PAGOPAR_PRIVATE_TOKEN: optionalEnvOrUndefined('PARAGU_AI_PAGOPAR_PRIVATE_TOKEN'),

  // ===========================================================================
  // Commerce — Bancard vPOS 2.0 (secondary provider, used by tenants
  // whose profile favors direct-acquirer pricing over Pagopar's wallet
  // coverage). Per-merchant credentials live in
  // business_payment_credentials; these env vars are the platform fallback.
  // ===========================================================================

  BANCARD_PUBLIC_KEY: optionalEnvOrUndefined('BANCARD_PUBLIC_KEY'),
  BANCARD_PRIVATE_KEY: optionalEnvOrUndefined('BANCARD_PRIVATE_KEY'),
  BANCARD_ENVIRONMENT: optionalEnv('BANCARD_ENVIRONMENT', 'sandbox'),
  MERCADOPAGO_PUBLIC_KEY: optionalEnvOrUndefined('MERCADOPAGO_PUBLIC_KEY'),
  MERCADOPAGO_ACCESS_TOKEN: optionalEnvOrUndefined('MERCADOPAGO_ACCESS_TOKEN'),
  MERCADOPAGO_WEBHOOK_SECRET: optionalEnvOrUndefined('MERCADOPAGO_WEBHOOK_SECRET'),

  // AES-256 key (64 hex) used to encrypt per-merchant payment
  // credentials at rest. Generate: openssl rand -hex 32
  COMMERCE_CREDENTIALS_KEY: optionalEnvOrUndefined('COMMERCE_CREDENTIALS_KEY'),

  COMMERCE_SESSION_SECRET: optionalEnvOrUndefined('COMMERCE_SESSION_SECRET'),

  get commerceConfigured(): boolean {
    return Boolean(process.env.PAGOPAR_PUBLIC_TOKEN && process.env.PAGOPAR_PRIVATE_TOKEN)
  },

  requireCommerceEnv(): { publicToken: string; privateToken: string; sessionSecret: string; environment: string } {
    return {
      publicToken: requireEnv('PAGOPAR_PUBLIC_TOKEN'),
      privateToken: requireEnv('PAGOPAR_PRIVATE_TOKEN'),
      sessionSecret: requireEnv('COMMERCE_SESSION_SECRET'),
      environment: process.env.PAGOPAR_ENVIRONMENT ?? 'sandbox',
    }
  },

  // ===========================================================================
  // Debug/Development
  // ===========================================================================

  DEBUG: boolEnv('DEBUG', false),
  LOG_LEVEL: optionalEnv('LOG_LEVEL', 'info'),
} as const

export type Env = typeof env

if (env.isDev && typeof window === 'undefined') {
  logger.debug('Environment variables validated', { action: 'env.init' })
}
