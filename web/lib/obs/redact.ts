/**
 * Context redaction — runs on every log emit before serialization.
 *
 * Philosophy: allowlist the known-safe keys, pattern-check the rest.
 * Allowed keys pass through as-is (after string-length truncation).
 * Other keys are retained but their string values are scrubbed of:
 *   - email addresses              → [redacted:email]
 *   - bearer tokens / JWTs         → [redacted:token]
 *   - credit cards (Luhn-shaped)   → [redacted:card]
 *   - blocklist substrings in key  → [redacted]
 *
 * This is belt-and-suspenders: code reviewers enforce discipline, but if
 * someone does `log.info('lead', { lead })` we don't ship a production
 * leak. Runs once per log call — tight loop is fine.
 */

const MAX_STRING_LEN = 1024
const MAX_ARRAY_LEN = 50
const MAX_DEPTH = 6

// Keys whose values we always pass through (after length cap). These are the
// shapes logger.ts + withRequestLog + metrics emit.
const SAFE_KEYS = new Set([
  // ECS-aligned
  'message',
  'level',
  '@timestamp',
  'trace.id',
  'span.id',
  'transaction.id',
  'event.action',
  'event.category',
  'event.outcome',
  'http.method',
  'http.status',
  'http.duration',
  'url.path',
  'url.full',
  'user.id',
  'user_agent',
  'client.ip',
  'service.name',
  'service.version',
  // Our domain labels
  'labels.business_id',
  'labels.business_type',
  'labels.business_slug',
  'labels.site_slug',
  'labels.locale',
  'labels.vertical',
  'labels.page_type',
  'labels.page_slug',
  'labels.section_id',
  'labels.section_type',
  'labels.adapter',
  'labels.step',
  'labels.source',
  'labels.storage_key',
  // Backwards-compat / legacy shapes still emitted by some callers
  'requestId',
  'method',
  'path',
  'duration',
  'durationMs',
  'statusCode',
  'httpStatus',
  'businessId',
  'businessType',
  'businessSlug',
  'siteSlug',
  'userId',
  'locale',
  'vertical',
  'pageType',
  'pageSlug',
  'sectionId',
  'sectionType',
  'adapter',
  'step',
  'source',
  'generationId',
  'action',
  'resourceType',
  'resourceId',
  'ip',
  'storageKey',
  'rowCount',
  'count',
  'total',
  'table',
  'operation',
  'attempt',
  'willRetry',
  'checkpoints',
  'status',
  'deep',
  'checkCount',
  'env',
  'slugCount',
  'urlCount',
  'leadId',
  'userEmail', // see below — still runs through sanitizer
  'index',
])

// Substrings that force a value to be scrubbed regardless of shape.
// Checked case-insensitive on the full dotted key path.
const SENSITIVE_KEY_PATTERNS = [
  'password',
  'passwd',
  'secret',
  'token',
  'auth',
  'cookie',
  'session',
  'apikey',
  'api_key',
  'api-key',
  'service_role_key',
  'dsn',
  'private',
  'credential',
  'authorization',
]

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi
const JWT_RE = /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g
const BEARER_RE = /Bearer\s+[A-Za-z0-9._~+/=-]{20,}/gi
const CARD_RE = /\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g

function isSensitiveKey(keyPath: string): boolean {
  const lower = keyPath.toLowerCase()
  return SENSITIVE_KEY_PATTERNS.some((p) => lower.includes(p))
}

function scrubString(value: unknown): string {
  if (typeof value !== 'string' || !value) return String(value ?? '')
  return value
    .replace(JWT_RE, '[redacted:token]')
    .replace(BEARER_RE, '[redacted:bearer]')
    .replace(EMAIL_RE, '[redacted:email]')
    .replace(CARD_RE, '[redacted:card]')
}

function truncateString(value: unknown): string {
  const s = typeof value === 'string' ? value : String(value ?? '')
  return s.length > MAX_STRING_LEN
    ? s.slice(0, MAX_STRING_LEN) + `…[+${s.length - MAX_STRING_LEN}]`
    : s
}

function redactValue(value: unknown, keyPath: string, depth: number): unknown {
  if (value === null || value === undefined) return value

  if (isSensitiveKey(keyPath)) {
    return '[redacted]'
  }

  if (depth > MAX_DEPTH) return '[redacted:max-depth]'

  if (typeof value === 'string') {
    const scrubbed = scrubString(value)
    return truncateString(scrubbed)
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (value instanceof Date) return value.toISOString()

  if (value instanceof Error) {
    return {
      name: value.name,
      message: scrubString(truncateString(value.message)),
    }
  }

  if (Array.isArray(value)) {
    const capped = value.slice(0, MAX_ARRAY_LEN)
    const out = capped.map((v, i) => redactValue(v, `${keyPath}[${i}]`, depth + 1))
    if (value.length > MAX_ARRAY_LEN) {
      out.push(`[+${value.length - MAX_ARRAY_LEN} more]`)
    }
    return out
  }

  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const nestedPath = keyPath ? `${keyPath}.${k}` : k
      out[k] = redactValue(v, nestedPath, depth + 1)
    }
    return out
  }

  return '[redacted:unknown-type]'
}

/**
 * Sanitize a LogContext-shaped object for emission.
 *
 * Safe keys pass through (length-capped). Other keys have their string values
 * scrubbed of PII patterns, tokens, and long payloads. Sensitive key names
 * (password, token, apikey, etc.) are always masked regardless of value.
 */
export function sanitizeContext(
  context: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!context) return undefined
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(context)) {
    if (value === undefined) continue
    if (SAFE_KEYS.has(key)) {
      if (typeof value === 'string') {
        // Even safe keys get pattern-scrubbed in case someone dropped a token
        // into the message body.
        out[key] = truncateString(scrubString(value))
      } else {
        out[key] = redactValue(value, key, 0)
      }
    } else {
      out[key] = redactValue(value, key, 0)
    }
  }
  return out
}

/**
 * Scrub a freeform message string — useful at log-call time so callers
 * don't have to remember to wrap interpolated values.
 */
export function sanitizeMessage(message: string): string {
  return truncateString(scrubString(message))
}
