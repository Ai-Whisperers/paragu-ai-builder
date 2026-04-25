import { describe, it, expect } from 'vitest'
import {
  PARAGU_AI_BANK_ALIAS,
  PARAGU_AI_COMPROBANTE_WHATSAPP,
  buildSaasOutreachMessage,
  buildSaasOutreachWhatsAppUrl,
} from '@/lib/billing/paragu-ai-bank'

describe('buildSaasOutreachMessage', () => {
  const ctx = {
    businessName: 'Tienda Acme',
    planLabel: 'Crecimiento mensual',
    amountCents: 150_000,
  }

  it('includes the alias and WhatsApp number', () => {
    const msg = buildSaasOutreachMessage(ctx)
    expect(msg).toContain(PARAGU_AI_BANK_ALIAS)
    expect(msg).toContain(PARAGU_AI_COMPROBANTE_WHATSAPP)
  })

  it('mentions the business name and plan', () => {
    const msg = buildSaasOutreachMessage(ctx)
    expect(msg).toContain('Tienda Acme')
    expect(msg).toContain('Crecimiento mensual')
  })

  it('formats the price in Paraguayan Gs', () => {
    const msg = buildSaasOutreachMessage(ctx)
    expect(msg).toMatch(/Gs\s*150[.,]000/)
  })

  it('offers the price-negotiation / demo / checkout-options triad', () => {
    const msg = buildSaasOutreachMessage(ctx)
    expect(msg).toMatch(/precio|precio|conversar/i)
    expect(msg).toMatch(/demo/i)
    expect(msg).toMatch(/WhatsApp/i)
    expect(msg).toMatch(/Pagopar/i)
  })

  it('switches Pagopar copy when tenant already has credentials', () => {
    const without = buildSaasOutreachMessage(ctx)
    const with_ = buildSaasOutreachMessage({ ...ctx, pagoparEnabled: true })
    expect(without).not.toBe(with_)
    expect(with_).toMatch(/credenciales/i)
  })
})

describe('buildSaasOutreachWhatsAppUrl', () => {
  it('strips non-digits from the phone', () => {
    const url = buildSaasOutreachWhatsAppUrl('+595 981 324 569', {
      businessName: 'A',
      planLabel: 'B',
      amountCents: 1_000,
    })
    expect(url).toMatch(/^https:\/\/wa\.me\/595981324569\?text=/)
  })

  it('url-encodes the message body', () => {
    const url = buildSaasOutreachWhatsAppUrl('595981324569', {
      businessName: 'Tienda',
      planLabel: 'Plan',
      amountCents: 100_000,
    })
    // Encoded newlines + spaces
    expect(url).toContain('%20')
    expect(url).toContain('%0A')
  })
})
