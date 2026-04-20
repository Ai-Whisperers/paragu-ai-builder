/**
 * JSON-LD builders per section type. Returns a valid schema.org object ready
 * to be stringified and injected into <script type="application/ld+json">.
 *
 * Section-specific structured data beyond LocalBusiness (hero/services/
 * testimonials/products) makes the tenant eligible for rich search results
 * (FAQ rich result, Product cards, Review stars).
 */

export interface BusinessShape {
  name: string
  url?: string
  description?: string
  telephone?: string
  address?: { streetAddress?: string; city?: string; region?: string; country?: string }
  image?: string
}

export function localBusiness(b: BusinessShape, schemaType = 'LocalBusiness'): object {
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: b.name,
    url: b.url,
    description: b.description,
    telephone: b.telephone,
    image: b.image,
    ...(b.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: b.address.streetAddress,
            addressLocality: b.address.city,
            addressRegion: b.address.region,
            addressCountry: b.address.country,
          },
        }
      : {}),
  }
}

export function faqPage(items: Array<{ q: string; a: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function breadcrumbList(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

export function productOffers(products: Array<{ name: string; price?: string; description?: string; imageUrl?: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    itemListElement: products.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price,
      priceCurrency: detectCurrency(p.price),
      ...(p.description ? { description: p.description } : {}),
      ...(p.imageUrl ? { image: p.imageUrl } : {}),
    })),
  }
}

function detectCurrency(price?: string): string | undefined {
  if (!price) return undefined
  if (/\$/.test(price)) return 'USD'
  if (/€/.test(price)) return 'EUR'
  if (/Gs/.test(price)) return 'PYG'
  return undefined
}

export function aggregateRating(avg: number, count: number): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: avg.toFixed(1),
    reviewCount: count,
  }
}
