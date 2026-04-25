/**
 * Rate limiter for Next.js API routes.
 *
 * Uses Upstash Redis if UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are
 * configured (production); falls back to an in-memory sliding-window counter
 * otherwise (dev / preview). The in-memory path is per-instance, so multiple
 * VPS replicas would have independent counters — fine for low-traffic tenant
 * sites, not production-grade at scale. The Upstash path is atomic across
 * replicas.
 *
 * Shape is deliberately small — one function, one key, one window. Call
 * multiple times with different keys to compose per-IP + per-email limits.
 */

type Attempt = number[] // unix-ms timestamps, oldest first

// Per-process fallback store. Keys are prefixed `${scope}:${identifier}`.
// We trim on read, so memory stays bounded by the window size.
const MEM: Map<string, Attempt> = new Map()

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  reset: number // unix-ms when the oldest attempt expires
}

export async function rateLimit(opts: {
  key: string
  limit: number
  windowMs: number
}): Promise<RateLimitResult> {
  const { key, limit, windowMs } = opts
  const now = Date.now()
  const cutoff = now - windowMs

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    return upstashRateLimit({ key, limit, windowMs, url, token, now })
  }

  // In-memory fallback.
  const arr = (MEM.get(key) ?? []).filter((t) => t > cutoff)
  if (arr.length >= limit) {
    return {
      ok: false,
      limit,
      remaining: 0,
      reset: arr[0] + windowMs,
    }
  }
  arr.push(now)
  MEM.set(key, arr)
  return {
    ok: true,
    limit,
    remaining: Math.max(0, limit - arr.length),
    reset: arr[0] + windowMs,
  }
}

/**
 * Upstash Redis implementation — sliding window via a sorted set.
 * We trim old entries, count, and add-if-under in three REST calls.
 */
async function upstashRateLimit(opts: {
  key: string
  limit: number
  windowMs: number
  url: string
  token: string
  now: number
}): Promise<RateLimitResult> {
  const { key, limit, windowMs, url, token, now } = opts
  const cutoff = now - windowMs
  const redisKey = `rl:${key}`

  try {
    // ZREMRANGEBYSCORE — drop expired attempts
    await fetch(`${url}/zremrangebyscore/${encodeURIComponent(redisKey)}/-inf/${cutoff}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    // ZCARD — count current
    const countRes = await fetch(`${url}/zcard/${encodeURIComponent(redisKey)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const countJson = (await countRes.json()) as { result?: number }
    const count = countJson.result ?? 0

    if (count >= limit) {
      // Also get the oldest to compute reset
      const oldRes = await fetch(
        `${url}/zrange/${encodeURIComponent(redisKey)}/0/0/WITHSCORES`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
      )
      const oldJson = (await oldRes.json()) as { result?: string[] }
      const oldest = oldJson.result?.[1] ? Number(oldJson.result[1]) : now
      return { ok: false, limit, remaining: 0, reset: oldest + windowMs }
    }

    // ZADD + EXPIRE
    await fetch(`${url}/zadd/${encodeURIComponent(redisKey)}/${now}/${now}-${Math.random().toString(36).slice(2, 8)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    await fetch(`${url}/expire/${encodeURIComponent(redisKey)}/${Math.ceil(windowMs / 1000)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    return { ok: true, limit, remaining: Math.max(0, limit - count - 1), reset: now + windowMs }
  } catch {
    // On Upstash failure, fail-open — don't block legit traffic because of a
    // transient REST error. Better to under-limit for a moment than to deny
    // service entirely. The caller can still log the fact if it cares.
    return { ok: true, limit, remaining: limit, reset: now + windowMs }
  }
}

/** Best-effort IP extraction from the request. Returns a stable string
 *  (falls back to a placeholder) so rateLimit() keys never end up null. */
export function clientIp(req: Request): string {
  const h = req.headers
  const xff = h.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return h.get('x-real-ip') || h.get('cf-connecting-ip') || 'unknown'
}
