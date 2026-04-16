/**
 * Typed + validated JSON content loader.
 *
 * Wraps `fs.readFileSync` with Zod validation so the engine fails loudly
 * if a token/registry/content file drifts from its schema, rather than
 * propagating `undefined`s into the render pipeline.
 *
 * Results are memoized per absolute path — JSON content is build-time
 * static and reread-on-every-request was only costing latency.
 */

import 'server-only'
import { readFileSync } from 'fs'
import type { ZodType } from 'zod'
import { contentPath, type ContentDomain } from './paths'

const cache = new Map<string, unknown>()

function readJson(absPath: string): unknown {
  const cached = cache.get(absPath)
  if (cached !== undefined) return cached
  const raw = readFileSync(absPath, 'utf-8')
  const parsed: unknown = JSON.parse(raw)
  cache.set(absPath, parsed)
  return parsed
}

export function loadContent<T>(
  domain: ContentDomain,
  file: string,
  schema: ZodType<T>
): T {
  const absPath = contentPath(domain, file)
  const parsed = readJson(absPath)
  const result = schema.safeParse(parsed)
  if (!result.success) {
    throw new Error(
      `[content/loader] Validation failed for ${domain}/${file}: ${result.error.message}`
    )
  }
  return result.data
}

/** Testing hook — resets the cache between tests. */
export function __resetContentCache(): void {
  cache.clear()
}
