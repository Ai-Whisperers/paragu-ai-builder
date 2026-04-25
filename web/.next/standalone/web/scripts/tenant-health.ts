#!/usr/bin/env node
/**
 * Capstone — tenant readiness scorecard.
 *
 *   cli health <slug>
 *
 * Aggregates all the individual validators (registry schema, site validator,
 * content lint, perf budget, legal review, translation quality, orphan refs)
 * into a single per-tenant score 0–100 with a pass/warn/fail grade.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')

interface Check {
  id: string
  label: string
  weight: number
  eval: () => { ok: boolean; note?: string }
}

function run(slug: string): number {
  const siteJson = path.join(SITES, slug, 'site.json')
  if (!fs.existsSync(siteJson)) {
    console.error(`no tenant "${slug}"`)
    return 1
  }
  const site = JSON.parse(fs.readFileSync(siteJson, 'utf-8')) as {
    vertical?: string
    domain?: string
    locales?: string[]
  }

  const contentDir = path.join(SITES, slug, 'content')
  const pagesDir = path.join(SITES, slug, 'pages')
  const locales = site.locales || []

  const checks: Check[] = [
    {
      id: 'site.json exists + vertical set',
      label: 'Config',
      weight: 5,
      eval: () => ({ ok: !!site.vertical, note: site.vertical || 'no vertical' }),
    },
    {
      id: 'home page authored',
      label: 'Home page',
      weight: 15,
      eval: () => {
        const ok = fs.existsSync(path.join(pagesDir, 'home.json'))
        return { ok, note: ok ? undefined : 'missing pages/home.json' }
      },
    },
    {
      id: 'locale content complete',
      label: 'Content per locale',
      weight: 15,
      eval: () => {
        const missing = locales.filter((l) => !fs.existsSync(path.join(contentDir, `${l}.json`)))
        return { ok: missing.length === 0, note: missing.length ? `missing: ${missing.join(', ')}` : undefined }
      },
    },
    {
      id: 'translation quality human/reviewed',
      label: 'Translation quality',
      weight: 10,
      eval: () => {
        let bad = 0
        for (const l of locales) {
          const p = path.join(contentDir, `${l}.json`)
          if (!fs.existsSync(p)) continue
          const j = JSON.parse(fs.readFileSync(p, 'utf-8')) as { _meta?: { translationQuality?: string } }
          const q = j._meta?.translationQuality
          if (q === 'machine' || q === 'draft') bad++
        }
        return { ok: bad === 0, note: bad ? `${bad} machine/draft locale(s)` : undefined }
      },
    },
    {
      id: 'domain configured',
      label: 'Production domain',
      weight: 5,
      eval: () => ({ ok: !!site.domain, note: site.domain || 'staging-only' }),
    },
    {
      id: 'no TODO / illustrative markers',
      label: 'Content lint',
      weight: 10,
      eval: () => {
        let bad = 0
        if (fs.existsSync(contentDir)) {
          for (const f of fs.readdirSync(contentDir)) {
            if (!f.endsWith('.json')) continue
            const s = fs.readFileSync(path.join(contentDir, f), 'utf-8')
            if (/\[Testimonio ilustrativo\]|Lorem ipsum|TODO/.test(s)) bad++
          }
        }
        return { ok: bad === 0, note: bad ? `${bad} file(s) with placeholders` : undefined }
      },
    },
    {
      id: 'content size within budget',
      label: 'Perf budget',
      weight: 5,
      eval: () => {
        if (!fs.existsSync(contentDir)) return { ok: true }
        const bytes = fs
          .readdirSync(contentDir)
          .filter((f) => f.endsWith('.json'))
          .reduce((s, f) => s + fs.statSync(path.join(contentDir, f)).size, 0)
        const kb = bytes / 1024
        return { ok: kb < 500, note: `${kb.toFixed(1)} KB` }
      },
    },
    {
      id: 'contact info present',
      label: 'Contact info',
      weight: 5,
      eval: () => {
        const contact = (site as unknown as { contact?: { phone?: string; whatsapp?: string; email?: string } }).contact
        const ok = !!(contact?.phone || contact?.whatsapp || contact?.email)
        return { ok, note: ok ? undefined : 'no phone/whatsapp/email' }
      },
    },
    {
      id: 'validate-sites passes',
      label: 'Site validator',
      weight: 15,
      eval: () => {
        try {
          cp.execSync(`npm run validate:sites --silent`, { cwd: path.join(ROOT, 'web'), stdio: 'pipe' })
          return { ok: true }
        } catch (e) {
          const out = (e as { stderr?: Buffer }).stderr?.toString() || ''
          const tenantIssues = (out.match(new RegExp(`\\[${slug}`, 'g')) || []).length
          return { ok: tenantIssues === 0, note: tenantIssues ? `${tenantIssues} issue(s)` : undefined }
        }
      },
    },
    {
      id: 'navigation cta configured',
      label: 'Navigation CTA',
      weight: 5,
      eval: () => {
        // Best-effort: check es.json has navigation.ctaText / ctaHref
        const es = path.join(contentDir, 'es.json')
        if (!fs.existsSync(es)) return { ok: false, note: 'no es.json' }
        const c = JSON.parse(fs.readFileSync(es, 'utf-8')) as { navigation?: { ctaText?: string; ctaHref?: string } }
        const ok = !!(c.navigation?.ctaText && c.navigation?.ctaHref)
        return { ok, note: ok ? undefined : 'missing ctaText/ctaHref' }
      },
    },
    {
      id: 'testimonials present',
      label: 'Testimonials',
      weight: 5,
      eval: () => {
        const es = path.join(contentDir, 'es.json')
        if (!fs.existsSync(es)) return { ok: false }
        const c = JSON.parse(fs.readFileSync(es, 'utf-8')) as { home?: { testimonials?: { items?: unknown[] } } }
        const n = c.home?.testimonials?.items?.length || 0
        return { ok: n >= 2, note: `${n} testimonial(s)` }
      },
    },
    {
      id: 'legal review (high-regulation verticals)',
      label: 'Legal review',
      weight: 5,
      eval: () => {
        const catalog = JSON.parse(
          fs.readFileSync(path.join(ROOT, 'src/verticals/catalog.json'), 'utf-8'),
        ) as { verticals: Record<string, { regulation?: string }> }
        const reg = site.vertical ? catalog.verticals[site.vertical]?.regulation : undefined
        if (reg !== 'high' && reg !== 'very-high') return { ok: true, note: `reg=${reg || 'low'}` }
        const es = path.join(contentDir, 'es.json')
        if (!fs.existsSync(es)) return { ok: false }
        const c = JSON.parse(fs.readFileSync(es, 'utf-8')) as { _meta?: { reviewedBy?: string; reviewStatus?: string } }
        const ok = !!(c._meta?.reviewedBy || c._meta?.reviewStatus === 'reviewed')
        return { ok, note: ok ? undefined : 'no reviewedBy / reviewStatus' }
      },
    },
  ]

  let earned = 0
  let total = 0
  const rows: Array<{ label: string; ok: boolean; weight: number; note?: string }> = []
  for (const c of checks) {
    const { ok, note } = c.eval()
    total += c.weight
    if (ok) earned += c.weight
    rows.push({ label: c.label, ok, weight: c.weight, note })
  }

  const score = Math.round((earned / total) * 100)
  const grade = score >= 90 ? '✓ PASS' : score >= 70 ? '⚠ WARN' : '✗ FAIL'

  console.log(`\n=== Tenant health: ${slug} ===`)
  console.log(`Score: ${score}/100   ${grade}\n`)
  for (const r of rows) {
    const icon = r.ok ? '✓' : '✗'
    console.log(`  ${icon} ${r.label.padEnd(30)} ${String(r.weight).padStart(3)} pts${r.note ? `   — ${r.note}` : ''}`)
  }

  return score < 70 ? 1 : 0
}

const slug = process.argv[2]
if (!slug) {
  // Show all tenants
  const tenants = fs
    .readdirSync(SITES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !['shared-images', '.archive'].includes(d.name))
    .map((d) => d.name)
  let worst = 0
  for (const t of tenants) worst = Math.max(worst, run(t))
  process.exit(worst)
} else {
  process.exit(run(slug))
}
