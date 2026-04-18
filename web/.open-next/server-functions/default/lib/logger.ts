/**
 * Centralized Logger
 *
 * Adapted from Vete (ai-whisperers/vete) - stripped external services,
 * kept core structured logging + audit + performance tracking.
 *
 * Features:
 * - Structured JSON logging in production
 * - Pretty console output in development
 * - Request context (request ID, business, user)
 * - Performance tracking with checkpoints
 * - Audit logging for generation events
 *
 * Usage:
 *   import { logger, createRequestLogger } from '@/lib/logger'
 *   logger.info('Server started', { port: 3000 })
 *   const log = createRequestLogger(request)
 *   log.info('Generating site', { businessType: 'peluqueria' })
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  requestId?: string
  method?: string
  path?: string
  duration?: number
  statusCode?: number
  businessId?: string
  businessType?: string
  generationId?: string
  action?: string
  resourceType?: string
  resourceId?: string
  ip?: string
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: { name: string; message: string; stack?: string }
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

function serializeError(error: unknown): LogEntry['error'] | undefined {
  if (!error) return undefined
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }
  }
  if (typeof error === 'string') return { name: 'Error', message: error }
  return { name: 'Error', message: String(error) }
}

function formatPretty(entry: LogEntry): string {
  const { level, message, context, error } = entry
  const color = LEVEL_COLORS[level]
  const time = new Date(entry.timestamp).toLocaleTimeString()

  let output = `${DIM}${time}${RESET} ${color}${BOLD}${level.toUpperCase().padEnd(5)}${RESET} ${message}`

  if (context) {
    const { requestId, businessId, businessType, generationId, method, path, duration, action, ...rest } = context
    const parts: string[] = []
    if (requestId) parts.push(`req=${requestId.slice(0, 8)}`)
    if (businessId) parts.push(`biz=${businessId.slice(0, 8)}`)
    if (businessType) parts.push(`type=${businessType}`)
    if (generationId) parts.push(`gen=${generationId.slice(0, 8)}`)
    if (method && path) parts.push(`${method} ${path}`)
    if (duration !== undefined) parts.push(`${duration}ms`)
    if (action) parts.push(`action=${action}`)

    if (parts.length > 0) output += ` ${DIM}[${parts.join(' | ')}]${RESET}`
    if (Object.keys(rest).length > 0) output += `\n  ${DIM}${JSON.stringify(rest)}${RESET}`
  }

  if (error) {
    output += `\n  ${color}${error.name}: ${error.message}${RESET}`
    if (error.stack) {
      output += `\n${DIM}${error.stack.split('\n').slice(1, 4).join('\n')}${RESET}`
    }
  }

  return output
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getLogLevel()]
}

function log(level: LogLevel, message: string, contextOrError?: LogContext | Error | unknown): void {
  if (!shouldLog(level)) return

  let context: LogContext | undefined
  let error: LogEntry['error'] | undefined

  if (contextOrError instanceof Error) {
    error = serializeError(contextOrError)
  } else if (contextOrError && typeof contextOrError === 'object') {
    const { error: ctxError, ...rest } = contextOrError as LogContext & { error?: unknown }
    context = Object.keys(rest).length > 0 ? rest : undefined
    error = serializeError(ctxError)
  }

  const entry: LogEntry = { timestamp: new Date().toISOString(), level, message, context, error }
  const output = isJsonFormat() ? JSON.stringify(entry) : formatPretty(entry)

  switch (level) {
    case 'error':
      console.error(output)
      break
    case 'warn':
      console.warn(output)
      break
    default:
      // eslint-disable-next-line no-console
      console.log(output)
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, contextOrError?: LogContext | Error) => log('error', message, contextOrError),
}

export function createRequestLogger(
  request: Request,
  additionalContext?: Partial<LogContext>
): typeof logger & { requestId: string } {
  const url = new URL(request.url)
  const requestId = crypto.randomUUID()

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    undefined

  const baseContext: LogContext = {
    requestId,
    method: request.method,
    path: url.pathname,
    ip,
    ...additionalContext,
  }

  return {
    debug: (message: string, context?: LogContext) => log('debug', message, { ...baseContext, ...context }),
    info: (message: string, context?: LogContext) => log('info', message, { ...baseContext, ...context }),
    warn: (message: string, context?: LogContext) => log('warn', message, { ...baseContext, ...context }),
    error: (message: string, contextOrError?: LogContext | Error) => {
      if (contextOrError instanceof Error) {
        log('error', message, { ...baseContext, error: contextOrError })
      } else {
        log('error', message, { ...baseContext, ...contextOrError })
      }
    },
    requestId,
  }
}

/**
 * Performance tracker for request timing
 */
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
      const logContext: LogContext = { requestId, duration: totalDuration, ...context }
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
