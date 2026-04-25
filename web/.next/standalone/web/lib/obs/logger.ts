/**
 * Structured logger — the only way runtime code should emit to stdout.
 *
 * Emits ECS-aligned JSON in production (one object per line) and pretty
 * ANSI output in development. Enriches every call with:
 *   - @timestamp
 *   - log.level
 *   - service.name / service.version
 *   - AsyncLocalStorage context (trace.id, user.id, labels.*)
 *
 * Runs PII scrubbing on every context object before emit (see redact.ts).
 * Honours LOG_LEVEL / LOG_FORMAT env vars.
 *
 * The old `lib/logger.ts` exports (`logger`, `createRequestLogger`,
 * `createPerformanceTracker`, `LogLevel`, `LogContext`) are re-exported
 * unchanged from `lib/logger.ts` as thin shims around this module, so
 * existing call sites work without edits.
 */

// This is the only file in runtime code allowed to call console.* — the
// eslint `no-console` rule excludes this path (see eslint.config.mjs).

import { sanitizeContext, sanitizeMessage } from './redact'
import { getLoggerContext } from './context'
import { shouldSample } from './sample'
import { correlationFromRequest } from './request-id'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  // --- ECS-aligned keys (preferred for new code) ---
  '@timestamp'?: string
  'log.level'?: LogLevel
  'trace.id'?: string
  'span.id'?: string
  'event.action'?: string
  'event.category'?: string
  'event.outcome'?: 'success' | 'failure'
  'http.method'?: string
  'http.status'?: number
  'http.duration'?: number
  'url.path'?: string
  'user.id'?: string
  'client.ip'?: string
  'labels.business_id'?: string
  'labels.business_type'?: string
  'labels.business_slug'?: string
  'labels.site_slug'?: string
  'labels.locale'?: string

  // --- Legacy keys (still accepted; aliased at emit time) ---
  requestId?: string
  method?: string
  path?: string
  duration?: number
  durationMs?: number
  statusCode?: number
  businessId?: string
  businessType?: string
  businessSlug?: string
  siteSlug?: string
  userId?: string
  locale?: string
  generationId?: string
  action?: string
  resourceType?: string
  resourceId?: string
  ip?: string
  [key: string]: unknown
}

export interface LogOptions {
  /** Sampling rate 0-1. Always emits for warn/error regardless. */
  sample?: number
}

interface LogEntry {
  '@timestamp': string
  'log.level': LogLevel
  message: string
  'service.name': string
  'service.version'?: string
  error?: { name: string; message: string; stack?: string }
  [key: string]: unknown
}

const LOG_LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
}
const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'

const SERVICE_NAME = process.env.SERVICE_NAME || 'paragu-ai-builder'
const SERVICE_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION ||
  process.env.NEXT_PUBLIC_COMMIT_SHA ||
  undefined

function getLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) return envLevel
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}

function isJsonFormat(): boolean {
  if (process.env.LOG_FORMAT === 'json') return true
  if (process.env.LOG_FORMAT === 'pretty') return false
  return process.env.NODE_ENV === 'production'
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getLogLevel()]
}

function serializeError(error: unknown): LogEntry['error'] | undefined {
  if (!error) return undefined
  if (error instanceof Error) {
    return {
      name: error.name,
      message: sanitizeMessage(error.message),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }
  }
  if (typeof error === 'string') return { name: 'Error', message: sanitizeMessage(error) }
  return { name: 'Error', message: sanitizeMessage(String(error)) }
}

/**
 * Canonical ECS keys. When a legacy key is provided, we copy its value under
 * the ECS name too (keeping the old key so existing dashboards/grep still
 * work). This makes the migration a no-op for readers.
 */
const LEGACY_TO_ECS: Record<string, string> = {
  requestId: 'trace.id',
  method: 'http.method',
  path: 'url.path',
  statusCode: 'http.status',
  duration: 'http.duration',
  durationMs: 'http.duration',
  businessId: 'labels.business_id',
  businessType: 'labels.business_type',
  businessSlug: 'labels.business_slug',
  siteSlug: 'labels.site_slug',
  userId: 'user.id',
  locale: 'labels.locale',
  ip: 'client.ip',
  action: 'event.action',
}

function aliasLegacyKeys(ctx: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...ctx }
  for (const [legacy, canonical] of Object.entries(LEGACY_TO_ECS)) {
    if (out[legacy] !== undefined && out[canonical] === undefined) {
      out[canonical] = out[legacy]
    }
  }
  return out
}

function buildEntry(
  level: LogLevel,
  message: string,
  contextOrError?: LogContext | Error | unknown,
): LogEntry {
  let context: Record<string, unknown> | undefined
  let error: LogEntry['error'] | undefined

  if (contextOrError instanceof Error) {
    error = serializeError(contextOrError)
  } else if (contextOrError && typeof contextOrError === 'object') {
    const { error: ctxError, ...rest } = contextOrError as LogContext & { error?: unknown }
    context = Object.keys(rest).length > 0 ? (rest as Record<string, unknown>) : undefined
    if (ctxError !== undefined) error = serializeError(ctxError)
  }

  // Merge ALS store (trace.id, user.id, labels.*) beneath per-call fields.
  const storeFields = getLoggerContext()
  const merged: Record<string, unknown> = {
    ...(storeFields || {}),
    ...(context || {}),
  }
  const aliased = aliasLegacyKeys(merged)
  const sanitized = sanitizeContext(aliased)

  const entry: LogEntry = {
    '@timestamp': new Date().toISOString(),
    'log.level': level,
    message: sanitizeMessage(message),
    'service.name': SERVICE_NAME,
    ...(SERVICE_VERSION ? { 'service.version': SERVICE_VERSION } : {}),
    ...(sanitized || {}),
    ...(error ? { error } : {}),
  }

  return entry
}

