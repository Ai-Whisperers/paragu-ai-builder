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
import { fillDeep, mergeOverrides, resolveRef } from './resolve-copy'
import { resolveSiteTokens } from './resolve-site-tokens'
import {
  hasSection,
  hasVariant,
  defaultVariant,
} from './section-registry'
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

  const placeholders = {
    siteName: (siteContent.siteName as string) || site.slug,
    country: site.country,
    ...(siteContent.placeholders as Record<string, string | number | undefined> || {}),
    year: new Date().getFullYear(),
  }

  const copyCtx = { siteContent, verticalCopy, placeholders }

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

        const props: Record<string, unknown> = {
          ...filled,
          __siteSlug: site.slug,
          __locale: locale,
          __country: site.country,
          __availableLocales: site.locales,
          __currentPath: pageSlug === DEFAULT_PAGE_SLUG ? '' : pageSlug,
        }
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
