/**
 * JSON-LD structured data components for SEO.
 * Emits schema.org markup for Organization, Service, and FAQPage.
 */

import type { BusinessData } from '@/lib/engine/compose'

interface JsonLdProps {
  data: Record<string, unknown>
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd({
  business,
  baseUrl,
}: {
  business: BusinessData
  baseUrl: string
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: business.name,
    url: `${baseUrl}/${business.slug}`,
    description: business.tagline,
  }

  if (business.address || business.city) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressCountry: 'PY',
    }
  }

  const sameAs: string[] = []
  if (business.instagram) sameAs.push(`https://instagram.com/${business.instagram.replace('@', '')}`)
  if (business.facebook) sameAs.push(`https://facebook.com/${business.facebook}`)
  if (sameAs.length > 0) data.sameAs = sameAs

  if (business.phone) data.telephone = business.phone
  if (business.email) data.email = business.email

  return <JsonLd data={data} />
}

export function FAQJsonLd({ items }: { items: Array<{ q: string; a: string }> }) {
  if (!items || items.length === 0) return null

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }}
    />
  )
}

export function ServiceJsonLd({
  business,
  services,
}: {
  business: BusinessData
  services: Array<{ name: string; description?: string; price?: string }>
}) {
  if (!services || services.length === 0) return null

  return (
    <>
      {services.map((svc, idx) => (
        <JsonLd
          key={idx}
          data={{
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: svc.name,
            description: svc.description,
            provider: {
              '@type': 'Organization',
              name: business.name,
            },
            areaServed: {
              '@type': 'Country',
              name: 'Paraguay',
            },
            ...(svc.price ? { offers: { '@type': 'Offer', price: svc.price } } : {}),
          }}
        />
      ))}
    </>
  )
}
