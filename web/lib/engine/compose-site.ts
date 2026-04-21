/**
 * Tenant page composition engine.
 *
 * Input:   site slug + locale + page slug
 * Output:  ResolvedPage ready for rendering
 *
 * Pipeline:
 *   sites/<slug>/site.json           → tenant config (vertical, locales, nav, integrations)
 *   sites/<slug>/pages/<page>.json   → section composition chosen by tenant
 *   sites/<slug>/content/<loc>.json  → tenant content values
 *   src/verticals/<v>/copy/<loc>.json→ vertical copy templates with {{placeholders}}
 *   src/verticals/<v>/schema.json    → data shape hints
 *   resolveSiteTokens()              → merged CSS vars
 */
import type { Locale } from '@/lib/i18n/config'
import { buildLocaleUrl } from '@/lib/i18n/routing'
import type { ResolvedPage, SiteDefinition, PageDefinition } from './site-types'
import {
  loadSite,
  loadPage,
  loadSiteContent,
  loadVerticalCopy,
  loadVertical,
} from './site-loader'
import { loadImagesManifest } from './images-loader'
import { fillDeep, mergeOverrides, resolveRef } from './resolve-copy'
import { resolveSiteTokens } from './resolve-site-tokens'
import {
  hasSection,
  hasVariant,
  defaultVariant,
} from './section-registry'
import { listBlogPosts } from './blog-loader'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/obs/metrics'

const DEFAULT_PAGE_SLUG = 'home'

export interface ComposeInput {
  siteSlug: string
  locale: Locale
  pageSlug?: string
}

