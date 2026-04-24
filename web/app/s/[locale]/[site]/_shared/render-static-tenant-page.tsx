import { notFound } from 'next/navigation'
import { composeSitePage } from '@/lib/engine/compose-site'
import { renderPage } from '@/lib/engine/site-renderer'
import { loadSiteContent, loadVerticalCopy } from '@/lib/engine/site-loader'
import { jsonLdForPage } from '@/lib/engine/schema-org'
import { CookieBanner } from '@/components/consent/cookie-banner'
import { Ga4Loader } from '@/components/analytics/ga4-loader'
import { DemoBadge } from '@/components/universal/demo-badge'
import type { Locale } from '@/lib/i18n/config'
import { logger } from '@/lib/logger'

/**
 * Renders a tenant page from static JSON (`sites/<slug>/pages/<page>.json`)
 * using the same pipeline as the catch-all `[[...page]]` route. Exists so
 * hard-coded commerce routes (`/producto/[slug]`, `/tienda`) can fall back
 * to the static JSON renderer when the tenant has no Supabase-backed
 * commerce data — instead of 404ing and hiding 23 pre-generated PDPs.
 *
 * Safe to call from any server component. Calls `notFound()` itself if the
 * requested page slug has no JSON file; callers should not wrap in try/catch.
 */
export async function renderStaticTenantPage({
  siteSlug,
  locale,
  pageSlug,
}: {
  siteSlug: string
  locale: Locale
  pageSlug: string
}) {
  let composed
  try {
    composed = composeSitePage({ siteSlug, locale, pageSlug })
  } catch (error) {
    logger.error('renderStaticTenantPage: composition failed', {
      action: 'renderStaticTenantPage',
      siteSlug,
      locale,
      pageSlug,
      error: error instanceof Error ? error.message : String(error),
    })
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.com'
  const jsonLd = jsonLdForPage(composed, baseUrl)
  const verticalCopy = loadVerticalCopy(composed.site.vertical, composed.locale)
  const cookieCopy = (verticalCopy.common as Record<string, unknown> | undefined)?.cookieBanner as
    | {
        title: string
        body: string
        acceptAll: string
        acceptEssential: string
        manage: string
        privacyLabel: string
      }
    | undefined
  const siteContent = loadSiteContent(siteSlug, locale)
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

      <DemoBadge
        isDemo={Boolean((composed.site as { is_demo?: boolean }).is_demo)}
        vertical={composed.site.vertical}
        locale={locale}
      />

      {ga4MeasurementId && <Ga4Loader measurementId={ga4MeasurementId} />}

      {cookieCopy && (
        <CookieBanner
          copy={{
            ...cookieCopy,
            privacyHref: privacyPath,
          }}
        />
      )}

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
