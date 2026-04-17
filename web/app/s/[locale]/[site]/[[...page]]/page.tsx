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
import { loadVerticalCopy } from '@/lib/engine/site-loader'

interface Props {
  params: Promise<{ locale: string; site: string; page?: string[] }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const params: Array<{ locale: string; site: string; page?: string[] }> = []
  for (const slug of listSiteSlugs()) {
    let site
    try { site = loadSite(slug) } catch { continue }
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
    return {
      title: composed.meta.title,
      description: composed.meta.description,
      alternates: { languages: alternates },
      openGraph: {
        title: composed.meta.title,
        description: composed.meta.description,
        locale,
      },
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
    console.error(`[TenantPage] Error composing page for ${siteSlug}/${pageSlug}:`, error)
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexaparaguay.com'
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