export function composeSitePage(input: ComposeInput): ResolvedPage {
  const { siteSlug, locale } = input
  const pageSlug = input.pageSlug || DEFAULT_PAGE_SLUG
  const start = performance.now()
  const baseContext = { action: 'composeSitePage', siteSlug, locale, pageSlug }

  const site: SiteDefinition = loadSite(siteSlug)

  if (!site.locales.includes(locale)) {
    logger.error('Site composition: locale not enabled', {
      ...baseContext,
      enabledLocales: site.locales,
    })
    throw new Error(
      `[compose-site] Locale "${locale}" not enabled for site "${siteSlug}"`,
    )
  }

  const page: PageDefinition | null = loadPage(siteSlug, pageSlug)
  if (!page) {
    logger.error('Site composition: page not found', baseContext)
    throw new Error(`[compose-site] Page "${pageSlug}" not found for site "${siteSlug}"`)
  }

  const siteContent = loadSiteContent(siteSlug, locale)
  const verticalCopy = loadVerticalCopy(site.vertical, locale)
  const vertical = loadVertical(site.vertical)
  const imagesManifest = loadImagesManifest(siteSlug)

  const placeholders = {
    siteName: (siteContent.siteName as string) || site.slug,
    country: site.country,
    ...(siteContent.placeholders as Record<string, string | number | undefined> || {}),
    year: new Date().getFullYear(),
  }

  const copyCtx = { siteContent, verticalCopy, placeholders, images: imagesManifest, locale }

  const resolvedSections = page.sections
    .filter((s) => shouldInclude(s.enabledWhen, site.features))
    .map((s) => {
      if (!hasSection(s.id)) {
        logger.error('Site composition: unknown section id', { ...baseContext, sectionId: s.id })
        throw new Error(
          `[compose-site] Unknown section id "${s.id}" on page "${pageSlug}"`,
        )
      }
      const variant = s.variant || defaultVariant(s.id)
      if (!hasVariant(s.id, variant)) {
        logger.error('Site composition: unknown section variant', {
          ...baseContext,
          sectionId: s.id,
          variant,
        })
        throw new Error(
          `[compose-site] Variant "${variant}" not available for section "${s.id}"`,
        )
      }

      try {
        const base = s.content ? (resolveRef(s.content, copyCtx) as Record<string, unknown>) : {}
        const merged = mergeOverrides(base, s.overrides)
        const filled = fillDeep(merged, placeholders) as Record<string, unknown>

        // Normalize legacy prop names for known section components
        const normalized = normalizeSectionProps(s.id, filled)

        // Rewrite bare-'/' navItem hrefs to the tenant's home URL.
        // Content authors reasonably write href:"/" for "Home", but on
        // a tenant page that would bounce the shopper to the platform
        // root (paragu-ai.com) instead of keeping them inside the
        // tenant. Does nothing when navItems isn't an array or no item
        // needs rewriting — safe on every section.
        if (s.id === 'header' && Array.isArray(normalized.navItems)) {
          const tenantHome = site.path ?? `/s/${locale}/${siteSlug}`
          normalized.navItems = (normalized.navItems as Array<Record<string, unknown>>).map(
            (item) => {
              const href = typeof item.href === 'string' ? item.href : ''
              if (href === '' || href === '/') return { ...item, href: tenantHome }
              return item
            },
          )
        }

        const propsWithContext: Record<string, unknown> = {
          ...normalized,
          __siteSlug: site.slug,
          __locale: locale,
          __country: site.country,
          __availableLocales: site.locales,
          __currentPath: pageSlug === DEFAULT_PAGE_SLUG ? '' : pageSlug,
        }
        const withCommerce = injectCommerceSiteContext(s.id, propsWithContext, siteContent.siteName)
        const props = injectBlogIndexPosts(s.id, withCommerce, siteSlug, locale)
        return { id: s.id, variant, props }
      } catch (err) {
        logger.error('Site composition: section content resolution failed', {
          ...baseContext,
          sectionId: s.id,
          variant,
          contentRef: s.content,
          error: err instanceof Error ? err.message : String(err),
        })
        throw err
      }
    })

  if (vertical.allowedSections) {
    const disallowed = resolvedSections.find(
      (s) => !vertical.allowedSections!.includes(s.id),
    )
    if (disallowed) {
      logger.error('Site composition: section disallowed for vertical', {
        ...baseContext,
        vertical: site.vertical,
        disallowedSection: disallowed.id,
      })
      throw new Error(
        `[compose-site] Section "${disallowed.id}" not allowed for vertical "${site.vertical}"`,
      )
    }
  }

  const title = resolveMeta(page.titleKey, copyCtx) || (siteContent.siteName as string) || site.slug
  const description = resolveMeta(page.descriptionKey, copyCtx) || ''
  const path = pageSlug === DEFAULT_PAGE_SLUG ? '' : pageSlug
  const tokens = resolveSiteTokens(site.vertical, siteSlug)

  const duration = Math.round(performance.now() - start)
  logger.info('Site composition completed', {
    ...baseContext,
    vertical: site.vertical,
    sectionCount: resolvedSections.length,
    durationMs: duration,
  })
  metrics.timing('compose.duration', duration, {
    siteSlug,
    vertical: site.vertical,
    locale,
    pageSlug,
  })

  return {
    site,
    locale,
    page,
    sections: resolvedSections,
    meta: {
      title: String(title),
      description: String(description),
      schemaType: page.schemaType,
      path: buildLocaleUrl(locale, siteSlug, path),
    },
    theme: {
      cssString: tokens.cssString,
      googleFontsUrl: tokens.googleFontsUrl,
      isDark: tokens.isDark,
    },
  }
}

function resolveMeta(key: string | undefined, ctx: Parameters<typeof resolveRef>[1]): string | undefined {
  if (!key) return undefined
  const hit = resolveRef(key, ctx)
  return typeof hit === 'string' ? hit : undefined
}

function shouldInclude(
  enabledWhen: string | undefined,
  features: Record<string, boolean> | undefined,
): boolean {
  if (!enabledWhen) return true
  const truthy = enabledWhen.startsWith('!')
    ? !features?.[enabledWhen.slice(1)]
    : !!features?.[enabledWhen]
  return truthy
}

/**
 * Normalize legacy/alternative prop names to canonical names that components expect.
 * This handles cases where content files use different field names (e.g., `items` vs `services`).
 */
