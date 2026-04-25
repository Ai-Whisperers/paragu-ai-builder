/**
 * Durable generation event logger.
 *
 * Writes a row to `generation_logs` so operators can query generation
 * outcomes from Supabase without tailing Workers logs. Always also logs
 * to stdout via the structured logger — DB persistence is best-effort.
 *
 * `site_id` and `business_id` are required by the `generation_logs` schema.
 * Callers without a site_id should use `logger` directly instead of this
 * helper (stdout is still captured by Cloudflare Workers logs).
 */
import { logger } from '@/lib/logger'

export type GenerationStep =
  | 'validate'
  | 'load-registry'
  | 'load-content'
  | 'compose'
  | 'resolve-tokens'
  | 'render'
  | 'persist'
  | 'publish'

export type GenerationStatus = 'started' | 'completed' | 'failed'

export interface GenerationEvent {
  businessId: string
  siteId: string
  step: GenerationStep
  status: GenerationStatus
  durationMs?: number
  error?: string
  metadata?: Record<string, unknown>
}

export async function recordGenerationEvent(event: GenerationEvent): Promise<void> {
  const { businessId, siteId, step, status, durationMs, error, metadata } = event

  if (status === 'failed') {
    logger.error('Generation event: failed', {
      action: 'recordGenerationEvent',
      businessId,
      siteId,
      step,
      durationMs,
      error,
      ...metadata,
    })
  } else {
    logger.info(`Generation event: ${status}`, {
      action: 'recordGenerationEvent',
      businessId,
      siteId,
      step,
      durationMs,
      ...metadata,
    })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || url.includes('placeholder') || !key) {
    // Supabase not configured — stdout is the only sink.
    return
  }

  try {
    const res = await fetch(`${url}/rest/v1/generation_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        site_id: siteId,
        business_id: businessId,
        step,
        status,
        duration_ms: durationMs ?? null,
        error: error ?? null,
        metadata: metadata ?? null,
      }),
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) {
      const text = await res.text()
      logger.warn('generation_logs insert rejected', {
        action: 'recordGenerationEvent',
        businessId,
        siteId,
        step,
        httpStatus: res.status,
        detail: text.slice(0, 200),
      })
    }
  } catch (err) {
    logger.warn('generation_logs insert threw — event dropped', {
      action: 'recordGenerationEvent',
      businessId,
      siteId,
      step,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
