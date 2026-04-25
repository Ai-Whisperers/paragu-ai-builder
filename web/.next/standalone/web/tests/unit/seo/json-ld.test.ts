import { describe, it, expect } from 'vitest'
import { localBusiness, faqPage, breadcrumbList, productOffers, aggregateRating } from '@/lib/seo/json-ld'

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
