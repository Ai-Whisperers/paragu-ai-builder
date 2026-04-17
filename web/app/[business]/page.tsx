import { notFound } from 'next/navigation'
import { composePage } from '@/lib/engine/compose'
import { renderSections } from '@/lib/engine/renderer'
import { loadBusiness, loadAllSlugs } from '@/lib/engine/data-loader'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ business: string }>
}

export const dynamicParams = true // Enable SSR for all business pages (including new types)

export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  return slugs.map((slug) => ({ business: slug }))
}

function generateJsonLd(business: { type: string; name: string; slug: string; address?: string; city: string; phone?: string; email?: string; whatsapp?: string; googleMapsUrl?: string; services?: Array<{ name: string; price?: string; description?: string }> }, baseUrl: string) {
  const schemaTypes: Record<string, string> = {
    peluqueria: 'BeautySalon',
    salon_belleza: 'BeautySalon',
    gimnasio: 'FitnessCenter',
    spa: 'HealthAndBeautyBusiness',
    unas: 'NailSalon',
    tatuajes: 'TattooParlor',
    barberia: 'BarberShop',
    estetica: 'BeautySalon',
    maquillaje: 'BeautySalon',
    depilacion: 'HealthAndBeautyBusiness',
    pestanas: 'BeautySalon',
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaTypes[business.type] || 'LocalBusiness',
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
  const { business: slug } = await params
  const businessData = await loadBusiness(slug)
  if (!businessData) notFound()

  const page = await composePage(businessData)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.theme.cssString }} />
      {page.theme.googleFontsUrl && (
        <link rel="stylesheet" href={page.theme.googleFontsUrl} />
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