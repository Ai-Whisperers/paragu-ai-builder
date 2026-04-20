#!/usr/bin/env node
/**
 * Legal-review gate. In regulation: high verticals (real-estate-relocation,
 * finance-insurance, death-care, health-wellness), each tenant locale must
 * declare `_meta.reviewedBy` naming the attorney or compliance officer who
 * signed off, or `_meta.reviewStatus = "pending"`.
 *
 * Prod deploys of `pending` tenants fail. Staging deploys just warn.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')
const CATALOG = path.join(ROOT, 'src/verticals/catalog.json')

const HIGH_REGULATION = new Set(['high', 'very-high'])

interface Tenant {
  slug: string
  vertical?: string
  domain?: string
  locales?: string[]
}

const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf-8')) as {
  verticals: Record<string, { regulation?: string }>
}

const tenantDirs = fs
  .readdirSync(SITES, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !['shared-images', '.archive'].includes(d.name))
  .map((d) => d.name)

interface Violation {
  slug: string
  locale: string
  reason: string
}

const violations: Violation[] = []

for (const slug of tenantDirs) {
  const sitePath = path.join(SITES, slug, 'site.json')
  if (!fs.existsSync(sitePath)) continue
  const site = JSON.parse(fs.readFileSync(sitePath, 'utf-8')) as Tenant
  const verticalMeta = site.vertical ? catalog.verticals[site.vertical] : undefined
  if (!verticalMeta || !HIGH_REGULATION.has(verticalMeta.regulation || '')) continue

  const contentDir = path.join(SITES, slug, 'content')
  for (const locale of site.locales || []) {
    const lp = path.join(contentDir, `${locale}.json`)
    if (!fs.existsSync(lp)) continue
    const content = JSON.parse(fs.readFileSync(lp, 'utf-8')) as { _meta?: { reviewedBy?: string; reviewStatus?: string } }
    const meta = content._meta || {}
    if (!meta.reviewedBy && meta.reviewStatus !== 'reviewed') {
      violations.push({
        slug,
        locale,
        reason: `No legal review declared. Add _meta.reviewedBy or _meta.reviewStatus = "reviewed".`,
      })
    }
  }
}

if (violations.length === 0) {
  console.log('legal-review-gate: ✓ all high-regulation tenants have reviewed content')
  process.exit(0)
}

const isProduction = process.env.DEPLOY_ENV === 'production'
console.log(`legal-review-gate: ${violations.length} violation(s)`)
for (const v of violations) console.log(`  ✗ [${v.slug} locale=${v.locale}] ${v.reason}`)
if (isProduction && !process.env.ALLOW_UNREVIEWED) {
  console.log(`\nBLOCKING production deploy. Set ALLOW_UNREVIEWED=1 only in genuine emergencies.`)
  process.exit(1)
}
console.log(`\nWarning only (non-prod). Set DEPLOY_ENV=production to enforce.`)
process.exit(0)
