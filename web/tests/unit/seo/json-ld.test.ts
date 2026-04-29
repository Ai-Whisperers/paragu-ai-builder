import { describe, it, expect } from 'vitest'
import {
  localBusiness,
  faqPage,
  breadcrumbList,
  productOffers,
  aggregateRating,
  buildReview,
  buildProduct,
  buildWebsiteSearch,
  buildItemList,
} from '@/lib/seo/json-ld'

describe('JSON-LD builders', () => {
  it('localBusiness with Schema.org subtype', () => {
    const r = localBusiness({ name: 'X', url: 'https://x.com' }, 'BeautySalon') as Record<string, unknown>
    expect(r['@context']).toBe('https://schema.org')
    expect(r['@type']).toBe('BeautySalon')
  })

  it('faqPage from q/a array', () => {
    const r = faqPage([{ q: 'Q1', a: 'A1' }]) as { mainEntity: Array<Record<string, unknown>> }
    expect(r['@type' as keyof typeof r]).toBe('FAQPage')
    expect(r.mainEntity.length).toBe(1)
  })

  it('breadcrumbList includes positions', () => {
    const r = breadcrumbList([{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]) as {
      itemListElement: Array<{ position: number }>
    }
    expect(r.itemListElement[0].position).toBe(1)
    expect(r.itemListElement[1].position).toBe(2)
  })

  it('productOffers detects USD/EUR/PYG', () => {
    const r = productOffers([
      { name: 'P1', price: '$35' },
      { name: 'P2', price: '€35' },
      { name: 'P3', price: '150.000 Gs' },
    ]) as { itemListElement: Array<{ priceCurrency?: string }> }
    expect(r.itemListElement[0].priceCurrency).toBe('USD')
    expect(r.itemListElement[1].priceCurrency).toBe('EUR')
    expect(r.itemListElement[2].priceCurrency).toBe('PYG')
  })

  it('aggregateRating formats avg to 1 decimal', () => {
    const r = aggregateRating(4.67, 42) as { ratingValue: string; reviewCount: number }
    expect(r.ratingValue).toBe('4.7')
    expect(r.reviewCount).toBe(42)
  })
})

describe('buildReview', () => {
  it('emits standalone Review with Rating subobject and bestRating/worstRating defaults', () => {
    const r = buildReview({
      authorName: 'Ana',
      rating: 5,
      createdAt: '2026-04-01T10:00:00Z',
      title: 'Excelente',
      content: 'Muy buen producto',
    }) as Record<string, unknown>
    expect(r['@context']).toBe('https://schema.org')
    expect(r['@type']).toBe('Review')
    const author = r.author as Record<string, unknown>
    expect(author['@type']).toBe('Person')
    expect(author.name).toBe('Ana')
    const rating = r.reviewRating as Record<string, unknown>
    expect(rating['@type']).toBe('Rating')
    expect(rating.ratingValue).toBe(5)
    expect(rating.bestRating).toBe(5)
    expect(rating.worstRating).toBe(1)
    expect(r.name).toBe('Excelente')
    expect(r.reviewBody).toBe('Muy buen producto')
  })

  it('omits name when title is null', () => {
    const r = buildReview({
      authorName: 'Bea',
      rating: 4,
      createdAt: '2026-04-02T10:00:00Z',
      title: null,
      content: 'Está bien',
    }) as Record<string, unknown>
    expect(r.name).toBeUndefined()
  })
})

describe('buildProduct (extended)', () => {
  it('uses priceCents + priceCurrency for single-variant Offer', () => {
    const r = buildProduct(
      {
        name: 'Widget',
        url: 'https://example.com/p/widget',
        priceCents: 12345,
        priceCurrency: 'USD',
        seller: 'Acme',
        sku: 'WID-1',
      },
      'https://example.com',
    ) as Record<string, unknown>
    const offer = r.offers as Record<string, unknown>
    expect(offer['@type']).toBe('Offer')
    expect(offer.price).toBe('123.45')
    expect(offer.priceCurrency).toBe('USD')
    expect(offer.itemCondition).toBe('https://schema.org/NewCondition')
    expect(offer.availability).toBe('https://schema.org/InStock')
    const seller = offer.seller as Record<string, unknown>
    expect(seller.name).toBe('Acme')
    // mpn defaults to sku
    expect(r.mpn).toBe('WID-1')
  })

  it('honours caller-supplied availability (OutOfStock)', () => {
    const r = buildProduct(
      {
        name: 'Sold Out',
        url: 'https://example.com/p/x',
        priceCents: 100,
        priceCurrency: 'USD',
        availability: 'https://schema.org/OutOfStock',
      },
      'https://example.com',
    ) as Record<string, unknown>
    const offer = r.offers as Record<string, unknown>
    expect(offer.availability).toBe('https://schema.org/OutOfStock')
  })

  it('embeds review[] (capped at 10) without nested @context', () => {
    const reviews = Array.from({ length: 12 }, (_, i) => ({
      authorName: `R${i}`,
      rating: 4,
      createdAt: '2026-04-01',
      content: `body ${i}`,
    }))
    const r = buildProduct(
      { name: 'P', url: 'https://x/p', priceCents: 100, priceCurrency: 'USD', reviews },
      'https://x',
    ) as Record<string, unknown>
    const review = r.review as Array<Record<string, unknown>>
    expect(review.length).toBe(10)
    expect(review[0]['@context']).toBeUndefined()
    expect(review[0]['@type']).toBe('Review')
  })

  it('aggregateRating includes bestRating/worstRating', () => {
    const r = buildProduct(
      {
        name: 'P',
        url: 'https://x/p',
        priceCents: 100,
        priceCurrency: 'USD',
        aggregateRating: { ratingValue: 4.7, reviewCount: 9 },
      },
      'https://x',
    ) as Record<string, unknown>
    const ar = r.aggregateRating as Record<string, unknown>
    expect(ar.ratingValue).toBe(4.7)
    expect(ar.reviewCount).toBe(9)
    expect(ar.bestRating).toBe(5)
    expect(ar.worstRating).toBe(1)
  })
})

describe('buildWebsiteSearch', () => {
  it('emits WebSite with SearchAction targeting tenant /buscar route', () => {
    const r = buildWebsiteSearch(
      { slug: 'fun4me', defaultLocale: 'es' },
      { siteName: 'Fun4Me' },
      'https://paragu-ai.com',
      'es',
    ) as Record<string, unknown>
    expect(r['@type']).toBe('WebSite')
    expect(r.name).toBe('Fun4Me')
    expect(r.url).toBe('https://paragu-ai.com/s/es/fun4me')
    expect(r.inLanguage).toBe('es')
    const action = r.potentialAction as Record<string, unknown>
    expect(action['@type']).toBe('SearchAction')
    const target = action.target as Record<string, unknown>
    expect(target.urlTemplate).toBe('https://paragu-ai.com/s/es/fun4me/buscar?q={search_term_string}')
    expect(action['query-input']).toBe('required name=search_term_string')
  })
})

describe('buildItemList (generic)', () => {
  it('wraps pre-built nodes and strips nested @context', () => {
    const a = { '@context': 'https://schema.org', '@type': 'Product', name: 'A' }
    const b = { '@context': 'https://schema.org', '@type': 'Product', name: 'B' }
    const r = buildItemList([a, b], 'Tienda', 'https://x/tienda') as Record<string, unknown>
    expect(r['@type']).toBe('ItemList')
    expect(r.numberOfItems).toBe(2)
    const els = r.itemListElement as Array<Record<string, unknown>>
    expect(els[0].position).toBe(1)
    expect(els[1].position).toBe(2)
    const item0 = els[0].item as Record<string, unknown>
    expect(item0['@context']).toBeUndefined()
    expect(item0.name).toBe('A')
  })
})
