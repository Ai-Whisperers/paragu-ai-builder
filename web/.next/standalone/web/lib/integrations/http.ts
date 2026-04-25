/**
 * Shared HTTP helper for integration adapters.
 *
 * Centralizes the fetch + error plumbing every adapter (HubSpot, Notion,
 * Pipedrive, Mailchimp, Resend) was duplicating:
 *   - timeout (default 8s, override per call)
 *   - one retry on transport failure (aborted/fetch-failed) — never on 4xx/5xx
 *     since those are often deterministic (auth, bad payload)
 *   - structured { ok, error, status, data? } return — never throws
 *   - logger breadcrumb on slow calls + failures so debugging cross-service
 *     issues doesn't require guessing
 *
 * Each adapter keeps only the request shape (URL + headers + body). The fetch
 * itself — and how its failure surfaces — lives here.
 */
import { logger } from '@/lib/logger'

const DEFAULT_TIMEOUT_MS = 8_000
const SLOW_THRESHOLD_MS = 2_000

export interface IntegrationFetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: string
  timeoutMs?: number
  retryOnNetworkError?: boolean
  /** Name of the adapter / integration for logging (e.g. 'hubspot'). */
  adapter: string
}

export interface IntegrationFetchResult<T = unknown> {
  ok: boolean
  status: number
  data?: T
  /** Structured, user-readable error string — always present when !ok. */
  error?: string
  /** Raw response body (truncated) — useful for debugging unexpected payloads. */
  body?: string
}

async function doFetch(
  url: string,
  opts: IntegrationFetchOptions,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  try {
    return await fetch(url, {
      method: opts.method,
      headers: opts.headers,
      body: opts.body,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

function summarize(body: string): string {
  return body.length > 300 ? body.slice(0, 300) + '…' : body
}

/**
 * Perform an outbound HTTP request on behalf of an integration adapter.
 *
 * Returns a structured result — never throws. Safe to call inside a
 * Promise.all alongside other adapters; one failure never poisons the batch.
 */
export async function integrationFetch<T = unknown>(
  url: string,
  opts: IntegrationFetchOptions,
): Promise<IntegrationFetchResult<T>> {
  const started = performance.now()
  const retry = opts.retryOnNetworkError !== false

  let attempt = 0
  // At most 2 attempts total: one original + one retry on transport failure.
  const maxAttempts = retry ? 2 : 1

  while (attempt < maxAttempts) {
    attempt += 1
    try {
      const res = await doFetch(url, opts)
      const duration = Math.round(performance.now() - started)

      let text = ''
      try {
        text = await res.text()
      } catch {
        text = ''
      }

      if (!res.ok) {
        const error = `${opts.adapter} ${res.status}: ${summarize(text)}`
        logger.warn('Integration HTTP non-2xx', {
          action: 'integrationFetch',
          adapter: opts.adapter,
          method: opts.method,
          url,
          status: res.status,
          duration,
          attempt,
        })
        return { ok: false, status: res.status, error, body: text }
      }

      let data: T | undefined
      if (text.length > 0) {
        try {
          data = JSON.parse(text) as T
        } catch {
          // Non-JSON 2xx — leave data undefined, caller can read body if needed.
        }
      }

      if (duration > SLOW_THRESHOLD_MS) {
        logger.warn('Integration HTTP slow', {
          action: 'integrationFetch',
          adapter: opts.adapter,
          method: opts.method,
          url,
          status: res.status,
          duration,
        })
      } else {
        logger.debug('Integration HTTP ok', {
          action: 'integrationFetch',
          adapter: opts.adapter,
          method: opts.method,
          url,
          status: res.status,
          duration,
        })
      }

      return { ok: true, status: res.status, data, body: text }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const isLastAttempt = attempt >= maxAttempts
      const level = isLastAttempt ? 'warn' : 'debug'
      logger[level]('Integration HTTP transport error', {
        action: 'integrationFetch',
        adapter: opts.adapter,
        method: opts.method,
        url,
        attempt,
        willRetry: !isLastAttempt,
        error: message,
      })
      if (isLastAttempt) {
        return { ok: false, status: 0, error: `${opts.adapter}: ${message}` }
      }
      // Linear backoff: 150ms before retry.
      await new Promise((r) => setTimeout(r, 150))
    }
  }

  // Unreachable — the while loop always returns or throws.
  return { ok: false, status: 0, error: `${opts.adapter}: exhausted retries` }
}
