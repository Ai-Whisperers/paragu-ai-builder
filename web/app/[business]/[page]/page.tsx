import { notFound } from 'next/navigation'
import { composePageForType } from '@/lib/engine/compose'
import { renderSections } from '@/lib/engine/renderer'
import { loadBusiness, loadAllSlugs } from '@/lib/engine/data-loader'
import type { Metadata } from 'next'
import type { PageType } from '@/lib/types'

export const runtime = 'edge'

interface Props {
  params: Promise<{ business: string; page: string }>
}

export const dynamicParams = true // Enable SSR for all pages

export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  const pages = ['servicios', 'galeria', 'equipo', 'contacto']
  return slugs.flatMap((slug) => pages.map((page) => ({ business: slug, page })))
}

function generateJsonLd(business: { type: string; name: string; slug: string; address?: string; city: string; phone?: string }, baseUrl: string) {
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
    ...(business.phone && { telephone: business.phone }),
    url: `${baseUrl}/${business.slug}`,
  }

  return JSON.stringify(schema)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { business: slug, page } = await params
  const businessData = await loadBusiness(slug)
  if (!businessData) return { title: 'No encontrado' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const pageData = await composePageForType(businessData, page as PageType)

  return {
    title: pageData.meta.title,
    description: pageData.meta.description,
    openGraph: {
      title: pageData.meta.title,
      description: pageData.meta.description,
      type: 'website',
      url: `${baseUrl}/${slug}/${page}`,
    },
    other: {
      'schema:application': generateJsonLd(businessData, baseUrl),
    },
  }
}

export default async function BusinessPage({ params }: Props) {
  const { business: slug, page } = await params
  const businessData = await loadBusiness(slug)
  if (!businessData) notFound()

  const pageData = await composePageForType(businessData, page as 'homepage' | 'services' | 'gallery' | 'team' | 'contact')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageData.theme.cssString }} />
      {pageData.theme.googleFontsUrl && (
        <link rel="stylesheet" href={pageData.theme.googleFontsUrl} />
      )}
      <div
        className="min-h-screen"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        {renderSections(pageData.sections)}
      </div>
    </>
  )
}