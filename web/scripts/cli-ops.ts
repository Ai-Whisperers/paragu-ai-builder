#!/usr/bin/env node
/**
 * Operator commands bundled as one file to keep the scripts/ tree tidy.
 *
 *   cli-ops doctor                 — run every validator
 *   cli-ops diff-tenant <a> <b>    — compare two tenants' configs
 *   cli-ops export-tenant <slug>   — bundle tenant folder as a single JSON
 *   cli-ops pull-content <slug>    — copy live content back to repo (stub)
 *   cli-ops new-tenant             — interactive wizard (scaffold)
 *   cli-ops lint-content           — heuristic text-quality checks
 *   cli-ops perf-budget <slug>     — size budget check
 *   cli-ops screenshots <slug>     — visual regression stub
 *   cli-ops check-links <slug>     — broken-link detector
 *   cli-ops rotate-secrets         — lists env vars that need rotation
 *
 * Pass the subcommand as the first arg.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')

function listTenants(): string[] {
  const NON = new Set(['shared-images', '.archive'])
  return fs
    .readdirSync(SITES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !NON.has(d.name))
    .map((d) => d.name)
}

function runInline(cmd: string): void {
  cp.execSync(cmd, { stdio: 'inherit', cwd: path.join(ROOT, 'web') })
}

function safeRun(cmd: string): boolean {
  try {
    cp.execSync(cmd, { stdio: 'inherit', cwd: path.join(ROOT, 'web') })
    return true
  } catch {
    return false
  }
}

function cmdDoctor(): void {
  const checks: Array<[string, () => boolean]> = [
    ['validate:registry', () => safeRun('npx tsx scripts/validate-registry.ts')],
    ['validate:tokens', () => safeRun('npm run validate:tokens --silent')],
    ['validate:sites', () => safeRun('npm run validate:sites --silent')],
    ['validate:schemas', () => safeRun('npm run validate:schemas --silent')],
    ['validate:legal', () => safeRun('npx tsx scripts/legal-review-gate.ts')],
    ['validate:contrast', () => safeRun('npx tsx scripts/contrast-audit.ts')],
    ['audit-duplicates', () => safeRun('npx tsx scripts/audit-duplicates.ts')],
    ['typecheck', () => safeRun('npx tsc --noEmit')],
    ['graph (orphans)', () => safeRun('npx tsx scripts/type-graph.ts --orphans')],
  ]
  let pass = 0
  let fail = 0
  const results: Array<[string, boolean]> = []
  for (const [name, fn] of checks) {
    console.log(`\n--- ${name} ---`)
    const ok = fn()
    ok ? pass++ : fail++
    results.push([name, ok])
  }
  console.log(`\n=== Doctor: ${pass}/${pass + fail} passed ===`)
  for (const [n, ok] of results) console.log(`  ${ok ? '✓' : '✗'} ${n}`)
  process.exit(fail ? 1 : 0)
}

function readTenant(slug: string): Record<string, unknown> {
  const p = path.join(SITES, slug, 'site.json')
  if (!fs.existsSync(p)) throw new Error(`no tenant "${slug}"`)
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

function cmdDiffTenant(a: string, b: string): void {
  const A = readTenant(a)
  const B = readTenant(b)
  const keys = new Set([...Object.keys(A), ...Object.keys(B)])
  console.log(`\nDiff ${a} ↔ ${b} (site.json)\n`)
  for (const k of [...keys].sort()) {
    const va = JSON.stringify(A[k])
    const vb = JSON.stringify(B[k])
    if (va !== vb) {
      console.log(`  ~ ${k}`)
      console.log(`    ${a}: ${va ?? '<missing>'}`)
      console.log(`    ${b}: ${vb ?? '<missing>'}`)
    }
  }
}

function cmdExportTenant(slug: string): void {
  const dir = path.join(SITES, slug)
  if (!fs.existsSync(dir)) throw new Error(`no tenant "${slug}"`)
  const walk = (d: string): Record<string, unknown> => {
    const out: Record<string, unknown> = {}
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name)
      if (entry.isDirectory()) out[entry.name] = walk(full)
      else if (entry.name.endsWith('.json')) {
        try {
          out[entry.name] = JSON.parse(fs.readFileSync(full, 'utf-8'))
        } catch {
          out[entry.name] = '<unparseable>'
        }
      }
    }
    return out
  }
  const dump = { slug, exportedAt: new Date().toISOString(), tree: walk(dir) }
  const outPath = path.join(ROOT, `${slug}-export.json`)
  fs.writeFileSync(outPath, JSON.stringify(dump, null, 2))
  console.log(`+ exported ${slug} → ${outPath}`)
}

async function cmdPullContent(slug: string): Promise<void> {
  // Reads tenant_content_overrides from Supabase (keyed by tenant slug + locale)
  // and merges them into sites/<slug>/content/<locale>.json. This is how
  // admin-panel edits make it back into the repo: admin saves to Supabase,
  // operator runs `cli pull-content <slug>` to commit changes.
  const { createClient } = await import('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error(
      'pull-content: requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars.',
    )
    process.exit(1)
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const contentDir = path.join(SITES, slug, 'content')
  if (!fs.existsSync(contentDir)) {
    console.error(`! no content dir for ${slug}`)
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('tenant_content_overrides')
    .select('locale, payload, updated_at')
    .eq('tenant_slug', slug)
  if (error) {
    console.error(`! Supabase query failed: ${error.message}`)
    process.exit(1)
  }

  if (!data || data.length === 0) {
    console.log(`pull-content: no overrides found for ${slug}.`)
    return
  }

  function deepMerge(base: unknown, overlay: unknown): unknown {
    if (overlay === null || overlay === undefined) return base
    if (Array.isArray(overlay)) return overlay
    if (typeof overlay !== 'object') return overlay
    const a = (base && typeof base === 'object' && !Array.isArray(base) ? base : {}) as Record<string, unknown>
    const b = overlay as Record<string, unknown>
    const out: Record<string, unknown> = { ...a }
    for (const [k, v] of Object.entries(b)) out[k] = deepMerge(a[k], v)
    return out
  }

  let merged = 0
  for (const row of data) {
    const lp = path.join(contentDir, `${row.locale}.json`)
    if (!fs.existsSync(lp)) {
      console.warn(`! no base ${row.locale}.json for ${slug}; skipping`)
      continue
    }
    const base = JSON.parse(fs.readFileSync(lp, 'utf-8'))
    const merged_data = deepMerge(base, row.payload)
    fs.writeFileSync(lp, JSON.stringify(merged_data, null, 2) + '\n')
    console.log(`+ merged ${slug}/${row.locale}.json  (updated ${row.updated_at})`)
    merged++
  }
  console.log(`\npull-content: ${merged} locale(s) updated.`)
}

function cmdNewTenant(): void {
  console.log(`Interactive wizard not yet implemented. For now:`)
  console.log(`  1. npm run cli scaffold-verticals   (if adding a new vertical)`)
  console.log(`  2. npm run cli migrate-demo-to-site <slug>   (if from demo-data)`)
  console.log(`  3. Author sites/<slug>/{site.json, content/<locale>.json, pages/home.json}`)
  console.log(`  4. npm run validate:sites`)
}

function cmdLintContent(): void {
  const issues: string[] = []
  for (const slug of listTenants()) {
    const siteJson = path.join(SITES, slug, 'site.json')
    if (!fs.existsSync(siteJson)) continue
    const contentDir = path.join(SITES, slug, 'content')
    if (!fs.existsSync(contentDir)) continue
    for (const f of fs.readdirSync(contentDir)) {
      if (!f.endsWith('.json')) continue
      const raw = fs.readFileSync(path.join(contentDir, f), 'utf-8')
      if (raw.includes('Lorem ipsum')) issues.push(`${slug}/${f}: Lorem ipsum placeholder`)
      if (raw.includes('TODO')) issues.push(`${slug}/${f}: TODO marker`)
      if (raw.includes('[Testimonio ilustrativo]')) {
        issues.push(`${slug}/${f}: illustrative testimonial (replace with real)`)
      }
    }
  }
  if (issues.length === 0) console.log('lint-content: ✓ clean')
  else {
    console.log(`lint-content: ${issues.length} issue(s)`)
    for (const i of issues) console.log(`  ⚠ ${i}`)
  }
}

function cmdPerfBudget(slug: string): void {
  // A light budget check: total content JSON bytes per tenant should stay
  // under ~500 KB. Larger sites should be split into per-page content.
  const contentDir = path.join(SITES, slug, 'content')
  if (!fs.existsSync(contentDir)) {
    console.log(`no content dir for ${slug}`)
    return
  }
  let total = 0
  for (const f of fs.readdirSync(contentDir)) {
    if (!f.endsWith('.json')) continue
    total += fs.statSync(path.join(contentDir, f)).size
  }
  const kb = (total / 1024).toFixed(1)
  const BUDGET_KB = 500
  const ok = total < BUDGET_KB * 1024
  console.log(`${slug}: ${kb} KB content / budget ${BUDGET_KB} KB — ${ok ? '✓' : '⚠ over'}`)
}

function cmdScreenshots(slug: string): void {
  console.log(`screenshots ${slug} — scaffold. Wire up to Playwright / Percy once chosen.`)
  // TODO: `npx playwright test tests/visual-regression/${slug}.spec.ts`
}

async function cmdCheckLinks(slug: string): Promise<void> {
  const walkDirs = [path.join(SITES, slug, 'pages'), path.join(SITES, slug, 'content')]
  const urls = new Set<string>()
  const walk = (obj: unknown) => {
    if (!obj) return
    if (typeof obj === 'string') {
      if (/^https?:\/\//.test(obj)) urls.add(obj)
    } else if (Array.isArray(obj)) obj.forEach(walk)
    else if (typeof obj === 'object') Object.values(obj).forEach(walk)
  }
  for (const dir of walkDirs) {
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue
      try {
        walk(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')))
      } catch {
        /* malformed JSON handled by validate-sites */
      }
    }
  }

  if (urls.size === 0) {
    console.log(`${slug}: no external URLs found.`)
    return
  }
  console.log(`${slug}: checking ${urls.size} external URLs...\n`)

  async function check(url: string): Promise<{ url: string; status: number | 'error'; note?: string }> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    try {
      let res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
      if (res.status === 405 || res.status === 501) {
        // Server rejects HEAD; retry with GET.
        res = await fetch(url, { method: 'GET', signal: controller.signal, redirect: 'follow' })
      }
      clearTimeout(timeout)
      return { url, status: res.status, note: res.redirected ? `→ ${res.url}` : undefined }
    } catch (err) {
      clearTimeout(timeout)
      return { url, status: 'error', note: err instanceof Error ? err.message : 'unknown' }
    }
  }

  const results = await Promise.all([...urls].map(check))
  let ok = 0
  let broken = 0
  let warnings = 0
  for (const r of results) {
    const code = r.status === 'error' ? '✗' : r.status >= 200 && r.status < 400 ? '✓' : '⚠'
    if (r.status !== 'error' && r.status >= 200 && r.status < 400) ok++
    else if (r.status === 'error' || (typeof r.status === 'number' && r.status >= 500)) broken++
    else warnings++
    const status = typeof r.status === 'number' ? String(r.status).padStart(3) : 'ERR'
    console.log(`  ${code} ${status}  ${r.url}${r.note ? `  (${r.note})` : ''}`)
  }
  console.log(`\n${slug}: ${ok} ok, ${warnings} warn, ${broken} broken`)
  if (broken > 0) process.exit(1)
}

