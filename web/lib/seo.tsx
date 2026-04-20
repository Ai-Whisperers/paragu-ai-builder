import { Metadata } from 'next'

/**
 * SEO Meta Manager
 * 
 * Comprehensive SEO utilities for all business types:
 * - Dynamic metadata generation
 * - OpenGraph optimization
 * - Twitter Cards
 * - Structured data (JSON-LD) helpers
 * - Canonical URL management
 * - Robots meta control
 * - Sitemap helpers
 */

// ============================================
// TYPES
// ============================================

export interface SEOMetaConfig {
  title: string
  description: string
  /** Full URL for canonical */
  canonical?: string
  /** OpenGraph image URL */
  ogImage?: string
  /** Override site name */
  siteName?: string
  /** Article published time */
  publishedTime?: string
  /** Article modified time */
  modifiedTime?: string
  /** Article author */
  author?: string
  /** Article tags */
  tags?: string[]
  /** No index this page */
  noIndex?: boolean
  /** No follow links */
  noFollow?: boolean
  /** Alternate language URLs */
  alternates?: Record<string, string>
  /** Page type for structured data */
  type?: 'website' | 'article' | 'product' | 'service' | 'localBusiness'
  /** Structured data (JSON-LD) */
  jsonLd?: Record<string, unknown>
}

export interface BusinessSchema {
  name: string
  description: string
  url: string
  logo?: string
  telephone?: string
  email?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  priceRange?: string
  image?: string
  sameAs?: string[]
}

export interface ArticleSchema {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
  url: string
}

export interface ProductSchema {
  name: string
  description: string
  image: string
  url: string
  brand?: string
  sku?: string
  offers?: {
    price: number
    priceCurrency: string
    availability: 'InStock' | 'OutOfStock' | 'PreOrder'
    url?: string
  }
  review?: {
    rating: number
    count: number
  }
}

export interface FAQSchema {
  questions: Array<{
    question: string
    answer: string
  }>
}

export interface BreadcrumbSchema {
  items: Array<{
    name: string
    item?: string
  }>
}

// ============================================
// METADATA GENERATOR
// ============================================

/**
 * Generate comprehensive Next.js metadata from SEO config.
 * 
 * @example
 * export const metadata = generateMetadata({
 *   title: 'Services - My Business',
 *   description: 'Our professional services',
 *   ogImage: 'https://site.com/og.jpg',
 *   canonical: 'https://site.com/services',
 *   type: 'website',
 * })
 */
export function generateSEO(config: SEOMetaConfig): Metadata {
  const {
    title,
    description,
    canonical,
    ogImage,
    siteName = 'Paragu Business',
    publishedTime,
    modifiedTime,
    author,
    tags,
    noIndex = false,
    noFollow = false,
    alternates = {},
  } = config

  // Build OpenGraph
  const openGraph: Metadata['openGraph'] = {
    title,
    description,
    siteName,
    locale: 'es_PY',
    type: config.type === 'article' ? 'article' : 'website',
  }

  // Add article-specific OG tags using proper Next.js Metadata structure
  if (config.type === 'article' && publishedTime) {
    // Use articles property for article-specific metadata
    (openGraph as Record<string, unknown>).publishedTime = publishedTime
    if (modifiedTime) {
      (openGraph as Record<string, unknown>).modifiedTime = modifiedTime
    }
    if (author) {
      (openGraph as Record<string, unknown>).authors = [author]
    }
    if (tags) {
      (openGraph as Record<string, unknown>).tags = tags
    }
  }

  // Add OG images
  if (ogImage) {
    openGraph.images = [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ]
  }

  // Build Twitter card
  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title,
    description,
  }
  if (ogImage) {
    twitter.images = [ogImage]
  }

  // Build alternates
  const alternateLanguages: Record<string, string> = {}
  Object.entries(alternates).forEach(([lang, url]) => {
    alternateLanguages[lang] = url
  })

  return {
    title,
    description,
    openGraph,
    twitter,
    alternates: {
      canonical,
      languages: Object.keys(alternateLanguages).length > 0 ? alternateLanguages : undefined,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Additional metadata
    authors: author ? [{ name: author }] : undefined,
    keywords: tags,
    verification: {
      // Add verification codes here
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

// ============================================
// STRUCTURED DATA GENERATORS
// ============================================

/**
 * Generate LocalBusiness schema for business sites.
 * 
 * @example
 * const businessSchema = generateLocalBusinessSchema({
 *   name: 'Studio Hair',
 *   description: 'Premium hair salon in Asunción',
 *   url: 'https://studiohair.com',
 *   telephone: '+595 21 123 456',
 *   address: {
 *     streetAddress: 'Av. Mcal. López 123',
 *     addressLocality: 'Asunción',
 *     addressRegion: 'Asunción',
 *     postalCode: '001',
 *     addressCountry: 'PY',
 *   },
 *   openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-14:00'],
 * })
 */
export function generateLocalBusinessSchema(business: BusinessSchema): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url,
    logo: business.logo,
    telephone: business.telephone,
    email: business.email,
    image: business.image,
    priceRange: business.priceRange,
    sameAs: business.sameAs,
    address: business.address ? {
      '@type': 'PostalAddress',
      ...business.address,
    } : undefined,
    geo: business.geo ? {
      '@type': 'GeoCoordinates',
      ...business.geo,
    } : undefined,
    openingHoursSpecification: business.openingHours?.map(hours => {
      // Parse hours string like "Mo-Fr 09:00-18:00"
      const [days, times] = hours.split(' ')
      const [opens, closes] = times.split('-')
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split('-').map(day => {
          const dayMap: Record<string, string> = {
            'Mo': 'Monday', 'Tu': 'Tuesday', 'We': 'Wednesday',
            'Th': 'Thursday', 'Fr': 'Friday', 'Sa': 'Saturday', 'Su': 'Sunday'
          }
          return dayMap[day] || day
        }),
        opens,
        closes,
      }
    }),
  }
}

