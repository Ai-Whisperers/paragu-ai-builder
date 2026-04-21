#!/usr/bin/env node
/**
 * Batch-scaffold demo tenants from sites/_demo-roster.json.
 *
 * Usage:
 *   npx tsx web/scripts/batch-create-demos.ts              # all waves
 *   npx tsx web/scripts/batch-create-demos.ts --wave=1     # wave 1 only
 *   npx tsx web/scripts/batch-create-demos.ts --dry-run    # print plan, write nothing
 *
 * Honors the decisions in docs/05_strategy (leads repo):
 *   - Route path: /demo/<rubro> (noindex)
 *   - Contact form routes to AI Whisperers sales inbox
 *   - demo:true flag set on every tenant for admin filtering
 *   - demoRubro tag enables per-rubro lead attribution
 *
 * Each demo tenant gets:
 *   sites/demo-<slug>/
 *     site.json           (vertical, businessType, demo:true, contact, location)
 *     tokens.json         (inherits vertical defaults)
 *     pages/home.json     (minimal 5-section homepage)
 *     content/es.json     (hero+contact copy derived from the registry type.json)
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')
const REGISTRY = path.join(ROOT, 'src/registry')
const ROSTER_PATH = path.join(SITES, '_demo-roster.json')

// AI Whisperers sales inbox — all demo leads flow here.
// TODO: replace placeholder with the real sales WhatsApp line before production.
const SALES_WHATSAPP = '+595985724135'
const SALES_EMAIL = 'ventas@paragu-ai.com'
const SALES_WA_DIGITS = SALES_WHATSAPP.replace(/\D/g, '')

// ---------- flags ----------
const flags: Record<string, string> = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => {
    const eq = a.indexOf('=')
    return [a.slice(2, eq >= 0 ? eq : undefined), eq >= 0 ? a.slice(eq + 1) : 'true']
  }),
)
const waveFilter = flags.wave ? Number(flags.wave) : 0
const dryRun = flags['dry-run'] === 'true'

// ---------- types ----------
type RosterEntry = {
  slug: string
  rubro: string
  nameEs: string
  city: string
  wave: 1 | 2 | 3
  cluster: string
}

type RosterFile = {
  version: string
  country: string
  rubros: RosterEntry[]
}

type TypeFile = {
  id: string
  nameEs?: string
  nameEn?: string
  verticalId?: string
  seo?: { titleTemplate?: string; descriptionTemplate?: string; schemaType?: string }
  hero?: { headlineTemplate?: string; subheadlineTemplate?: string }
  pages?: Record<string, { sections: string[] }>
  nav?: { items?: string[]; cta?: { text: string; action: string } }
  abstract?: boolean
}

// ---------- helpers ----------
function fillTemplate(s: string | undefined, vars: Record<string, string>): string {
  if (!s) return ''
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '')
}

function loadType(id: string): TypeFile | null {
  const p = path.join(REGISTRY, `${id}.type.json`)
  if (!fs.existsSync(p)) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as TypeFile
  } catch {
    return null
  }
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
}

// ---------- scaffold one demo ----------
type Result = { ok: true } | { ok: false; reason: string }

function scaffoldDemo(entry: RosterEntry): Result {
  const type = loadType(entry.rubro)
  if (!type) return { ok: false, reason: `type.json not found: src/registry/${entry.rubro}.type.json` }
  if (!type.verticalId) return { ok: false, reason: `no verticalId in ${entry.rubro}.type.json` }
  if (type.abstract) return { ok: false, reason: `${entry.rubro} is abstract base type` }

  const dir = path.join(SITES, entry.slug)
  if (fs.existsSync(dir)) return { ok: false, reason: 'tenant dir already exists' }

  const businessName = `Demo ${entry.nameEs} ${entry.city}`
  const vars = {
    businessName,
    city: entry.city,
    neighborhood: entry.city,
    year: String(new Date().getFullYear()),
    lowestPrice: 'Consultar',
  }

  const heroHeadline = fillTemplate(type.hero?.headlineTemplate, vars) || businessName
  const heroSubheadline = fillTemplate(type.hero?.subheadlineTemplate, vars) ||
    `${entry.nameEs} profesional en ${entry.city}. Te respondemos en el dia.`
  const seoTitle = fillTemplate(type.seo?.titleTemplate, vars) || `${businessName} | ${entry.nameEs}`
  const seoDesc = fillTemplate(type.seo?.descriptionTemplate, vars) || heroSubheadline

  const today = new Date().toISOString().slice(0, 10)

  const siteJson = {
    vertical: type.verticalId,
    businessType: entry.rubro,
    country: 'Paraguay',
    defaultLocale: 'es',
    locales: ['es'],
    contact: {
      whatsapp: SALES_WHATSAPP,
      email: SALES_EMAIL,
      instagram: `@demo.${entry.rubro.replace(/_/g, '.')}.py`,
    },
    location: { city: entry.city },
    integrations: {
      crm: 'hubspot',
      email: 'mailchimp',
      analytics: 'ga4',
    },
    features: {
      whatsappFloat: true,
      testimonials: true,
    },
    demo: true,
    demoRubro: entry.rubro,
    demoWave: entry.wave,
    demoCluster: entry.cluster,
    noindex: true,
    createdAt: today,
    source: 'batch-create-demos',
  }

  const contentEs = {
    _meta: {
      translationQuality: 'machine',
      author: 'batch-create-demos',
      lastReviewed: today,
    },
    siteName: businessName,
    tagline: heroSubheadline,
    placeholders: {
      businessName,
      city: entry.city,
      year: new Date().getFullYear(),
    },
    navigation: {
      businessName,
      ctaText: 'Contactanos',
      ctaHref: `https://wa.me/${SALES_WA_DIGITS}`,
    },
    home: {
      seo: { title: seoTitle, description: seoDesc },
      hero: {
        headline: heroHeadline,
        subheadline: heroSubheadline,
        ctaPrimaryText: 'Contactanos por WhatsApp',
        ctaPrimaryHref: `https://wa.me/${SALES_WA_DIGITS}?text=Hola%2C%20vi%20tu%20demo%20de%20${encodeURIComponent(entry.nameEs)}%20y%20me%20interesa%20un%20sitio%20para%20mi%20negocio`,
        ctaSecondaryText: 'Ver como funciona',
        ctaSecondaryHref: '/demo',
      },
      contact: {
        title: 'Contactanos',
        subtitle: 'Te respondemos el mismo dia',
        phone: SALES_WHATSAPP,
        email: SALES_EMAIL,
        city: entry.city,
        formSource: 'demo',
        demoRubro: entry.rubro,
      },
    },
    footer: {
      businessName,
      copyright: `© {{year}} ${businessName}`,
      disclaimer: 'Esta es una demostracion del sitio que Paragu AI puede crear para tu negocio. El sitio final se personaliza con tu informacion real.',
    },
    whatsapp: {
      defaultMessage: `Hola, vi el demo de ${entry.nameEs} y me interesa un sitio para mi negocio`,
    },
  }

  // Minimal 5-section homepage — safe across all verticals.
  // Richer pages can be derived later by reading type.pages.homepage.
  const pagesHome = {
    slug: '',
    titleKey: 'home.seo.title',
    descriptionKey: 'home.seo.description',
    sections: [
      { id: 'header', variant: 'standard', content: 'navigation' },
      { id: 'hero', variant: 'image', content: 'home.hero' },
      { id: 'contact', variant: 'split', content: 'home.contact' },
      { id: 'footer', variant: 'standard', content: 'footer' },
      { id: 'whatsapp-float', variant: 'standard', content: 'whatsapp' },
    ],
  }

  const tokens = {
    $comment: `Demo tenant. Inherits vertical "${type.verticalId}" defaults. Override only if the demo needs to showcase a distinct palette.`,
    extends: `vertical:${type.verticalId}`,
  }

  if (dryRun) return { ok: true }

  fs.mkdirSync(path.join(dir, 'content'), { recursive: true })
  fs.mkdirSync(path.join(dir, 'pages'), { recursive: true })
  writeJson(path.join(dir, 'site.json'), siteJson)
  writeJson(path.join(dir, 'content', 'es.json'), contentEs)
  writeJson(path.join(dir, 'pages', 'home.json'), pagesHome)
  writeJson(path.join(dir, 'tokens.json'), tokens)

  return { ok: true }
}

// ---------- main ----------
function main() {
  if (!fs.existsSync(ROSTER_PATH)) {
    console.error(`✗ roster not found: ${ROSTER_PATH}`)
    process.exit(1)
  }
  const roster = JSON.parse(fs.readFileSync(ROSTER_PATH, 'utf-8')) as RosterFile

  const queue = waveFilter
    ? roster.rubros.filter((r) => r.wave === waveFilter)
    : roster.rubros

  console.log(
    `${dryRun ? '[DRY RUN] ' : ''}Scaffolding ${queue.length} demos` +
    (waveFilter ? ` (wave ${waveFilter})` : ' (all waves)') +
    '...\n',
  )

  const results = {
    ok: 0,
    skipped: 0,
    failed: 0,
    failures: [] as { slug: string; reason: string }[],
    skips: [] as string[],
  }

  for (const entry of queue) {
    const r = scaffoldDemo(entry)
    if (r.ok) {
      results.ok++
      console.log(`  ✓ ${entry.slug.padEnd(34)} ${entry.cluster}`)
    } else if (r.reason === 'tenant dir already exists') {
      results.skipped++
      results.skips.push(entry.slug)
      console.log(`  ~ ${entry.slug.padEnd(34)} already exists`)
    } else {
      results.failed++
      results.failures.push({ slug: entry.slug, reason: r.reason })
      console.log(`  ✗ ${entry.slug.padEnd(34)} ${r.reason}`)
    }
  }

  console.log(
    `\n${dryRun ? '[DRY RUN] ' : ''}Done.` +
    `  created=${results.ok}  skipped=${results.skipped}  failed=${results.failed}`,
  )
  if (results.failures.length) {
    console.log(`\nFailures (fix these by creating the missing type.json):`)
    results.failures.forEach((f) => console.log(`  - ${f.slug}: ${f.reason}`))
  }

  process.exit(results.failed > 0 ? 1 : 0)
}

main()
