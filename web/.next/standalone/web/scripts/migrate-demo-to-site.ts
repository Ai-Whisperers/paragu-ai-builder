#!/usr/bin/env node
/**
 * Migrate a real-client entry out of web/lib/engine/demo-data.ts into a proper
 * sites/<slug>/ tenant folder.
 *
 * Scope: the three entries in demo-data.ts that are actually real clients:
 *   nexaparaguay, dayah-litworks, de-abasto-a-casa.
 *
 * After migration, the entry is still left in demo-data.ts for the SSR
 * fallback path — a follow-up cleanup can remove them once data-loader reads
 * from sites/ directly. The tenant folder becomes the authoring surface.
 *
 * Usage:
 *   npx tsx scripts/migrate-demo-to-site.ts <slug>
 *   npx tsx scripts/migrate-demo-to-site.ts --all
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { DEMO_BUSINESSES, RELOCATION_DEMO_BUSINESSES } from '../lib/engine/demo-data'

const ALL_DEMO: Record<string, (typeof DEMO_BUSINESSES)[string]> = {
  ...DEMO_BUSINESSES,
  ...RELOCATION_DEMO_BUSINESSES,
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')

const REAL_CLIENT_SLUGS = ['nexaparaguay', 'dayah-litworks', 'de-abasto-a-casa'] as const

// Map each real client to its vertical + locales. demo-data has `type:` but
// not `vertical:`, so we fix it here at migration time.
const MIGRATION_META: Record<string, { vertical: string; locales: string[]; country: string; domainHint: string }> = {
  nexaparaguay: {
    vertical: 'real-estate-relocation',
    locales: ['es', 'en'],
    country: 'Paraguay',
    domainHint: 'nexaparaguay.com',
  },
  'dayah-litworks': {
    vertical: 'portfolio-professional',
    locales: ['es', 'en'],
    country: 'Paraguay',
    domainHint: 'dayah-litworks.com',
  },
  'de-abasto-a-casa': {
    vertical: 'food-beverage',
    locales: ['es'],
    country: 'Paraguay',
    domainHint: 'deabastoacasa.com.py',
  },
}

function writeJsonIfMissing(filePath: string, payload: object): boolean {
  if (fs.existsSync(filePath)) return false
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + '\n', 'utf-8')
  return true
}

function migrateOne(slug: string): void {
  const demo = ALL_DEMO[slug]
  if (!demo) {
    console.error(`! slug "${slug}" not found in demo-data.ts (checked DEMO_BUSINESSES + RELOCATION_DEMO_BUSINESSES)`)
    return
  }
  const meta = MIGRATION_META[slug]
  if (!meta) {
    console.error(`! no migration metadata for "${slug}". Add to MIGRATION_META first.`)
    return
  }

  const tenantDir = path.join(SITES, slug)
  if (fs.existsSync(tenantDir)) {
    console.warn(`- ${slug}: already migrated to ${tenantDir}. Skipping.`)
    return
  }

  // 1. site.json — tenant config
  const siteJson = {
    vertical: meta.vertical,
    businessType: demo.type,
    country: meta.country,
    domain: meta.domainHint,
    stagingDomain: `staging.${meta.domainHint}`,
    defaultLocale: meta.locales[0],
    locales: meta.locales,
    contact: {
      phone: demo.phone,
      email: demo.email,
      whatsapp: demo.whatsapp,
      instagram: demo.instagram,
      facebook: demo.facebook,
    },
    location: {
      address: demo.address,
      neighborhood: demo.neighborhood,
      city: demo.city,
    },
    hours: demo.hours,
    integrations: {
      crm: 'hubspot',
      email: 'mailchimp',
      analytics: 'ga4',
    },
    features: {
      whatsappFloat: true,
      testimonials: (demo.testimonials || []).length > 0,
    },
    migratedFrom: 'web/lib/engine/demo-data.ts',
    migratedAt: new Date().toISOString().slice(0, 10),
  }
  writeJsonIfMissing(path.join(tenantDir, 'site.json'), siteJson)

  // 2. content/es.json — primary locale content
  const contentEs = {
    _meta: {
      translationQuality: 'human',
      author: demo.name,
      lastReviewed: new Date().toISOString().slice(0, 10),
    },
    siteName: demo.name,
    tagline: demo.tagline,
    placeholders: {
      businessName: demo.name,
      city: demo.city,
      year: new Date().getFullYear(),
    },
    navigation: {
      businessName: demo.name,
      ctaText: 'Contactanos',
      ctaHref: `https://wa.me/${(demo.whatsapp || '').replace(/\D/g, '')}`,
    },
    home: {
      seo: {
        title: `${demo.name} — ${demo.tagline || 'Sitio oficial'}`,
        description: demo.tagline || `${demo.name} en ${demo.city}.`,
      },
      hero: {
        headline: demo.name,
        subheadline: demo.tagline || `${demo.name} en ${demo.city}.`,
        ctaPrimaryText: 'Contactanos por WhatsApp',
        ctaPrimaryHref: `https://wa.me/${(demo.whatsapp || '').replace(/\D/g, '')}`,
      },
      services: demo.services
        ? {
            title: 'Nuestros Servicios',
            items: demo.services,
          }
        : undefined,
      products: demo.products
        ? {
            title: 'Productos',
            items: demo.products,
          }
        : undefined,
      team: demo.team ? { title: 'Equipo', members: demo.team } : undefined,
      testimonials: demo.testimonials ? { title: 'Testimonios', items: demo.testimonials } : undefined,
      features: demo.features ? { title: 'Por que elegirnos', items: demo.features } : undefined,
      process: demo.processSteps ? { title: 'Como Trabajamos', steps: demo.processSteps } : undefined,
      classSchedule: demo.classSchedule ? { title: 'Horarios', schedule: demo.classSchedule } : undefined,
      membershipPlans: demo.membershipPlans ? { title: 'Planes', plans: demo.membershipPlans } : undefined,
    },
    footer: {
      businessName: demo.name,
      city: demo.city,
      copyright: `© ${new Date().getFullYear()} ${demo.name}`,
    },
  }
  writeJsonIfMissing(path.join(tenantDir, 'content', 'es.json'), contentEs)

  // 3. pages/home.json — page layout. Builds a standard set of sections in
  // canonical kebab-case names. Enable only those for which content exists.
  const sections: Array<Record<string, unknown>> = [
    { id: 'header', variant: 'standard', content: 'navigation' },
    { id: 'hero', variant: 'image', content: 'home.hero' },
  ]
  if (demo.features) sections.push({ id: 'features', variant: 'three-col', content: 'home.features' })
  if (demo.services) sections.push({ id: 'services', variant: 'cards', content: 'home.services' })
  if (demo.products) sections.push({ id: 'product-catalog', variant: 'grid', content: 'home.products' })
  if (demo.processSteps) sections.push({ id: 'process', variant: 'steps', content: 'home.process' })
  if (demo.classSchedule) sections.push({ id: 'class-schedule', variant: 'grid', content: 'home.classSchedule' })
  if (demo.membershipPlans) sections.push({ id: 'membership-plans', variant: 'cards', content: 'home.membershipPlans' })
  if (demo.team) sections.push({ id: 'team', variant: 'cards', content: 'home.team' })
  if (demo.testimonials) sections.push({ id: 'testimonials', variant: 'carousel', content: 'home.testimonials' })
  sections.push({ id: 'contact', variant: 'split', content: 'home.contact' })
  sections.push({ id: 'footer', variant: 'standard', content: 'footer' })
  sections.push({ id: 'whatsapp-float', variant: 'standard', content: 'whatsapp' })

  const pageHome = {
    slug: '',
    titleKey: 'home.seo.title',
    descriptionKey: 'home.seo.description',
    sections,
  }
  writeJsonIfMissing(path.join(tenantDir, 'pages', 'home.json'), pageHome)

  // 4. tokens.json — keep empty object; resolver falls back to vertical defaults
  writeJsonIfMissing(path.join(tenantDir, 'tokens.json'), {
    $comment: `Inherits vertical "${meta.vertical}" defaults. Override palette/typography here if branding requires it.`,
    extends: `vertical:${meta.vertical}`,
  })

  console.log(`+ migrated ${slug} → ${tenantDir}`)
}

// ----- main -----
const arg = process.argv[2]
if (!arg) {
  console.error('usage: migrate-demo-to-site <slug | --all>')
  console.error(`known real clients: ${REAL_CLIENT_SLUGS.join(', ')}`)
  process.exit(1)
}

if (arg === '--all') {
  for (const slug of REAL_CLIENT_SLUGS) migrateOne(slug)
} else {
  migrateOne(arg)
}
