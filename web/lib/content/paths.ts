/**
 * Path resolution for bundled JSON content (schemas, tokens, registry, content).
 *
 * The JSON lives in `<repo>/src/*`. This module resolves those paths
 * relative to this file rather than `process.cwd()`, so loads succeed
 * regardless of where `next` / `tsx` is invoked from.
 */

import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Handle both CJS (__dirname) and ESM (import.meta.url) runtimes.
const here =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))

// web/lib/content → repo root
const REPO_ROOT = resolve(here, '..', '..', '..')

export const CONTENT_ROOTS = {
  schemas: resolve(REPO_ROOT, 'src/schemas'),
  tokens: resolve(REPO_ROOT, 'src/tokens'),
  registry: resolve(REPO_ROOT, 'src/registry'),
  content: resolve(REPO_ROOT, 'src/content'),
} as const

export type ContentDomain = keyof typeof CONTENT_ROOTS

export function contentPath(domain: ContentDomain, file: string): string {
  return resolve(CONTENT_ROOTS[domain], file)
}
