import type { Locale } from '@/lib/i18n/config'
import type {
  SiteDefinition,
  PageDefinition,
  VerticalDefinition,
} from './site-types'
import { SITES, type SiteSlug } from './static-sites'

declare const EdgeRuntime: string | undefined
const isEdge = typeof EdgeRuntime !== 'undefined'

// Static site paths - hardcoded for Edge Runtime compatibility
const SITES_DIR = '/home/ai-whisperers/paragu-ai-builder/sites'
const SRC_DIR = '/home/ai-whisperers/paragu-ai-builder/src'

// Lazy load Node modules only when needed (not on Edge)
let fs: typeof import('fs') | null = null
let path: typeof import('path') | null = null

function getFs() {
  if (isEdge) return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  if (!fs) fs = require('fs')
  return fs
}

function getPath() {
  if (isEdge) return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  if (!path) path = require('path')
  return path
}

function repoPath(...segments: string[]): string {
  const p = getPath()
  // If first segment is 'src', use SRC_DIR (project root source)
  // Otherwise use SITES_DIR (sites directory)
  const baseDir = segments[0] === 'src' ? SRC_DIR : SITES_DIR
  const actualSegments = segments[0] === 'src' ? segments.slice(1) : segments
  
  if (!p) {
    return baseDir + '/' + actualSegments.join('/')
  }
  // Always use hardcoded absolute path for reliability
  return p.resolve(baseDir, ...actualSegments)
}

function readJson<T>(path: string): T {
  const f = getFs()
  if (!f) return {} as T
  return JSON.parse(f.readFileSync(path, 'utf-8')) as T
}

function loadSiteFromStatic(slug: SiteSlug): SiteDefinition {
  const site = SITES[slug]
  if (!site) {
    throw new Error(`Site not found: ${slug}`)
  }
  
  // Load full site configuration from site.json
  const f = getFs()
  const siteJsonPath = repoPath(slug, 'site.json')
  let siteConfig: Partial<SiteDefinition> = {}
  
  if (f?.existsSync(siteJsonPath)) {
    try {
      siteConfig = readJson<Partial<SiteDefinition>>(siteJsonPath)
    } catch {
      // If site.json fails to load, use defaults
    }
  }
  
  return {
    slug: site.slug,
    vertical: site.vertical,
    country: site.country,
    domain: site.domain,
    defaultLocale: site.defaultLocale as 'nl' | 'en' | 'de' | 'es',
    locales: [...site.locales] as Array<'nl' | 'en' | 'de' | 'es'>,
    navigation: siteConfig.navigation ?? [],
    integrations: siteConfig.integrations ?? {},
    features: siteConfig.features ?? {},
    contact: siteConfig.contact ?? { whatsapp: '', email: '' },
    ...siteConfig, // Spread any additional properties from site.json
  }
}

function loadPagesFromStatic(slug: SiteSlug): string[] {
  return [...(SITES[slug]?.pages ?? ['home'])]
}

export function listSiteSlugs(): string[] {
  return Object.keys(SITES)
}

export function loadSite(slug: string): SiteDefinition {
  if (slug in SITES) {
    return loadSiteFromStatic(slug as SiteSlug)
  }
  const f = getFs()
  const p = getPath()
  if (!f || !p) {
    throw new Error(`Site not found: ${slug}`)
  }
  const sitePath = repoPath(slug, 'site.json')
  if (!f.existsSync(sitePath)) {
    throw new Error(`Site not found: ${slug}`)
  }
  const raw = readJson<Omit<SiteDefinition, 'slug'>>(sitePath)
  return { ...raw, slug }
}

export function loadPage(siteSlug: string, pageSlug: string): PageDefinition | null {
  // Validate page exists in static config (if it's a static site)
  if (siteSlug in SITES) {
    const pages = SITES[siteSlug as SiteSlug]?.pages ?? []
    if (!(pages as readonly string[]).includes(pageSlug)) return null
    // Fall through to load from disk below
  }

  // Load actual page definition from JSON file
  const f = getFs()
  const p = getPath()
  if (!f || !p) return null

  const pagePath = repoPath(siteSlug, 'pages', `${pageSlug}.json`)
  if (!f.existsSync(pagePath)) return null
  return readJson<PageDefinition>(pagePath)
}

export function listPageSlugs(siteSlug: string): string[] {
  if (siteSlug in SITES) {
    return loadPagesFromStatic(siteSlug as SiteSlug)
  }
  const f = getFs()
  const dir = repoPath(siteSlug, 'pages')
  if (!f?.existsSync(dir)) return []
  return f.readdirSync(dir)
    .filter((file: string) => file.endsWith('.json'))
    .map((file: string) => file.replace(/\.json$/, ''))
}

export function loadSiteContent(
  siteSlug: string,
  locale: Locale,
): Record<string, unknown> {
  const f = getFs()
  const path = repoPath(siteSlug, 'content', `${locale}.json`)
  if (!f?.existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}

export function loadVertical(verticalId: string): VerticalDefinition {
  if (isEdge) {
    return {
      id: verticalId,
      name: verticalId,
      features: {},
      schema: {},
      starterKits: [],
    }
  }
  const f = getFs()
  const p = getPath()
  if (!f || !p) {
    return {
      id: verticalId,
      name: verticalId,
      features: {},
      schema: {},
      starterKits: [],
    }
  }
  const base = repoPath('src', 'verticals', verticalId)
  const verticalJson = readJson<{
    id: string
    name: string
    features: Record<string, boolean>
    allowedSections?: string[]
  }>(p.join(base, 'vertical.json'))
  const schema = readJson<Record<string, unknown>>(p.join(base, 'schema.json'))
  const starterKitsDir = p.join(base, 'starter-kits')
  const starterKits = f.existsSync(starterKitsDir)
    ? f.readdirSync(starterKitsDir)
        .filter((file: string) => file.endsWith('.pages.json'))
        .map((file: string) => file.replace(/\.pages\.json$/, ''))
    : []
  return { ...verticalJson, schema, starterKits }
}

export function loadVerticalCopy(
  verticalId: string,
  locale: Locale,
): Record<string, unknown> {
  if (isEdge) {
    return {}
  }
  const f = getFs()
  const path = repoPath('src', 'verticals', verticalId, 'copy', `${locale}.json`)
  if (!f?.existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}

export function loadVerticalTokens(verticalId: string): Record<string, unknown> {
  if (isEdge) {
    return {}
  }
  const f = getFs()
  const path = repoPath('src', 'verticals', verticalId, 'defaults.tokens.json')
  if (!f?.existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}

export function loadSiteTokens(siteSlug: string): Record<string, unknown> {
  if (isEdge) {
    return {}
  }
  const f = getFs()
  const path = repoPath(siteSlug, 'tokens.json')
  if (!f?.existsSync(path)) return {}
  return readJson<Record<string, unknown>>(path)
}