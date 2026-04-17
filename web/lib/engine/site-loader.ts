import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import type { Locale } from '@/lib/i18n/config'
import type {
  SiteDefinition,
  PageDefinition,
  VerticalDefinition,
} from './site-types'

// Static site paths - hardcoded for Edge Runtime compatibility
const SITES_DIR = '/home/ai-whisperers/paragu-ai-builder/sites'
const SRC_DIR = '/home/ai-whisperers/paragu-ai-builder/src'

function repoPath(...segments: string[]): string {
  const base = typeof __dirname !== 'undefined' ? resolve(__dirname, '..', '..') : SITES_DIR
  return resolve(base, ...segments)
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

export function listSiteSlugs(): string[] {
  const sitesDir = repoPath('sites')
  if (!existsSync(sitesDir)) return []
  return readdirSync(sitesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

export function loadSite(slug: string): SiteDefinition {
  const path = repoPath('sites', slug, 'site.json')
  const raw = readJson<Omit<SiteDefinition, 'slug'>>(path)
  return { ...raw, slug }
}

export function loadPage(siteSlug: string, pageSlug: string): PageDefinition | null {
  const path = repoPath('sites', siteSlug, 'pages', `${pageSlug}.json`)
  if (!existsSync(path)) return null
  return readJson<PageDefinition>(path)
}

export function listPageSlugs(siteSlug: string): string[] {
  const dir = repoPath('sites', siteSlug, 'pages')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
}

export function loadSiteContent(
  siteSlug: string,
  locale: Locale,
): Record<string, unknown> {
  const path = repoPath('sites', siteSlug, 'content', `${locale}.json`)
  if (!existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}

export function loadVertical(verticalId: string): VerticalDefinition {
  const base = repoPath('src', 'verticals', verticalId)
  const verticalJson = readJson<{
    id: string
    name: string
    features: Record<string, boolean>
    allowedSections?: string[]
  }>(join(base, 'vertical.json'))
  const schema = readJson<Record<string, unknown>>(join(base, 'schema.json'))
  const starterKitsDir = join(base, 'starter-kits')
  const starterKits = existsSync(starterKitsDir)
    ? readdirSync(starterKitsDir)
        .filter((f) => f.endsWith('.pages.json'))
        .map((f) => f.replace(/\.pages\.json$/, ''))
    : []
  return { ...verticalJson, schema, starterKits }
}

export function loadVerticalCopy(
  verticalId: string,
  locale: Locale,
): Record<string, unknown> {
  const path = repoPath('src', 'verticals', verticalId, 'copy', `${locale}.json`)
  if (!existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}

export function loadVerticalTokens(verticalId: string): Record<string, unknown> {
  const path = repoPath('src', 'verticals', verticalId, 'defaults.tokens.json')
  if (!existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}

export function loadSiteTokens(siteSlug: string): Record<string, unknown> {
  const path = repoPath('sites', siteSlug, 'tokens.json')
  if (!existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}
