/**
 * Request-ID correlation helpers.
 *
 * Honors upstream correlation so distributed traces don't get reset at
 * every hop. Priority order when picking an ID for a new request:
 *   1. `x-request-id`          — the de facto standard
 *   2. `x-correlation-id`      — common in enterprise / AWS
 *   3. `traceparent` (W3C)     — OpenTelemetry-native; parse the trace-id
 *   4. generate UUIDv4         — fallback when no upstream header
 *
 * We also surface a `span.id` when we can lift one from `traceparent`,
 * so downstream fetch calls can continue a trace rather than starting one.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// traceparent: 00-<trace-id:32hex>-<parent-id:16hex>-<flags:2hex>
const TRACEPARENT_RE = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/

function isNonTrivialId(value: string | null | undefined): value is string {
  if (!value) return false
  const trimmed = value.trim()
  if (trimmed.length === 0) return false
  if (trimmed.length > 128) return false // cap absurd values
  // Reject obvious garbage but accept reasonable shapes (UUID, hex, simple alnum).
  return /^[A-Za-z0-9._~:-]+$/.test(trimmed)
}

export interface RequestCorrelation {
  traceId: string
  /** Parent span id, if derived from a W3C traceparent header. */
  spanId?: string
  /** How the traceId was sourced — useful for debugging prop issues. */
  source: 'x-request-id' | 'x-correlation-id' | 'traceparent' | 'generated'
}

/**
 * Extract a correlation id from an inbound Request (or Headers). Never
 * throws; falls back to a generated UUID.
 */
export function correlationFromRequest(
  input: Request | Headers,
): RequestCorrelation {
  const headers = input instanceof Headers ? input : input.headers

  const upstreamRequestId = headers.get('x-request-id')
  if (isNonTrivialId(upstreamRequestId)) {
    return { traceId: upstreamRequestId.trim(), source: 'x-request-id' }
  }

  const upstreamCorrelation = headers.get('x-correlation-id')
  if (isNonTrivialId(upstreamCorrelation)) {
    return { traceId: upstreamCorrelation.trim(), source: 'x-correlation-id' }
  }

  const traceparent = headers.get('traceparent')
  if (traceparent) {
    const m = TRACEPARENT_RE.exec(traceparent.trim())
    if (m) {
      return {
        traceId: m[2],
        spanId: m[3],
        source: 'traceparent',
      }
    }
  }

  return { traceId: generateTraceId(), source: 'generated' }
}

/**
 * Generate a trace id suitable as a standalone x-request-id value. Uses
 * crypto.randomUUID when available (Node 19+, Workers, modern browsers),
 * falls back to a 32-char hex string derived from Math.random otherwise.
 */
export function generateTraceId(): string {
  const c: { randomUUID?: () => string } | undefined =
    typeof crypto !== 'undefined' ? (crypto as { randomUUID?: () => string }) : undefined
  if (c?.randomUUID) return c.randomUUID()
  // Fallback — not cryptographically strong but unique enough for correlation.
  const rand = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')
  return `${rand()}${rand()}-${rand()}-${rand()}-${rand()}-${rand()}${rand()}${rand()}`
}

/**
 * Build a W3C traceparent header to propagate into downstream fetch calls.
 */
export function toTraceparent(traceId: string, spanId?: string): string {
  const hex32 = traceId.replace(/-/g, '').padEnd(32, '0').slice(0, 32)
  const hex16 = (spanId ?? generateSpanId()).replace(/-/g, '').padEnd(16, '0').slice(0, 16)
  return `00-${hex32}-${hex16}-01`
}

function generateSpanId(): string {
  const rand = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')
  return `${rand()}${rand()}${rand()}${rand()}`
}

export { UUID_RE }
