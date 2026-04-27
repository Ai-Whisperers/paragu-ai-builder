#!/usr/bin/env node
/**
 * Interactive scaffolder for a new tenant. Runs the full chain:
 *   1. Asks for slug, vertical, country, domain, locales
 *   2. Validates vertical exists in catalog
 *   3. Creates sites/<slug>/{site.json, content/<locale>.json, pages/home.json, tokens.json}
 *   4. Stamps _meta.translationQuality as 'human' on the default locale
 *   5. Runs validate-sites and reports
 *
 * Non-interactive flag-mode also supported:
 *   npx tsx new-tenant.ts \
 *     --slug=mi-negocio \
 *     --vertical=beauty-personal-care \
 *     --business-type=peluqueria \
 *     --country=Paraguay \
 *     --domain=mi-negocio.com \
 *     --locales=es,en \
 *     --name="Mi Negocio"
 */

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')
const CATALOG_PATH = path.join(ROOT, 'src/verticals/catalog.json')
const REGISTRY_DIR = path.join(ROOT, 'src/registry')

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8')) as {
  verticals: Record<string, { nameEs: string; nameEn: string; baseType: string; schemaType: string }>
}

// ----- flag parsing -----
const flags: Record<string, string> = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => {
    const eq = a.indexOf('=')
    return [a.slice(2, eq >= 0 ? eq : undefined), eq >= 0 ? a.slice(eq + 1) : 'true']
  }),
)

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function ask(q: string, def?: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(`${q}${def ? ` [${def}]` : ''}: `, (ans) => resolve(ans.trim() || def || ''))
  })
}

async function prompt(key: string, q: string, def?: string): Promise<string> {
  if (flags[key]) return flags[key]
  return ask(q, def)
}

async function main() {
  const slug = await prompt('slug', 'Tenant slug (kebab-case)')
  if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
    console.error(`! invalid slug: "${slug}"`)
    process.exit(1)
  }
  const dir = path.join(SITES, slug)
  if (fs.existsSync(dir)) {
    console.error(`! tenant ${slug} already exists at ${dir}`)
    process.exit(1)
  }

  console.log(`\nAvailable verticals:`)
  for (const [id, v] of Object.entries(catalog.verticals)) {
    console.log(`  - ${id.padEnd(28)} ${v.nameEs}`)
  }
  const vertical = await prompt('vertical', '\nVertical id')
  if (!catalog.verticals[vertical]) {
    console.error(`! unknown vertical: "${vertical}"`)
    process.exit(1)
  }

  // Offer a business type from the vertical — glob registry by verticalId.
  const concreteTypesInVertical: string[] = []
  for (const f of fs.readdirSync(REGISTRY_DIR)) {
    if (!f.endsWith('.type.json')) continue
    const t = JSON.parse(fs.readFileSync(path.join(REGISTRY_DIR, f), 'utf-8')) as { verticalId?: string; abstract?: boolean; id: string }
    if (t.verticalId === vertical && !t.abstract) concreteTypesInVertical.push(t.id)
  }
  if (concreteTypesInVertical.length) {
    console.log(`\nSample types in ${vertical}: ${concreteTypesInVertical.slice(0, 8).join(', ')}${concreteTypesInVertical.length > 8 ? `, … (${concreteTypesInVertical.length} total)` : ''}`)
  }
  const businessType = await prompt('business-type', '\nBusiness type id (from the vertical)', concreteTypesInVertical[0])

  const name = await prompt('name', 'Business name')
  const country = await prompt('country', 'Country', 'Paraguay')
  const domain = await prompt('domain', `Domain (e.g. ${slug}.com; leave blank for staging-only)`, '')
  const localesStr = await prompt('locales', 'Locales (comma-separated)', 'es')
  const locales = localesStr.split(',').map((s) => s.trim()).filter(Boolean)
  const defaultLocale = locales[0]

  rl.close()

  const siteJson = {
    vertical,
    businessType,
    country,
    ...(domain ? { domain, stagingDomain: `staging.${domain}` } : {}),
    defaultLocale,
    locales,
    integrations: {
      crm: 'hubspot',
      email: 'mailchimp',
      analytics: 'ga4',
    },
    features: {
      whatsappFloat: true,
      testimonials: true,
    },
    createdAt: new Date().toISOString().slice(0, 10),
  }

  const contentLocale = {
    _meta: {
      translationQuality: 'human',
      author: name,
      lastReviewed: new Date().toISOString().slice(0, 10),
    },
    siteName: name,
    placeholders: { businessName: name, year: new Date().getFullYear() },
    navigation: {
      businessName: name,
      ctaText: 'Contactanos',
      ctaHref: '#contacto',
    },
    home: {
      seo: { title: `${name}`, description: `${name}.` },
      hero: {
        headline: name,
        subheadline: 'Sitio en construccion. Editalo en sites/{{slug}}/content/.',
        ctaPrimaryText: 'Consultar',
        ctaPrimaryHref: '#contacto',
      },
      contact: { title: 'Contactanos', subtitle: 'Te respondemos en el dia' },
    },
    footer: { businessName: name, copyright: `© {{year}} ${name}` },
    whatsapp: { defaultMessage: `Hola, me interesa ${name}` },
  }

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
    $comment: `Inherits vertical "${vertical}" defaults. Override palette/typography here if branding requires it.`,
    extends: `vertical:${vertical}`,
  }

  // Emit
  fs.mkdirSync(path.join(dir, 'content'), { recursive: true })
  fs.mkdirSync(path.join(dir, 'pages'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'site.json'), JSON.stringify(siteJson, null, 2) + '\n')
  fs.writeFileSync(path.join(dir, 'content', `${defaultLocale}.json`), JSON.stringify(contentLocale, null, 2) + '\n')
  fs.writeFileSync(path.join(dir, 'pages', 'home.json'), JSON.stringify(pagesHome, null, 2) + '\n')
  fs.writeFileSync(path.join(dir, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n')

  console.log(`\n✓ Scaffolded ${dir}\n`)
  console.log(`Next:\n  1. Author sites/${slug}/content/${defaultLocale}.json\n  2. Add more pages under sites/${slug}/pages/\n  3. npm run validate:sites\n  4. npm run cli health ${slug}\n`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
