import { notFound, redirect } from 'next/navigation'
import { composePage } from '@/lib/engine/compose'
import { renderSections } from '@/lib/engine/renderer'
import { DemoBadge } from '@/components/universal/demo-badge'
import { loadBusiness } from '@/lib/engine/data-loader'
import { getRegistry, REGISTRY_MAP } from '@/lib/engine/static-config'
import { getAllDemoSlugs } from '@/lib/engine/demo-data'
import { listSiteSlugs, loadSite } from '@/lib/engine/site-loader'
import { getAppUrl } from '@/lib/env'
import type { Metadata } from 'next'

/**
 * If the flat slug corresponds to a modern tenant under `sites/`,
 * redirect to the locale-prefixed route so /nexaparaguay becomes
 * /s/es/nexaparaguay. Keeps the flat URL working as a convenience
 * entry point while the canonical render lives at `/s/<locale>/<slug>`.
 *
 * Returns the locale-prefixed path if a matching site exists, else null.
 */
function siteRedirectPath(slug: string): string | null {
  // Legacy alias: /nexaparaguay (one-word) was the broken duplicate tenant
  // before it was deleted. Anyone with the old URL bookmarked or in social
  // graphs gets redirected to the canonical multi-locale route.
  if (slug === 'nexaparaguay') return '/s/en/nexa-paraguay'
  try {
    const siteSlugs = listSiteSlugs()
    if (!siteSlugs.includes(slug)) return null
    const site = loadSite(slug)
    const locale = site.defaultLocale || site.locales?.[0] || 'es'
    return `/s/${locale}/${slug}`
  } catch {
    return null
  }
}

interface Props {
  params: Promise<{ business: string }>
}

// Flat-pattern tenant handler. Forced dynamic so the runtime can
// check sites/ for modern tenants and redirect/rewrite without
// tripping Next.js's static→dynamic guard.
export const dynamic = 'force-dynamic'
export const dynamicParams = true

/**
 * Pre-render slugs that warrant SSG. Priority order:
 *   1. Demo fixtures still referenced by data-loader's fallback path.
 *   2. Top-N types by declared leadCount (from src/registry/index.json).
 *      These are the Paraguay priority types where fast first-paint matters.
 *
 * Everything else renders on-demand via ISR (dynamicParams=true above).
 */
const PRERENDER_TOP_N_TYPES = 50

// Real-tenant slugs render fine at request time but currently throw
// during prerender due to content-shape mismatches with the legacy
// flat-pattern composer. Excluded here; they fall through to SSR via
// dynamicParams=true. Remove entries as the underlying shape is fixed.
const PRERENDER_SKIP = new Set([
  'dayah-litworks',
  'de-abasto-a-casa',
  'nexa-paraguay',
  'nexa-propiedades',
])

export async function generateStaticParams() {
  const demoSlugs = getAllDemoSlugs().filter((s) => !PRERENDER_SKIP.has(s))

  const topTypesBySlug = Object.entries(REGISTRY_MAP)
    .map(([id, entry]) => ({
      id,
      leadCount: (entry as { leadCount?: number }).leadCount ?? 0,
    }))
    .filter((e) => e.leadCount > 0)
    .sort((a, b) => b.leadCount - a.leadCount)
    .slice(0, PRERENDER_TOP_N_TYPES)
    .map((e) => e.id)

  const slugs = Array.from(new Set([...demoSlugs, ...topTypesBySlug]))
  return slugs.map((slug) => ({ business: slug }))
}

function generateJsonLd(business: { type: string; name: string; slug: string; address?: string; city: string; phone?: string; email?: string; whatsapp?: string; googleMapsUrl?: string; services?: Array<{ name: string; price?: string; description?: string }> }, baseUrl: string) {
  const registry = getRegistry(business.type) as { seo?: { schemaType?: string } } | null
  const schemaType = registry?.seo?.schemaType || 'LocalBusiness'

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: business.name,
    ...(business.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: business.city,
        addressRegion: 'PY',
        addressCountry: 'PY',
      },
    }),
    ...(business.phone && {
      telephone: business.phone,
    }),
    ...(business.email && {
      email: business.email,
    }),
    ...(business.whatsapp && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: business.whatsapp,
        contactType: 'customer service',
        availableTime: [
          { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00', closes: '20:00' },
        ],
      },
    }),
    ...(business.googleMapsUrl && {
      hasMap: business.googleMapsUrl,
    }),
    ...(business.services?.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios',
        itemListElement: business.services.slice(0, 10).map((s) => ({
          '@type': 'Offer',
          name: s.name,
          ...(s.price && { price: s.price }),
          ...(s.description && { description: s.description }),
        })),
      },
    }),
    url: `${baseUrl}/${business.slug}`,
  }

  return JSON.stringify(schema)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { business: slug } = await params
  // Modern sites/ tenants redirect to locale-prefixed canonical — no
  // need to generate metadata here; the redirect target's metadata wins.
  if (siteRedirectPath(slug)) return {}
  const businessData = await loadBusiness(slug)
  if (!businessData) return { title: 'No encontrado' }

  const baseUrl = getAppUrl()
  const page = await composePage(businessData)

  return {
    title: page.meta.title,
    description: page.meta.description,
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      type: 'website',
      url: `${baseUrl}/${slug}`,
    },
    other: {
      'schema:application': generateJsonLd(businessData, baseUrl),
    },
    // Demo tenants must not compete in search. /demo qualifier converts.
    ...(businessData.isDemo && { robots: { index: false, follow: false } }),
  }
}

export default async function BusinessPage({ params }: Props) {
  const { business: slug } = await params

  // Modern `sites/` tenants (nexaparaguay, dayah-litworks, de-abasto-a-casa,
  // etc.) redirect to the locale-prefixed canonical route so the flat URL
  // `paragu-ai.com/<slug>` still works as a convenience entry point.
  const redirectTo = siteRedirectPath(slug)
  if (redirectTo) redirect(redirectTo)

  // Legacy demo + registry-driven businesses render inline.
  const businessData = await loadBusiness(slug)
  if (!businessData) notFound()

  const page = await composePage(businessData)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.theme.cssString }} />
      {/* Google Fonts — precedence tells React 19 to manage this as a
          blocking style resource so it doesn't get orphan-preloaded. */}
      {page.theme.googleFontsUrl && (
        <link rel="stylesheet" href={page.theme.googleFontsUrl} precedence="default" />
      )}
      <div
        className="min-h-screen"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        {renderSections(page.sections)}
      </div>
      <DemoBadge isDemo={businessData.isDemo} vertical={businessData.type} />
    </>
  )
}