#!/usr/bin/env node
/**
 * Drift detector: reports slugs that exist in both `demo-data.ts` and
 * `sites/<slug>/`. If the same slug is authored in both places, they can
 * drift out of sync silently — the website serves from one, the fallback
 * serves from another.
 *
 * Exit 1 if any overlaps found (so CI can gate).
 *
 *   cli audit-duplicates           # report
 *   cli audit-duplicates --json    # machine-readable
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { DEMO_BUSINESSES, RELOCATION_DEMO_BUSINESSES } from '../lib/engine/demo-data'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')

const asJson = process.argv.includes('--json')

const demoSlugs = new Set<string>([
  ...Object.keys(DEMO_BUSINESSES),
  ...Object.keys(RELOCATION_DEMO_BUSINESSES),
])

const NON_TENANT_DIRS = new Set(['shared-images', '.archive'])
const tenantSlugs = new Set<string>(
  fs
    .readdirSync(SITES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !NON_TENANT_DIRS.has(d.name))
    .map((d) => d.name),
)

const overlaps = [...demoSlugs].filter((s) => tenantSlugs.has(s)).sort()
const demoOnly = [...demoSlugs].filter((s) => !tenantSlugs.has(s)).sort()
const tenantOnly = [...tenantSlugs].filter((s) => !demoSlugs.has(s)).sort()

if (asJson) {
  console.log(JSON.stringify({ overlaps, demoOnly, tenantOnly }, null, 2))
  process.exit(overlaps.length ? 1 : 0)
}

console.log(`\n=== Duplicate-slug audit ===\n`)

if (overlaps.length) {
  console.log(`⚠  ${overlaps.length} slug(s) authored in BOTH demo-data.ts and sites/:`)
  for (const s of overlaps) console.log(`     - ${s}`)
  console.log(`\n   These will drift. Canonical source should be sites/<slug>/.`)
  console.log(`   Delete the demo-data.ts entry once data-loader reads from sites/ directly.`)
} else {
  console.log(`✓ No overlaps between demo-data.ts and sites/.`)
}

console.log(`\n  Demo-only (fixtures, safe to archive): ${demoOnly.length}`)
for (const s of demoOnly) console.log(`     - ${s}`)
console.log(`\n  Tenant-only (live in sites/): ${tenantOnly.length}`)
for (const s of tenantOnly) console.log(`     - ${s}`)

process.exit(overlaps.length ? 1 : 0)