/**
 * Generate Article schema for blog posts.
 * 
 * @example
 * const articleSchema = generateArticleSchema({
 *   headline: '10 Tips for Better Hair',
 *   description: 'Learn how to care for your hair',
 *   image: 'https://site.com/image.jpg',
 *   datePublished: '2024-01-15',
 *   author: { name: 'Jane Doe' },
 *   publisher: { name: 'Studio Hair', logo: 'https://site.com/logo.png' },
 *   url: 'https://site.com/blog/tips',
 * })
 */
export function generateArticleSchema(article: ArticleSchema): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  }
}

/**
 * Generate Product schema for e-commerce/catalog items.
 * 
 * @example
 * const productSchema = generateProductSchema({
 *   name: 'Premium Hair Treatment',
 *   description: 'Deep conditioning treatment',
 *   image: 'https://site.com/product.jpg',
 *   url: 'https://site.com/products/treatment',
 *   offers: {
 *     price: 50.00,
 *     priceCurrency: 'USD',
 *     availability: 'InStock',
 *   },
 *   review: { rating: 4.5, count: 23 },
 * })
 */
export function generateProductSchema(product: ProductSchema): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
  }

  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand,
    }
  }

  if (product.sku) {
    schema.sku = product.sku
    schema.mpn = product.sku
  }

  if (product.offers) {
    schema.offers = {
      '@type': 'Offer',
      url: product.offers.url || product.url,
      priceCurrency: product.offers.priceCurrency,
      price: product.offers.price.toFixed(2),
      availability: `https://schema.org/${product.offers.availability}`,
    }
  }

  if (product.review) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.review.rating,
      reviewCount: product.review.count,
    }
  }

  return schema
}

/**
 * Generate FAQ schema for FAQ sections.
 * 
 * @example
 * const faqSchema = generateFAQSchema({
 *   questions: [
 *     { question: 'What are your hours?', answer: '9am to 6pm' },
 *     { question: 'Do you take walk-ins?', answer: 'Yes, but appointments preferred' },
 *   ],
 * })
 */
export function generateFAQSchema(faq: FAQSchema): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

/**
 * Generate BreadcrumbList schema.
 * 
 * @example
 * const breadcrumbSchema = generateBreadcrumbSchema({
 *   items: [
 *     { name: 'Home', item: 'https://site.com/' },
 *     { name: 'Services', item: 'https://site.com/services' },
 *     { name: 'Hair Styling' },
 *   ],
 * })
 */
export function generateBreadcrumbSchema(breadcrumb: BreadcrumbSchema): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

/**
 * Generate Service schema for service businesses.
 * 
 * @example
 * const serviceSchema = generateServiceSchema({
 *   name: 'Hair Styling',
 *   description: 'Professional hair styling services',
 *   provider: 'Studio Hair',
 *   url: 'https://site.com/services/hair-styling',
 *   areaServed: 'Asunción, Paraguay',
 * })
 */
export function generateServiceSchema(service: {
  name: string
  description: string
  provider: string
  url: string
  areaServed?: string
  image?: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: service.provider,
    },
    url: service.url,
    areaServed: service.areaServed,
    image: service.image,
  }
}