function normalizeSectionProps(sectionId: string, props: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...props }

  switch (sectionId) {
    case 'header':
      if (normalized.items && !normalized.navItems) {
        normalized.navItems = normalized.items
      }
      if (normalized.businessName === undefined && normalized.siteName) {
        normalized.businessName = normalized.siteName
      }
      break
    case 'services':
      if (normalized.items && !normalized.services) {
        normalized.services = normalized.items
      }
      break
    case 'testimonials':
      if (normalized.items && !normalized.testimonials) {
        normalized.testimonials = normalized.items
      }
      break
    case 'faq':
      if (normalized.questions && !normalized.items) {
        normalized.items = normalized.questions
      }
      break
    case 'gallery':
      if (normalized.logos && !normalized.images) {
        normalized.images = (normalized.logos as Array<Record<string, unknown>>).map((logo) => ({
          src: (logo.src as string) || (logo.image as string) || '',
          alt: (logo.alt as string) || (logo.name as string) || '',
        }))
      }
      break
    case 'footer': {
      // `normalized` values are `unknown`; narrow location/contact before
      // forwarding fields so TS stops complaining (matches runtime shape).
      const loc = normalized.location as { city?: string; address?: string } | undefined
      const con = normalized.contact as { phone?: string; email?: string; whatsapp?: string } | undefined
      if (normalized.city === undefined && loc?.city) normalized.city = loc.city
      if (normalized.address === undefined && loc?.address) normalized.address = loc.address
      if (normalized.phone === undefined && con?.phone) normalized.phone = con.phone
      if (normalized.email === undefined && con?.email) normalized.email = con.email
      if (normalized.whatsapp === undefined && con?.whatsapp) normalized.whatsapp = con.whatsapp
      break
    }
    case 'whatsapp-float':
    case 'whatsappFloat':
      if (normalized.number && !normalized.phone) {
        normalized.phone = normalized.number
      }
      break
    case 'product-catalog':
      if (normalized.items && !normalized.products) {
        normalized.products = normalized.items
      }
      break
  }

  return normalized
}

/**
 * Sections whose components expect `siteSlug` / `businessName` as regular
 * props — the compose-site pipeline normally injects only `__siteSlug`
 * etc., so these commerce-aware sections get an explicit mapping to the
 * unprefixed names after the rest of the props pipeline runs.
 *
 * Kept separate from `normalizeSectionProps` so it can run AFTER the
 * `__` keys are merged in (normalizeSectionProps runs before).
 */
const COMMERCE_SECTIONS_NEEDING_SITE_CONTEXT = new Set<string>([
  'commerce-catalog',
  'featured-products',
])

function injectCommerceSiteContext(
  sectionId: string,
  props: Record<string, unknown>,
  siteName: unknown,
): Record<string, unknown> {
  if (!COMMERCE_SECTIONS_NEEDING_SITE_CONTEXT.has(sectionId)) return props
  const next = { ...props }
  if (next.siteSlug === undefined && typeof next.__siteSlug === 'string') {
    next.siteSlug = next.__siteSlug
  }
  if (next.businessName === undefined && typeof siteName === 'string') {
    next.businessName = siteName
  }
  return next
}

/**
 * Connects the blog-index section to the blog-loader.
 *
 * The content config (`blog.index`) only carries the header copy
 * (title / subtitle / seo). The actual post list lives under
 * `sites/<slug>/blog/<locale>/*.mdx` and gets loaded via
 * `listBlogPosts`. Without this, every blog-index renders empty.
 *
 * Callers can still override by providing `posts` in the content ref
 * (escape hatch for mock data or fully-manual post lists).
 */
function injectBlogIndexPosts(
  sectionId: string,
  props: Record<string, unknown>,
  siteSlug: string,
  locale: Locale,
): Record<string, unknown> {
  if (sectionId !== 'blog-index') return props
  if (Array.isArray(props.posts) && props.posts.length > 0) return props
  const posts = listBlogPosts(siteSlug, locale).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    category: p.category,
    coverImage: p.coverImage,
    readingMinutes: p.readingMinutes,
    href: `/s/${locale}/${siteSlug}/blog/${p.slug}`,
  }))
  return { ...props, posts }
}
