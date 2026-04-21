import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { composeSitePage } from '@/lib/engine/compose-site'
import { renderPage } from '@/lib/engine/site-renderer'
import { listSiteSlugs, loadSite, listPageSlugs, loadSiteContent } from '@/lib/engine/site-loader'
import { alternatesFor } from '@/lib/i18n/routing'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { jsonLdForPage } from '@/lib/engine/schema-org'
import { CookieBanner } from '@/components/consent/cookie-banner'
import { Ga4Loader } from '@/components/analytics/ga4-loader'
import { DemoBadge } from '@/components/universal/demo-badge'
import { loadVerticalCopy } from '@/lib/engine/site-loader'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

interface Props {
  params: Promise<{ locale: string; site: string; page?: string[] }>
}

export const dynamicParams = true

// Tenants whose content currently throws during prerender (content-shape
// mismatch producing `.map` on undefined). They render fine at request
// time via SSR; remove entries as the underlying shape is fixed.
const PRERENDER_SKIP_SITES = new Set<string>([
  'nexa-uruguay',
  'nexa-propiedades',
  'fun4me',
  'dayah-litworks',
  'de-abasto-a-casa',
  'granja-cabral',
])

export async function generateStaticParams() {
  const params: Array<{ locale: string; site: string; page?: string[] }> = []
  for (const slug of listSiteSlugs()) {
    if (PRERENDER_SKIP_SITES.has(slug)) continue
    let site
    try {
      site = loadSite(slug)
    } catch (error) {
      logger.warn('generateStaticParams: skipping site — loadSite failed', {
        action: 'generateStaticParams',
        siteSlug: slug,
        error: error instanceof Error ? error.message : String(error),
      })
      continue
    }
    for (const loc of site.locales) {
      const pages = listPageSlugs(slug)
      for (const pageSlug of pages) {
        const pageParam = pageSlug === 'home' ? [] : [pageSlug]
        params.push({ locale: loc, site: slug, page: pageParam })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, site: siteSlug, page } = await params
  if (!isLocale(locale)) return { title: 'Not found' }
  const pageSlug = page?.[0] || 'home'
  try {
    const composed = composeSitePage({ siteSlug, locale, pageSlug })
    const site = composed.site
    const alternates = alternatesFor(siteSlug, site.locales, pageSlug === 'home' ? '' : pageSlug)
    const isDemo = Boolean((site as { is_demo?: boolean }).is_demo)
    return {
      title: composed.meta.title,
      description: composed.meta.description,
      alternates: { languages: alternates },
      openGraph: {
        title: composed.meta.title,
        description: composed.meta.description,
        locale,
      },
      // Demo tenants must not compete in search with real client sites or
      // the marketing site itself. Excludes them from indexing while still
      // serving the page for prospects we link manually.
      ...(isDemo && { robots: { index: false, follow: false } }),
    }
  } catch {
    return { title: 'Not found' }
  }
}

export default async function TenantPage({ params }: Props) {
  const { locale, site: siteSlug, page } = await params
  if (!isLocale(locale)) notFound()
  const pageSlug = page?.[0] || 'home'

  let composed
  try {
    composed = composeSitePage({ siteSlug, locale: locale as Locale, pageSlug })
  } catch (error) {
    logger.error('TenantPage composition failed — rendering 404', {
      action: 'composeSitePage',
      siteSlug,
      locale,
      pageSlug,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.com'
  const jsonLd = jsonLdForPage(composed, baseUrl)

  const verticalCopy = loadVerticalCopy(composed.site.vertical, composed.locale)
  const cookieCopy = (verticalCopy.common as Record<string, unknown> | undefined)?.cookieBanner as
    | { title: string; body: string; acceptAll: string; acceptEssential: string; manage: string; privacyLabel: string }
    | undefined
  const siteContent = loadSiteContent(siteSlug, locale as Locale)
  const privacyPath = `/s/${locale}/${siteSlug}/privacidad`

  const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_ID

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: composed.theme.cssString }} />
      {composed.theme.googleFontsUrl && (
        <link rel="stylesheet" href={composed.theme.googleFontsUrl} />
      )}

      {jsonLd.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <div
        className="min-h-screen"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        {renderPage(composed)}
      </div>

      <DemoBadge isDemo={Boolean((composed.site as { is_demo?: boolean }).is_demo)} vertical={composed.site.vertical} />

      {ga4MeasurementId && <Ga4Loader measurementId={ga4MeasurementId} />}

      {cookieCopy && (
        <CookieBanner
          copy={{
            ...cookieCopy,
            privacyHref: privacyPath,
          }}
        />
      )}

      {/* siteContent referenced so static analyzer keeps the import tree */}
      {process.env.NODE_ENV === 'development' && (
        <script
          type="application/json"
          id="__site_content_debug"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(Object.keys(siteContent)) }}
        />
      )}
    </>
  )
}