/**
 * Generate WebSite schema with search functionality.
 * 
 * @example
 * const websiteSchema = generateWebSiteSchema({
 *   name: 'Studio Hair',
 *   url: 'https://studiohair.com',
 *   searchUrl: 'https://studiohair.com/search?q={search_term_string}',
 * })
 */
export function generateWebSiteSchema(site: {
  name: string
  url: string
  searchUrl?: string
  logo?: string
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
  }

  if (site.logo) {
    schema.logo = site.logo
  }

  if (site.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.searchUrl,
      },
      'query-input': 'required name=search_term_string',
    }
  }

  return schema
}

// ============================================
// COMPONENT: JSON-LD INJECTOR
// ============================================

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Inject JSON-LD structured data into the page.
 * 
 * @example
 * <JsonLd data={generateLocalBusinessSchema(business)} />
 * 
 * @example
 * // Multiple schemas
 * <JsonLd data={[
 *   generateWebSiteSchema(site),
 *   generateLocalBusinessSchema(business),
 *   generateFAQSchema(faq),
 * ]} />
 */
export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

// ============================================
// HELPER: CANONICAL URL
// ============================================

/**
 * Generate canonical URL for a page.
 * 
 * @example
 * const canonical = generateCanonicalUrl({
 *   baseUrl: 'https://mibusiness.com',
 *   pathname: '/services/hair-styling',
 *   locale: 'es',
 * })
 * // Returns: https://mibusiness.com/es/services/hair-styling
 */
export function generateCanonicalUrl({
  baseUrl,
  pathname,
  locale,
  queryParams = {},
}: {
  baseUrl: string
  pathname: string
  locale?: string
  queryParams?: Record<string, string>
}): string {
  let url = baseUrl.replace(/\/$/, '')
  
  if (locale && locale !== 'es') {
    url += `/${locale}`
  }
  
  url += pathname.startsWith('/') ? pathname : `/${pathname}`
  
  const query = new URLSearchParams(queryParams).toString()
  if (query) {
    url += `?${query}`
  }
  
  return url
}

// ============================================
// HELPER: OG IMAGE URL
// ============================================

/**
 * Generate OpenGraph image URL with text overlay.
 * Uses a dynamic OG image generator endpoint.
 * 
 * @example
 * const ogImage = generateOGImageUrl({
 *   title: 'Services - My Business',
 *   description: 'Professional services in Paraguay',
 *   baseUrl: 'https://mibusiness.com',
 * })
 */
export function generateOGImageUrl({
  title,
  description,
  image,
  baseUrl,
}: {
  title: string
  description?: string
  image?: string
  baseUrl: string
}): string {
  const params = new URLSearchParams({
    title: title.slice(0, 100),
  })
  
  if (description) {
    params.set('description', description.slice(0, 200))
  }
  
  if (image) {
    params.set('image', image)
  }
  
  return `${baseUrl}/api/og?${params.toString()}`
}

// ============================================
// PAGE SEO WRAPPER COMPONENT
// ============================================

import { ReactNode } from 'react'

interface PageSEOProps {
  children: ReactNode
  meta: SEOMetaConfig
  /** Structured data schemas */
  schemas?: Record<string, unknown>[]
  /** Preconnect to these domains */
  preconnect?: string[]
  /** Prefetch these URLs */
  prefetch?: string[]
}

/**
 * SEO wrapper component for pages.
 * Combines metadata, structured data, and performance hints.
 * 
 * @example
 * <PageSEO
 *   meta={{
 *     title: 'Services',
 *     description: 'Our professional services',
 *     ogImage: 'https://site.com/og.jpg',
 *   }}
 *   schemas={[
 *     generateLocalBusinessSchema(business),
 *     generateWebSiteSchema(site),
 *   ]}
 *   preconnect={['https://fonts.googleapis.com']}
 * >
 *   <PageContent />
 * </PageSEO>
 */
export function PageSEO({
  children,
  meta,
  schemas,
  preconnect,
  prefetch,
}: PageSEOProps) {
  return (
    <>
      {/* Preconnect hints */}
      {preconnect?.map((url) => (
        <link key={url} rel="preconnect" href={url} />
      ))}
      
      {/* Prefetch hints */}
      {prefetch?.map((url) => (
        <link key={url} rel="prefetch" href={url} />
      ))}
      
      {/* Structured data */}
      {schemas && <JsonLd data={schemas} />}
      
      {children}
    </>
  )
}
