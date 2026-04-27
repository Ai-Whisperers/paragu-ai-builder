/**
 * JSON-LD builders for tenant pages. Emits schema.org-valid objects that the
 * page template stringifies into `<script type="application/ld+json">` tags.
 *
 * Why: rich results eligibility (Organization logo, BlogPosting cards,
 * ImageGallery previews, Service offers) depends on well-formed structured
 * data. These builders return `object` — callers wrap in `JSON.stringify`.
 */
import type { ImagesManifest } from '@/lib/engine/images-loader'
import { resolveImage } from '@/lib/engine/images-loader'

export interface BusinessShape {
  name: string
  url?: string
  description?: string
  telephone?: string
  address?: { streetAddress?: string; city?: string; region?: string; country?: string }
  image?: string
}

export interface SiteShape {
  slug: string
  country?: string
  defaultLocale?: string
  contact?: {
    phone?: string
    whatsapp?: string
    email?: string
    address?: string
  }
  social?: Record<string, string>
}

export interface ContentShape {
  siteName?: string
  tagline?: string
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

/** Alias kept so callers can name-match the Round-2 spec. */
export const buildBreadcrumbList = breadcrumbList

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

/* ------------------------------------------------------------------ */
/* Round 2 builders                                                    */
/* ------------------------------------------------------------------ */

/**
 * Emit an Organization node for the tenant. Uses the images manifest's
 * `brand.logo` when present; `sameAs` pulls from site.social.
 */
export function buildOrganization(
  site: SiteShape,
  content: ContentShape,
  manifest: ImagesManifest | null,
  baseUrl: string,
): object {
  const logoAsset = resolveImage(manifest, 'brand.logo')
  const sameAs = site.social
    ? Object.values(site.social).filter((v): v is string => typeof v === 'string' && v.length > 0)
    : []
  const defaultLocale = site.defaultLocale || 'en'
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: content.siteName || site.slug,
    url: `${baseUrl}/s/${defaultLocale}/${site.slug}`,
    ...(content.tagline ? { description: content.tagline } : {}),
    ...(logoAsset
      ? {
          logo: {
            '@type': 'ImageObject',
            url: absoluteUrl(baseUrl, logoAsset.src),
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(site.country ? { areaServed: site.country } : {}),
    ...(site.contact?.email || site.contact?.phone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            ...(site.contact?.email ? { email: site.contact.email } : {}),
            ...(site.contact?.phone ? { telephone: site.contact.phone } : {}),
          },
        }
      : {}),
  }
}

export interface BlogPostLike {
  slug: string
  title: string
  date?: string
  author?: string
  excerpt?: string
  category?: string
  coverImage?: string
}

/**
 * BlogPosting JSON-LD. Resolves a cover image through the images manifest
 * using the `blog.<camelSlug>` convention when no explicit frontmatter
 * `coverImage` is set.
 */
export function buildBlogPosting(
  post: BlogPostLike,
  site: SiteShape,
  content: ContentShape,
  manifest: ImagesManifest | null,
  baseUrl: string,
  locale: string,
): object {
  const image = resolveBlogCover(post, manifest)
  const publisherLogo = resolveImage(manifest, 'brand.logo')
  const url = `${baseUrl}/s/${locale}/${site.slug}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: url,
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(image ? { image: absoluteUrl(baseUrl, image) } : {}),
    ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    ...(post.author
      ? { author: { '@type': 'Person', name: post.author } }
      : {}),
    ...(post.category ? { articleSection: post.category } : {}),
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: content.siteName || site.slug,
      ...(publisherLogo
        ? {
            logo: {
              '@type': 'ImageObject',
              url: absoluteUrl(baseUrl, publisherLogo.src),
            },
          }
        : {}),
    },
  }
}

function resolveBlogCover(
  post: BlogPostLike,
  manifest: ImagesManifest | null,
): string | undefined {
  if (post.coverImage) return post.coverImage
  const camel = post.slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
  const hit = resolveImage(manifest, `blog.${camel}`)
  return hit?.src
}

export interface ImageItem {
  src: string
  alt?: string
  caption?: string
}

/**
 * ImageGallery + associatedMedia[] ImageObject for press-kit style pages.
 */
export function buildImageGallery(
  images: ImageItem[],
  site: SiteShape,
  baseUrl: string,
  pageUrl: string,
  title: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    url: pageUrl,
    inLanguage: site.defaultLocale || 'en',
    numberOfItems: images.length,
    associatedMedia: images.map((img) => ({
      '@type': 'ImageObject',
      contentUrl: absoluteUrl(baseUrl, img.src),
      ...(img.alt ? { name: img.alt } : {}),
      ...(img.caption ? { caption: img.caption } : {}),
    })),
  }
}

export interface ServiceTier {
  id?: string
  name?: string
  description?: string
  price?: string
  priceNote?: string
  included?: string[]
  ctaHref?: string
  ctaLabel?: string
}

/**
 * Service JSON-LD with offers[]. Emits one Service per tier; callers that
 * want a single Service node can filter the returned array.
 */
export function buildService(
  tier: ServiceTier,
  site: SiteShape,
  content: ContentShape,
  baseUrl: string,
  pagePath: string,
): object {
  const provider = content.siteName || site.slug
  const currency = detectCurrency(tier.price) || 'USD'
  const priceValue = tier.price ? tier.price.replace(/[^\d.]/g, '') : undefined
  const url = `${baseUrl}${pagePath}${tier.id ? `#${tier.id}` : ''}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: tier.name || tier.id || 'Service',
    ...(tier.description ? { description: tier.description } : {}),
    provider: { '@type': 'Organization', name: provider },
    ...(site.country ? { areaServed: site.country } : {}),
    url,
    ...(priceValue
      ? {
          offers: {
            '@type': 'Offer',
            price: priceValue,
            priceCurrency: currency,
            url,
            ...(tier.ctaHref ? { availability: 'https://schema.org/InStock' } : {}),
          },
        }
      : {}),
    ...(tier.included && tier.included.length > 0
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${tier.name} — included`,
            itemListElement: tier.included.map((item, i) => ({
              '@type': 'Offer',
              position: i + 1,
              itemOffered: { '@type': 'Service', name: item },
            })),
          },
        }
      : {}),
  }
}

/**
 * Wrap a Service[] in an ItemList so /programas emits a single structured
 * node Google indexes as a Services directory.
 */
export function buildServiceItemList(
  services: object[],
  title: string,
  pageUrl: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    url: pageUrl,
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: stripContext(s),
    })),
  }
}

function stripContext(obj: object): object {
  const copy = { ...(obj as Record<string, unknown>) }
  delete copy['@context']
  return copy
}

/**
 * Convert a relative `/path` into an absolute URL using the provided
 * `baseUrl` (already without a trailing slash). Absolute inputs are
 * returned untouched.
 */
function absoluteUrl(baseUrl: string, src: string): string {
  if (/^https?:\/\//.test(src)) return src
  const base = baseUrl.replace(/\/$/, '')
  const path = src.startsWith('/') ? src : `/${src}`
  return `${base}${path}`
}

/**
 * Product schema for PDPs (commerce or pre-commerce). Emits Offer with
 * priceCurrency + availability. When the product has size variants,
 * each becomes an `Offer` under an `AggregateOffer` so Google can show
 * a price range in SERP.
 */
export interface ProductShape {
  name: string
  sku?: string
  description?: string
  brand?: string
  category?: string
  image?: string | string[]
  priceFromGs?: number
  sizes?: Array<{ label: string; dimensions?: string; priceGs: number }>
  warranty?: string
  url: string
  aggregateRating?: { ratingValue: number; reviewCount: number }
}

export function buildProduct(p: ProductShape, baseUrl: string): object {
  const images = Array.isArray(p.image)
    ? p.image.map((i) => absoluteUrl(baseUrl, i))
    : p.image
      ? [absoluteUrl(baseUrl, p.image)]
      : undefined

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    url: p.url,
  }
  if (p.sku) schema.sku = p.sku
  if (p.description) schema.description = p.description
  if (images) schema.image = images
  if (p.brand) schema.brand = { '@type': 'Brand', name: p.brand }
  if (p.category) schema.category = p.category
  if (p.warranty) {
    schema.additionalProperty = [
      { '@type': 'PropertyValue', name: 'Garantía', value: p.warranty },
    ]
  }

  if (p.sizes && p.sizes.length > 0) {
    const prices = p.sizes.map((s) => s.priceGs).filter((n) => typeof n === 'number')
    if (prices.length > 0) {
      schema.offers = {
        '@type': 'AggregateOffer',
        priceCurrency: 'PYG',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: p.sizes.length,
        availability: 'https://schema.org/InStock',
        offers: p.sizes.map((s) => ({
          '@type': 'Offer',
          name: s.label,
          price: s.priceGs,
          priceCurrency: 'PYG',
          availability: 'https://schema.org/InStock',
        })),
      }
    }
  } else if (typeof p.priceFromGs === 'number') {
    schema.offers = {
      '@type': 'Offer',
      price: p.priceFromGs,
      priceCurrency: 'PYG',
      availability: 'https://schema.org/InStock',
    }
  }

  if (p.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.aggregateRating.ratingValue,
      reviewCount: p.aggregateRating.reviewCount,
    }
  }

  return schema
}
