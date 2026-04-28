import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { composeSitePage } from '@/lib/engine/compose-site'
import { renderPage } from '@/lib/engine/site-renderer'
import { listSiteSlugs, loadSite, listPageSlugs, loadSiteContent } from '@/lib/engine/site-loader'
import { loadImagesManifest, resolveImage } from '@/lib/engine/images-loader'
import { alternatesFor } from '@/lib/i18n/routing'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { jsonLdForPage } from '@/lib/engine/schema-org'
import { buildLcpPreloadTags } from '@/lib/seo/lcp-preload'
import { CookieBanner } from '@/components/consent/cookie-banner'
import { Ga4Loader } from '@/components/analytics/ga4-loader'
import { DemoBadge } from '@/components/universal/demo-badge'
import { DemoLeadBar } from '@/components/universal/demo-lead-bar'
import { loadVerticalCopy } from '@/lib/engine/site-loader'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

/**
 * Force dynamic rendering across all tenant pages.
 *
 * Why: tenant pages can include sections (commerce-catalog, featured-products)
 * whose data fetches hit the Supabase admin client, which uses `cookies()`
 * internally — forbidden during SSG. A section-level `noStore()` isn't
 * enough because Next.js still logs DYNAMIC_SERVER_USAGE and bubbles a 500
 * when the route was pre-scheduled for static generation.
 *
 * Rather than hunt every transitive dynamic API or gate sections at compose
 * time, opt the whole catch-all out of static generation. The SSG benefit
 * for tenant marketing pages was already limited (dynamicParams=true,
 * frequent content edits), and PRERENDER_SKIP_SITES was growing anyway.
 * This trade gives unambiguous correctness: no more 500s when a tenant
 * opts in to a commerce section.
 */
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ locale: string; site: string; page?: string[] }>
}

export const dynamicParams = true

// Tenants whose content currently throws during prerender (content-shape
// mismatch producing `.map` on undefined). They render fine at request
// time via SSR; remove entries as the underlying shape is fixed.
const PRERENDER_SKIP_SITES = new Set<string>([
  'nexa-propiedades',
  'fun4me',
  'de-abasto-a-casa',
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
    const pageDef = (composed.page ?? {}) as { hiddenFromSitemap?: boolean }
    const alternates = alternatesFor(siteSlug, site.locales, pageSlug === 'home' ? '' : pageSlug)
    const isDemo = Boolean((site as { is_demo?: boolean }).is_demo)
    // Point OG image at the tenant-specific handler at
    // /s/[locale]/[site]/opengraph-image.tsx. Without this explicit
    // reference Next.js picks up the ROOT /opengraph-image.tsx (because
    // defining `openGraph` in generateMetadata replaces the file-based
    // metadata auto-discovery), which leaks the generic ParaguAI OG to
    // every tenant's social shares.
    const ogImagePath = `/s/${locale}/${siteSlug}/opengraph-image`
    // Prefer the tenant's pre-rendered brand assets when the images
    // manifest ships them — favicon/apple-touch/OG all get resolved
    // below and threaded into the Metadata object.
    const manifest = loadImagesManifest(siteSlug)
    const faviconAsset = resolveImage(manifest, 'brand.favicon')
    const appleAsset = resolveImage(manifest, 'brand.appleTouchIcon')
    const ogDefault = resolveImage(manifest, 'brand.ogDefault')
    const twitterCardAsset = resolveImage(manifest, 'brand.twitterCard')

    const icons: NonNullable<Metadata['icons']> = {}
    if (faviconAsset) icons.icon = [{ url: faviconAsset.src }]
    if (appleAsset) icons.apple = [{ url: appleAsset.src }]

    const ogImageUrl = ogDefault?.src ?? ogImagePath
    const twitterImageUrl = twitterCardAsset?.src ?? ogImageUrl

    return {
      // Use `absolute` so the root layout's `%s | ParaguAI Builder` template
      // doesn't bleed into tenant pages. Each tenant owns its own browser
      // title and SEO headline end-to-end.
      title: { absolute: composed.meta.title },
      description: composed.meta.description,
      alternates: { languages: alternates },
      ...(Object.keys(icons).length > 0 && { icons }),
      manifest: `/s/${locale}/${siteSlug}/manifest.webmanifest`,
      openGraph: {
        title: composed.meta.title,
        description: composed.meta.description,
        locale,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: composed.meta.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: composed.meta.title,
        description: composed.meta.description,
        images: [twitterImageUrl],
      },
      // Demo tenants must not compete in search with real client sites or
      // the marketing site itself. Excludes them from indexing while still
      // serving the page for prospects we link manually.
      // Hidden pages (`hiddenFromSitemap`) are ad landings — also noindex.
      ...((isDemo || pageDef.hiddenFromSitemap) && {
        robots: { index: false, follow: false },
      }),
    }
  } catch {
    return { title: 'Not found' }
  }
}

export default async function TenantPage({ params, searchParams }: Props & { searchParams?: Promise<Record<string, string>> }) {
  const { locale, site: siteSlug, page } = await params
  if (!isLocale(locale)) notFound()
  const pageSlug = page?.[0] || 'home'
  const sp = searchParams ? await searchParams : {}
  const demoName = sp.demo_name
  const demoCity = sp.demo_city

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

  // Preload the LCP hero image on home + landing pages. The hero section
  // is the first composed section with id "hero" — pull its background
  // image props so the browser can start the fetch before HTML parsing.
  // We only emit preload tags for pages where the hero is above the fold
  // (home + landings); deeper pages don't benefit because the hero is
  // already the main content. Skip if the section ships without imagery.
  const heroPages = new Set(['home', 'inversor', 'trust', 'lifestyle', 'empresa'])
  const isHeroPage = heroPages.has(pageSlug)
  const heroSection = isHeroPage
    ? composed.sections.find((s) => s.id === 'hero')
    : undefined
  const heroProps = heroSection?.props as {
    backgroundImage?: string
    backgroundImageMobile?: string
  } | undefined
  const lcpPreloadTags = heroProps
    ? buildLcpPreloadTags({
        heroImage: heroProps.backgroundImage,
        heroImageMobile: heroProps.backgroundImageMobile,
      })
    : []

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

      {lcpPreloadTags.map((tag, i) => (
        <link
          // eslint-disable-next-line react/no-unknown-property
          key={`lcp-${i}`}
          rel={tag.rel}
          as={tag.as}
          href={tag.href}
          {...(tag.media ? { media: tag.media } : {})}
          // React's types for `fetchPriority` on <link> lag behind Next 15
          // (lowercase was non-standard, camelCase became the React prop
          // name in 19). Emit both to cover SSR + CSR serialization.
          fetchPriority={tag.fetchPriority as 'high'}
        />
      ))}

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

      <DemoBadge isDemo={Boolean((composed.site as { is_demo?: boolean }).is_demo)} vertical={composed.site.vertical} locale={locale} />
      <DemoLeadBar isDemo={Boolean((composed.site as { is_demo?: boolean }).is_demo)} siteSlug={siteSlug} vertical={composed.site.vertical} locale={locale} />

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
