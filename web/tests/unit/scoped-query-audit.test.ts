import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join, sep } from 'node:path'

/**
 * Multi-tenant safety test.
 *
 * Tables that hold per-business data MUST be accessed via scopedQueries()
 * (see lib/supabase/scoped.ts), which injects `.eq('business_id', ...)`
 * on every operation. A raw `supabase.from('site_pages').select(...)` call
 * elsewhere would leak data across tenants.
 *
 * This test greps the source for raw `.from('<tenant_table>')` usage outside
 * the scoped helper itself. If you add a new tenant table, extend the
 * TENANT_TABLES list below.
 */

const TENANT_TABLES = [
  'site_pages',
  'site_assets',
  'generated_sites',
  'generation_logs',
]

const ALLOWED_FILES = [
  // The scoped helper itself is the one place raw calls are legitimate.
  /lib\/supabase\/scoped\.ts$/,
  // Admin-only diagnostics endpoint reads across tenants intentionally.
  /app\/api\/diagnostics\/route\.ts$/,
]

const webRoot = resolve(__dirname, '..', '..')

const SKIP_DIRS = new Set(['.open-next', 'node_modules', '.next', 'dist', 'out'])

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walk(full, out)
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(full)
    }
  }
  return out
}

function readSources(): Array<{ path: string; content: string }> {
  const dirs = ['app', 'lib', 'components'].map((d) => resolve(webRoot, d))
  const files = dirs.flatMap((d) => walk(d))
  return files.map((path) => ({ path, content: readFileSync(path, 'utf8') }))
}

describe('multi-tenant query discipline', () => {
  const sources = readSources()

  for (const table of TENANT_TABLES) {
    it(`never calls .from('${table}') outside scopedQueries`, () => {
      const pattern = new RegExp(String.raw`\.from\(\s*['"\`]${table}['"\`]`)
      const violations: string[] = []

      for (const { path, content } of sources) {
        if (ALLOWED_FILES.some((rx) => rx.test(path))) continue
        if (pattern.test(content)) {
          const lines = content.split('\n')
          lines.forEach((line, idx) => {
            if (pattern.test(line)) {
              violations.push(`${path}:${idx + 1} — ${line.trim()}`)
            }
          })
        }
      }

      expect(violations, `Use scopedQueries() for '${table}'. Offenders:\n${violations.join('\n')}`).toEqual([])
    })
  }
})
