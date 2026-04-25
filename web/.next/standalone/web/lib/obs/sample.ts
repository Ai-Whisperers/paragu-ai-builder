/**
 * Sampling predicates for hot-path logs.
 *
 * Errors and warnings always emit. Debug/info in tight loops should sample
 * so the log pipeline doesn't get flooded. This is intentionally simple:
 * a pure `Math.random` check. Good enough for "drop 99% of successful
 * per-query debug lines."
 *
 * Usage:
 *   if (shouldSample(0.01)) logger.debug('hot path', ctx)
 * or via logger options:
 *   logger.debug('hot path', ctx, { sample: 0.01 })
 */

export function shouldSample(rate: number): boolean {
  if (rate >= 1) return true
  if (rate <= 0) return false
  return Math.random() < rate
}

/**
 * Deterministic sampling by key — same key always lands in/out of the
 * sample. Useful for "sample N% of requests, but emit every log line for
 * the requests you picked" so you can trace one full lifecycle.
 */
export function shouldSampleKey(key: string, rate: number): boolean {
  if (rate >= 1) return true
  if (rate <= 0) return false
  // Simple non-crypto hash — djb2. Deterministic, fast, fine for sampling.
  let hash = 5381
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash + key.charCodeAt(i)) >>> 0
  }
  const bucket = (hash % 10_000) / 10_000
  return bucket < rate
}
