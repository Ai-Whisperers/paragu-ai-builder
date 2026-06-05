import { getSiteName } from "@/lib/config/config"
import { siteConfig } from "@/lib/config/config"
import type { SiteConfig } from "@/lib/content-types"

type BusinessSchema = {
  '@context': string
  '@type': string
  name: string
  image: string
  description: string
  address: { '@type': string; streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string }
  geo: { '@type': string; latitude: string; longitude: string }
  url: string
  telephone: string
  priceRange: string
  openingHoursSpecification: Array<{ '@type': string; dayOfWeek: string | string[]; opens: string; closes: string }>
  sameAs: string[]
}

type ProductSchema = {
  '@context': string
  '@type': string
  name: string
  image?: string
  description?: string
  brand: { '@type': string; name: string }
  offers: { '@type': string; price: string | number; priceCurrency: string; availability: string; url: string }
  aggregateRating?: { '@type': string; ratingValue: number; reviewCount: number }
}

type ArticleSchema = {
  '@context': string
  '@type': string
  headline: string
  image?: string
  author: { '@type': string; name: string }
  datePublished: string
  dateModified: string
  publisher: { '@type': string; name: string; logo: { '@type': string; url: string } }
}

type BreadcrumbSchema = {
  '@context': string
  '@type': string
  itemListElement: Array<{ '@type': string; position: number; name: string; item: string }>
}

function getConfig(): SiteConfig {
  return siteConfig as SiteConfig
}

export function generateBusinessSchema(): BusinessSchema {
  const cfg = getConfig()
  const slug = cfg.site?.slug || 'tu-emprendimiento'
  const name = getSiteName()
  const type = cfg.business?.type || 'LocalBusiness'
  const schema: BusinessSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    image: `https://${slug}.paragu-ai.com/images/logo.png`,
    description: cfg.business?.description || `${name} - Professional services in Asunción`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: cfg.business?.address || 'Av. principal 123',
      addressLocality: 'Asunción',
      addressRegion: 'Asunción',
      postalCode: '001101',
      addressCountry: 'PY'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: cfg.business?.coordinates?.lat?.toString() || '-25.2868',
      longitude: cfg.business?.coordinates?.lng?.toString() || '-57.6328'
    },
    url: `https://${slug}.paragu-ai.com`,
    telephone: cfg.business?.phone || '+595 981 123456',
    priceRange: (cfg.business as Record<string, unknown>)?.priceRange as string || '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00'
      }
    ],
    sameAs: [
      `https://www.instagram.com/${cfg.business?.instagramHandle?.replace('@','') || slug}`,
      `https://www.facebook.com/${slug}`
    ]
  }
  return schema
}

export function generateProductSchema(product: { name?: string; image?: string; description?: string; price?: string | number; id?: string | number; rating?: number; reviews_count?: number }): ProductSchema {
  const p = product
  const cfg = getConfig()
  const slug = cfg.site?.slug || 'tu-emprendimiento'
  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name!,
    image: p.image,
    description: p.description,
    brand: {
      '@type': 'Brand',
      name: `${getSiteName()} Professional`
    },
    offers: {
      '@type': 'Offer',
      price: p.price!,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://${slug}.paragu-ai.com/products/${p.id}`
    },
    aggregateRating: p.rating ? {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      reviewCount: p.reviews_count || 0
    } : undefined
  }
  return schema
}

export function generateArticleSchema(article: { title?: string; image?: string; author?: string; date?: string }): ArticleSchema {
  const a = article
  const cfg = getConfig()
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title!,
    image: a.image,
    author: {
      '@type': 'Person',
      name: a.author!,
    },
    datePublished: a.date!,
    dateModified: a.date!,
    publisher: {
      '@type': 'Organization',
      name: getSiteName(),
      logo: {
        '@type': 'ImageObject',
        url: `https://${cfg.site?.slug || 'tu-emprendimiento'}.paragu-ai.com/images/logo.png`
      }
    }
  }
  return schema
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]): BreadcrumbSchema {
  const schema: BreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
  return schema
}
