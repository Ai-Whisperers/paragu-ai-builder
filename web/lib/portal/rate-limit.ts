const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const DEFAULTS: RateLimitConfig = { windowMs: 60_000, maxRequests: 30 }

export function checkRateLimit(key: string, config: RateLimitConfig = DEFAULTS): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs }
  }

  entry.count++

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  return { allowed: true, remaining: config.maxRequests - entry.count, resetIn: entry.resetAt - now }
}

export function rateLimitHeaders(result: { remaining: number; resetIn: number }): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
  }
}
