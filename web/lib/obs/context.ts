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

// AsyncLocalStorage lives in node:async_hooks. It's available in:
//   - Node.js server runtime (app routes, scripts, API handlers)
//   - Cloudflare Workers (nodejs_compat flag — set in wrangler.toml)
//   - Vitest + jsdom (the Node process running the tests)
// It is NOT available in the browser bundle. We can't key off `window`
// because jsdom defines `window` even though we're on Node; instead we
// probe the module itself inside a try/catch, which bundlers can
// statically analyze and strip from client builds.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let AsyncLocalStorage: any = null
let als: unknown = null

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const asyncHooks = require('node:async_hooks')
  AsyncLocalStorage = asyncHooks.AsyncLocalStorage
} catch {
  // Browser bundle — fall back to a pass-through (no context propagation).
  AsyncLocalStorage = null
}

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

function storage(): unknown {
  if (!als && AsyncLocalStorage) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor = AsyncLocalStorage as new () => any
    als = new Ctor()
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
  const store = storage()
  if (!store || typeof (store as { run?: unknown }).run !== 'function') {
    // Fallback: run without context if AsyncLocalStorage unavailable
    return fn()
  }
  return (store as { run: (store: LoggerStoreFields, fn: () => T) => T }).run({ ...seed }, fn)
}

/**
 * Read the current context, or undefined if we're outside a
 * withLoggerContext scope (top-level scripts, cold starts).
 */
export function getLoggerContext(): LoggerStoreFields | undefined {
  const store = storage()
  if (!store || typeof (store as { getStore?: () => unknown }).getStore !== 'function') {
    return undefined
  }
  return (store as { getStore: () => LoggerStoreFields | undefined }).getStore()
}

/**
 * Merge additional fields into the current scope. No-op if called outside
 * a withLoggerContext scope — callers should guard or rely on the logger's
 * fallback behaviour.
 */
export function extendLoggerContext(fields: LoggerStoreFields): void {
  const store = getLoggerContext()
  if (!store) return
  Object.assign(store, fields)
}
