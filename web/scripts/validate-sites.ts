#!/usr/bin/env tsx
/**
 * CI validator — run before merge.
 *
 *  1. Every site's vertical exists
 *  2. Every page references a section id in the catalog
 *  3. Every section variant exists
 *  4. Every declared locale has a complete content/<locale>.json
 *  5. Every content ref used by pages resolves in every locale
 *  6. Vertical allowedSections whitelist is respected
 *
 * Exits non-zero on any failure with a readable report.
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { SECTION_CATALOG } from '../lib/engine/section-registry'

interface Problem {
  site: string
  page?: string
  locale?: string
  kind: string
  detail: string
}

function repoPath(...s: string[]): string {
  return resolve(process.cwd(), '..', ...s)
}
function readJson<T>(p: string): T { return JSON.parse(readFileSync(p, 'utf-8')) as T }

function listSites(): string[] {
  const dir = repoPath('sites')
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
}

function listPages(siteSlug: string): string[] {
  const dir = repoPath('sites', siteSlug, 'pages')
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
}

function getByPath(root: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, root)
}

function followRef(value: unknown, root: Record<string, unknown>, depth = 0): unknown {
  if (depth > 10) return value
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const rec = value as Record<string, unknown>
    if (typeof rec.$ref === 'string') {
      const hit = getByPath(root, rec.$ref)
      return hit !== undefined ? followRef(hit, root, depth + 1) : undefined
    }
  }
  return value
}

function resolveRefInLocale(ref: string, siteContent: Record<string, unknown>, verticalCopy: Record<string, unknown>): unknown {
  const site = getByPath(siteContent, ref)
  if (site !== undefined) return followRef(site, siteContent)
  const vert = getByPath(verticalCopy, ref)
  if (vert !== undefined) return followRef(vert, verticalCopy)
  return undefined
}

function main() {
  const problems: Problem[] = []
  const sites = listSites()

  for (const siteSlug of sites) {
    let site
    try { site = readJson<{ vertical: string; locales: string[]; domain?: string; defaultLocale: string }>(repoPath('sites', siteSlug, 'site.json')) } catch (e) {
      problems.push({ site: siteSlug, kind: 'site.json', detail: `missing or invalid: ${(e as Error).message}` })
      continue
    }

    const verticalPath = repoPath('src', 'verticals', site.vertical, 'vertical.json')
    if (!existsSync(verticalPath)) {
      problems.push({ site: siteSlug, kind: 'vertical', detail: `unknown vertical "${site.vertical}"` })
      continue
    }
    const vertical = readJson<{ allowedSections?: string[] }>(verticalPath)

    if (!site.locales.includes(site.defaultLocale)) {
      problems.push({ site: siteSlug, kind: 'defaultLocale', detail: `defaultLocale ${site.defaultLocale} not in locales ${JSON.stringify(site.locales)}` })
    }

    const pages = listPages(siteSlug)
    if (!pages.includes('home')) {
      problems.push({ site: siteSlug, kind: 'pages', detail: 'no home.json — every site needs a home page' })
    }

    for (const locale of site.locales) {
      const contentPath = repoPath('sites', siteSlug, 'content', `${locale}.json`)
      if (!existsSync(contentPath)) {
        problems.push({ site: siteSlug, locale, kind: 'content-locale', detail: `missing sites/${siteSlug}/content/${locale}.json` })
        continue
      }
      const siteContent = readJson<Record<string, unknown>>(contentPath)
      const verticalCopyPath = repoPath('src', 'verticals', site.vertical, 'copy', `${locale}.json`)
      const verticalCopy = existsSync(verticalCopyPath) ? readJson<Record<string, unknown>>(verticalCopyPath) : {}

      for (const pageSlug of pages) {
        const page = readJson<{ sections: Array<{ id: string; variant?: string; content?: string }> }>(repoPath('sites', siteSlug, 'pages', `${pageSlug}.json`))
        for (const section of page.sections) {
          const manifest = SECTION_CATALOG[section.id]
          if (!manifest) {
            problems.push({ site: siteSlug, page: pageSlug, kind: 'section', detail: `unknown section id "${section.id}"` })
            continue
          }
          if (section.variant && !manifest.variants.includes(section.variant)) {
            problems.push({ site: siteSlug, page: pageSlug, kind: 'variant', detail: `section "${section.id}" has no variant "${section.variant}"` })
          }
          if (vertical.allowedSections && !vertical.allowedSections.includes(section.id)) {
            problems.push({ site: siteSlug, page: pageSlug, kind: 'allowed', detail: `section "${section.id}" not allowed for vertical "${site.vertical}"` })
          }
          if (section.content) {
            const hit = resolveRefInLocale(section.content, siteContent, verticalCopy)
            if (hit === undefined) {
              problems.push({ site: siteSlug, page: pageSlug, locale, kind: 'content-ref', detail: `content ref "${section.content}" missing for locale ${locale}` })
            }
          }
        }
      }
    }
  }

  if (problems.length === 0) {
    console.log(`validate-sites: ${sites.length} site(s) OK`)
    process.exit(0)
  }

  console.error(`validate-sites: ${problems.length} problem(s):\n`)
  for (const p of problems) {
    const loc = [p.page && `page=${p.page}`, p.locale && `locale=${p.locale}`].filter(Boolean).join(' ')
    console.error(`  ✗ [${p.site}${loc ? ' ' + loc : ''}] ${p.kind}: ${p.detail}`)
  }
  process.exit(1)
}

main()