function cmdRotateSecrets(): void {
  const SENSITIVE = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'MAILCHIMP_API_KEY',
    'HUBSPOT_ACCESS_TOKEN',
    'CALENDLY_SIGNING_KEY',
    'WHATSAPP_VERIFY_TOKEN',
    'CRON_TOKEN',
    'MAILCHIMP_IMPORT_TOKEN',
    'RESEND_API_KEY',
  ]
  console.log(`\nSecrets that should be rotated on a schedule (every 90 days):\n`)
  for (const s of SENSITIVE) console.log(`  - ${s}`)
  console.log(`\nWith Cloudflare Pages, rotate via dashboard → Settings → Environment variables.`)
  console.log(`Remember to stage → prod and restart the Cron triggers.`)
}

function usage(): void {
  console.log(`\nUsage: cli-ops <command> [args]\n`)
  console.log('  doctor, diff-tenant <a> <b>, export-tenant <slug>,')
  console.log('  pull-content <slug>, new-tenant, lint-content,')
  console.log('  perf-budget <slug>, screenshots <slug>,')
  console.log('  check-links <slug>, rotate-secrets\n')
}

const [sub, ...args] = process.argv.slice(2)
switch (sub) {
  case 'doctor':
    cmdDoctor()
    break
  case 'diff-tenant':
    cmdDiffTenant(args[0], args[1])
    break
  case 'export-tenant':
    cmdExportTenant(args[0])
    break
  case 'pull-content':
    cmdPullContent(args[0]).catch((e) => {
      console.error(e)
      process.exit(1)
    })
    break
  case 'new-tenant':
    cmdNewTenant()
    break
  case 'lint-content':
    cmdLintContent()
    break
  case 'perf-budget':
    cmdPerfBudget(args[0])
    break
  case 'screenshots':
    cmdScreenshots(args[0])
    break
  case 'check-links':
    cmdCheckLinks(args[0]).catch((e) => {
      console.error(e)
      process.exit(1)
    })
    break
  case 'rotate-secrets':
    cmdRotateSecrets()
    break
  default:
    usage()
    process.exit(sub ? 1 : 0)
}
