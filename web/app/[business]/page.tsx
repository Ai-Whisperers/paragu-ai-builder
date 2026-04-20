import { notFound } from 'next/navigation'
import { composePage } from '@/lib/engine/compose'
import { renderSections } from '@/lib/engine/renderer'
import { loadBusiness } from '@/lib/engine/data-loader'
import { getRegistry, REGISTRY_MAP } from '@/lib/engine/static-config'
import { getAllDemoSlugs } from '@/lib/engine/demo-data'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ business: string }>
}

export const dynamicParams = true // Allow any business slug

/**
 * Pre-render slugs that warrant SSG. Priority order:
 *   1. Demo fixtures still referenced by data-loader's fallback path.
 *   2. Top-N types by declared leadCount (from src/registry/index.json).
 *      These are the Paraguay priority types where fast first-paint matters.
 *
 * Everything else renders on-demand via ISR (dynamicParams=true above).
 */
const PRERENDER_TOP_N_TYPES = 50

export async function generateStaticParams() {
  const demoSlugs = getAllDemoSlugs()

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
  const businessData = await loadBusiness(slug)
  if (!businessData) return { title: 'No encontrado' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
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
  }
}

export default async function BusinessPage({ params }: Props) {
  // TODO: Add ISR with revalidate for business pages
  // TODO: Implement edge caching with Cloudflare Workers
  // TODO: Add error boundary for graceful degradation
  const { business: slug } = await params
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
    </>
  )
}