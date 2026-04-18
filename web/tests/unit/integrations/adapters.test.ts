import { describe, it, expect } from 'vitest'
import { getBookingAdapter } from '@/lib/integrations/booking'
import { getCrmAdapter } from '@/lib/integrations/crm'
import { getEmailAdapter } from '@/lib/integrations/email'
import { getAnalyticsAdapter } from '@/lib/integrations/analytics'
import { resolveAdapters } from '@/lib/integrations/registry'

describe('integration adapters', () => {
  it('returns null for unknown adapter names', () => {
    expect(getBookingAdapter(undefined)).toBeNull()
    expect(getBookingAdapter('nope')).toBeNull()
    expect(getCrmAdapter('also-nope')).toBeNull()
    expect(getEmailAdapter('')).toBeNull()
  })

  it('builds Calendly embed with prefill + locale', () => {
    const adapter = getBookingAdapter('calendly')!
    const embed = adapter.buildEmbed('https://calendly.com/x/consult', {
      locale: 'nl',
      prefill: { name: 'Ada', email: 'ada@example.com' },
    })
    expect(embed.provider).toBe('calendly')
    expect(embed.html).toContain('name=Ada')
    expect(embed.html).toContain('locale=nl')
    expect(embed.fallbackUrl).toBe('https://calendly.com/x/consult')
  })

  it('resolveAdapters picks adapters from site integration map', () => {
    const a = resolveAdapters({
      booking: 'calendly',
      crm: 'hubspot',
      email: 'mailchimp',
      analytics: 'ga4',
    })
    expect(a.booking?.name).toBe('calendly')
    expect(a.crm?.name).toBe('hubspot')
    expect(a.email?.name).toBe('mailchimp')
    expect(a.analytics?.name).toBe('ga4')
  })

  it('GA4 adapter emits empty string without consent', () => {
    const a = getAnalyticsAdapter('ga4')!
    expect(a.scriptTags({ measurementId: 'G-X' }, false)).toBe('')
    expect(a.scriptTags({ measurementId: 'G-X' }, true)).toContain('googletagmanager')
  })
})
