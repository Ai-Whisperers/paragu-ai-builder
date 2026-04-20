/**
 * Request-scoped logger context via AsyncLocalStorage.
 *
 * Instead of threading `requestId` / `businessId` / `userId` through every
 * function call, handlers set the context once per request and nested code
 * reads it implicitly:
 *
 *   withLoggerContext({ 'trace.id': id, 'user.id': uid }, async () => {
 *     await doWork()   // anything inside can logger.info() without passing ctx
 *   })
 *
 * Works in both Node.js (app routes, scripts) and Cloudflare Workers
 * (compat flag `nodejs_compat` is already enabled in wrangler.toml).
 */

import { AsyncLocalStorage } from 'node:async_hooks'

/**
 * Top-level enrichment keys the logger auto-merges into every emit.
 * Kept intentionally narrow — nested context belongs in the per-call arg.
 */
export interface LoggerStoreFields {
  'trace.id'?: string
  'span.id'?: string
  'user.id'?: string
  'labels.business_id'?: string
  'labels.business_slug'?: string
  'labels.business_type'?: string
  'labels.site_slug'?: string
  'labels.locale'?: string
  'http.method'?: string
  'url.path'?: string
  'client.ip'?: string
  [key: string]: unknown
}

let als: AsyncLocalStorage<LoggerStoreFields> | null = null

function storage(): AsyncLocalStorage<LoggerStoreFields> {
  if (!als) {
    als = new AsyncLocalStorage<LoggerStoreFields>()
  }
  return als
}

/**
 * Run a function with a seeded logger context. Nested calls pick up the
 * store transparently; they may extend it with `extendLoggerContext()`.
 */
export function withLoggerContext<T>(
  seed: LoggerStoreFields,
  fn: () => T,
): T {
  return storage().run({ ...seed }, fn)
}

/**
 * Read the current context, or undefined if we're outside a
 * withLoggerContext scope (top-level scripts, cold starts).
 */
export function getLoggerContext(): LoggerStoreFields | undefined {
  return storage().getStore()
}

/**
 * Merge additional fields into the current scope. No-op if called outside
 * a withLoggerContext scope — callers should guard or rely on the logger's
 * fallback behaviour.
 */
export function extendLoggerContext(fields: LoggerStoreFields): void {
  const store = storage().getStore()
  if (!store) return
  Object.assign(store, fields)
}
