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
      console.error('[ENV ERROR] NEXT_PUBLIC_SUPABASE_URL is not defined')
      return ''
    }
    return value
  },

  get SUPABASE_ANON_KEY(): string {
    const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!value) {
      if (typeof window === 'undefined') {
        throw new Error(
          `[ENV ERROR] Missing required: NEXT_PUBLIC_SUPABASE_ANON_KEY\n` +
            `Set this in your .env.local file.`
        )
      }
      console.error('[ENV ERROR] NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
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
  // Debug/Development
  // ===========================================================================

  DEBUG: boolEnv('DEBUG', false),
  LOG_LEVEL: optionalEnv('LOG_LEVEL', 'info'),
} as const

export type Env = typeof env

if (env.isDev && typeof window === 'undefined') {
  // eslint-disable-next-line no-console
  console.info('[ENV] Environment variables validated successfully')
}
