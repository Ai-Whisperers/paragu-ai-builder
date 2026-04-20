/**
 * Logger shim — the implementation moved to `lib/obs/logger.ts`.
 *
 * This file stays so existing imports `from '@/lib/logger'` continue to
 * work without a repo-wide rename. New code should import from
 * `@/lib/obs/logger` or — when adding route handlers — use the
 * `withRequestLog` wrapper from `@/lib/api/with-request-log`.
 *
 * See `docs/DEBUGGING.md` for the full observability reference.
 */

export {
  logger,
  createRequestLogger,
  createPerformanceTracker,
} from './obs/logger'
export type { LogLevel, LogContext, LogOptions } from './obs/logger'
