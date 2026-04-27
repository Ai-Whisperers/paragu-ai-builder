/**
 * Metrics — Cloudflare Workers Analytics Engine writer.
 *
 * Analytics Engine is a time-series sink for cheap per-request events
 * (counters, latency histograms). Schema per write:
 *
 *   indexes: up to 1 — primary string dimension (e.g. route)
 *   blobs:   up to 20 strings — secondary dimensions (business_id, adapter)
 *   doubles: up to 20 floats  — metric values (duration_ms, count)
 *
 * Query via Cloudflare GraphQL Analytics API, or SQL:
 *   SELECT index1 AS route, avg(double1) AS p50, quantileWeighted(0.95)(double1, _sample_interval) AS p95
 *   FROM paragu_ai_metrics
 *   WHERE timestamp > now() - INTERVAL '1' HOUR
 *   GROUP BY index1
 *
 * The binding is resolved at request time from either:
 *   - `process.env.METRICS` when Workers injects the binding (production)
 *   - a passed-in binding via `setMetricsBinding()` (prefer this in tests)
 *
 * If no binding is available, all writes are no-ops — safe in local dev and
 * when running outside Workers (Node.js next dev, scripts, tests).
 */

import { logger } from '@/lib/logger'
import { getLoggerContext } from './context'

export interface AnalyticsEngineDataset {
  writeDataPoint(point: {
    indexes?: string[]
    blobs?: string[]
    doubles?: number[]
  }): void
}

let injectedBinding: AnalyticsEngineDataset | null = null

export function setMetricsBinding(binding: AnalyticsEngineDataset | null): void {
  injectedBinding = binding
}

function getBinding(): AnalyticsEngineDataset | null {
  if (injectedBinding) return injectedBinding
  // Workers injects bindings onto globalThis / process.env at runtime.
  const env = globalThis as unknown as { METRICS?: AnalyticsEngineDataset }
  return env.METRICS ?? null
}

/** Canonical metric names — keep the set small and queryable. */
export type MetricName =
  | 'lead.submitted'
  | 'lead.accepted'
  | 'lead.rejected'
  | 'integration.call'
  | 'compose.duration'
  | 'render.duration'
  | 'generation.step'
  | 'api.request'
  | 'cache.hit'
  | 'cache.miss'

export interface MetricDimensions {
  /** Primary index (one per dataset row). Usually the metric's owning entity. */
  primary?: string
  /** Secondary categorical labels (up to ~18 — we reserve a few for standard tags). */
  [key: string]: string | number | undefined
}

interface WriteOptions {
  /** Numeric observations — latency, counts, etc. Up to 20 per write. */
  values?: number[]
  /** Override auto-derived primary index (e.g. override route-based index with a business_id). */
  primary?: string
}

function limitArray<T>(arr: T[], max: number): T[] {
  return arr.length > max ? arr.slice(0, max) : arr
}

/**
 * Emit one data point to Analytics Engine. Safe to call from any request
 * scope. Never throws — on failure it downgrades to a debug log.
 *
 * Typical use:
 *   metrics.observe('integration.call', { adapter: 'hubspot', ok: 'true' }, { values: [duration] })
 *   metrics.inc('lead.accepted', { siteSlug: 'nexa-paraguay' })
 */
export function observe(
  name: MetricName,
  dims: MetricDimensions = {},
  options: WriteOptions = {},
): void {
  const binding = getBinding()
  if (!binding) {
    // Dev / tests — emit to debug log so engineers can still see events.
    logger.debug('Metrics no-op (no binding)', {
      action: 'metrics.observe',
      metric: name,
      ...dims,
    })
    return
  }

  try {
    const traceId = getLoggerContext()?.['trace.id'] as string | undefined
    const primary = options.primary ?? dims.primary ?? name

    // Collect dimension entries (excluding the primary) into the blobs slot.
    const blobEntries = Object.entries(dims)
      .filter(([k]) => k !== 'primary')
      .map(([k, v]) => `${k}=${v ?? ''}`)

    if (traceId) blobEntries.push(`trace.id=${traceId}`)
    blobEntries.push(`metric=${name}`)

    binding.writeDataPoint({
      indexes: [String(primary)],
      blobs: limitArray(blobEntries, 20),
      doubles: limitArray(options.values ?? [1], 20),
    })
  } catch (err) {
    logger.warn('Analytics Engine write failed', {
      action: 'metrics.observe',
      metric: name,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

/** Shorthand counter: `metrics.inc('lead.accepted', { adapter: 'hubspot' })`. */
export function inc(name: MetricName, dims: MetricDimensions = {}): void {
  observe(name, dims, { values: [1] })
}

/** Timing helper: `metrics.timing('compose.duration', 42, { type: 'peluqueria' })`. */
export function timing(
  name: MetricName,
  durationMs: number,
  dims: MetricDimensions = {},
): void {
  observe(name, dims, { values: [durationMs] })
}

export const metrics = { observe, inc, timing, setMetricsBinding }