function formatPretty(entry: LogEntry): string {
  const { message, error } = entry
  const level = entry['log.level'] as LogLevel
  const ts = entry['@timestamp'] as string
  const color = LEVEL_COLORS[level]
  const time = new Date(ts).toLocaleTimeString()

  let output = `${DIM}${time}${RESET} ${color}${BOLD}${level.toUpperCase().padEnd(5)}${RESET} ${message}`

  const traceId = entry['trace.id'] as string | undefined
  const method = entry['http.method'] as string | undefined
  const path = entry['url.path'] as string | undefined
  const httpDuration = entry['http.duration'] as number | undefined
  const action = entry['event.action'] as string | undefined
  const bizId = entry['labels.business_id'] as string | undefined
  const siteSlug = entry['labels.site_slug'] as string | undefined

  const parts: string[] = []
  if (traceId) parts.push(`req=${String(traceId).slice(0, 8)}`)
  if (bizId) parts.push(`biz=${String(bizId).slice(0, 8)}`)
  if (siteSlug) parts.push(`site=${siteSlug}`)
  if (method && path) parts.push(`${method} ${path}`)
  if (httpDuration !== undefined) parts.push(`${httpDuration}ms`)
  if (action) parts.push(`action=${action}`)

  if (parts.length > 0) output += ` ${DIM}[${parts.join(' | ')}]${RESET}`

  // Remaining non-trivial fields (drop the ones we already pretty-printed).
  const pretty = new Set([
    '@timestamp', 'log.level', 'message', 'service.name', 'service.version',
    'trace.id', 'event.action',
    'http.method', 'url.path', 'http.duration',
    'labels.business_id', 'labels.site_slug', 'error',
  ])
  const extras: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(entry)) {
    if (!pretty.has(k)) extras[k] = v
  }
  if (Object.keys(extras).length > 0) {
    output += `\n  ${DIM}${JSON.stringify(extras)}${RESET}`
  }

  if (error) {
    output += `\n  ${color}${error.name}: ${error.message}${RESET}`
    if (error.stack) {
      output += `\n${DIM}${error.stack.split('\n').slice(1, 4).join('\n')}${RESET}`
    }
  }

  return output
}

function emit(level: LogLevel, entry: LogEntry): void {
  const output = isJsonFormat() ? JSON.stringify(entry) : formatPretty(entry)
  switch (level) {
    case 'error':
      console.error(output)
      break
    case 'warn':
      console.warn(output)
      break
    default:
      console.log(output)
  }
}

function log(
  level: LogLevel,
  message: string,
  contextOrError?: LogContext | Error | unknown,
  options?: LogOptions,
): void {
  if (!shouldLog(level)) return
  // Sampling only applies to debug/info — warn/error always emit.
  if (options?.sample !== undefined && level !== 'warn' && level !== 'error') {
    if (!shouldSample(options.sample)) return
  }
  const entry = buildEntry(level, message, contextOrError)
  emit(level, entry)
}

export const logger = {
  debug: (message: string, context?: LogContext, options?: LogOptions) =>
    log('debug', message, context, options),
  info: (message: string, context?: LogContext, options?: LogOptions) =>
    log('info', message, context, options),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, contextOrError?: LogContext | Error) =>
    log('error', message, contextOrError),
}

/**
 * Build a request-scoped logger that automatically merges request context
 * (trace.id, http.method, url.path, client.ip) into every call. Prefer
 * `withRequestLog` (lib/api/with-request-log) which also wraps in ALS.
 *
 * Kept for parity with the pre-refactor API.
 */
export function createRequestLogger(
  request: Request,
  additionalContext?: Partial<LogContext>,
): typeof logger & { requestId: string } {
  const url = new URL(request.url)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    undefined

  const correlation = correlationFromRequest(request)

  const baseContext: LogContext = {
    'trace.id': correlation.traceId,
    'span.id': correlation.spanId,
    'http.method': request.method,
    'url.path': url.pathname,
    'client.ip': ip,
    ...additionalContext,
  }

  return {
    debug: (message: string, context?: LogContext, options?: LogOptions) =>
      log('debug', message, { ...baseContext, ...context }, options),
    info: (message: string, context?: LogContext, options?: LogOptions) =>
      log('info', message, { ...baseContext, ...context }, options),
    warn: (message: string, context?: LogContext) =>
      log('warn', message, { ...baseContext, ...context }),
    error: (message: string, contextOrError?: LogContext | Error) => {
      if (contextOrError instanceof Error) {
        log('error', message, { ...baseContext, error: contextOrError })
      } else {
        log('error', message, { ...baseContext, ...contextOrError })
      }
    },
    requestId: correlation.traceId,
  }
}

export function createPerformanceTracker(requestId: string) {
  const startTime = performance.now()
  const checkpoints: { name: string; time: number }[] = []
  const slowThreshold = parseInt(process.env.SLOW_REQUEST_THRESHOLD_MS || '1000', 10)

  return {
    checkpoint(name: string): void {
      checkpoints.push({ name, time: Math.round(performance.now() - startTime) })
    },
    finish(context: LogContext = {}): number {
      const totalDuration = Math.round(performance.now() - startTime)
      const logContext: LogContext = {
        'trace.id': requestId,
        'http.duration': totalDuration,
        ...context,
      }
      if (checkpoints.length > 1) logContext.checkpoints = checkpoints

      if (totalDuration > slowThreshold) {
        logger.warn('Slow request detected', logContext)
      } else {
        logger.debug('Request completed', logContext)
      }
      return totalDuration
    },
    checkpoints,
  }
}
