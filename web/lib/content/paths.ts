/**
 * Path resolution for bundled JSON content (schemas, tokens, registry, content).
 *
 * The JSON lives in `<repo>/src/*`. Next.js always invokes the app with
 * `process.cwd()` equal to the `web/` directory (both `next dev` and
 * `next build` chdir there), so we anchor there and walk up one level to
 * reach the repo root — this matches the original loader's behavior and
 * survives Turbopack bundling, where `__dirname` would point into the
 * emitted chunk rather than the source tree.
 *
 * `PARAGU_REPO_ROOT` env overrides the anchor for unusual invocations
 * (e.g. a `tsx` script run from the repo root or a test harness).
 */

import { resolve } from 'path'

function computeRepoRoot(): string {
  if (process.env.PARAGU_REPO_ROOT) return process.env.PARAGU_REPO_ROOT
  return resolve(process.cwd(), '..')
}

const REPO_ROOT = computeRepoRoot()

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
