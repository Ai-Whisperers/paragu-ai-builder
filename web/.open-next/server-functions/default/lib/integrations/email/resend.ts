import type { EmailAdapter } from './types'
import { integrationFetch } from '@/lib/integrations/http'

const RESEND_URL = 'https://api.resend.com/emails'

export const resendAdapter: EmailAdapter = {
  name: 'resend',
  async subscribe(lead, config) {
    if (!config.transactionalApiKey || !config.fromAddress) {
      return { ok: false, error: 'resend transactionalApiKey + fromAddress required' }
    }
    const res = await integrationFetch<{ id?: string }>(RESEND_URL, {
      adapter: 'resend',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.transactionalApiKey}`,
      },
      body: JSON.stringify({
        from: `${config.fromName || lead.siteSlug} <${config.fromAddress}>`,
        to: lead.email,
        subject: welcomeSubject(lead.locale),
        html: welcomeHtml(lead),
      }),
    })
    if (!res.ok) return { ok: false, error: res.error }
    return { ok: true, externalId: res.data?.id }
  },
  async sendTransactional(to, subject, html, config) {
    if (!config.transactionalApiKey || !config.fromAddress) {
      return { ok: false, error: 'resend not configured' }
    }
    const res = await integrationFetch<{ id?: string }>(RESEND_URL, {
      adapter: 'resend',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.transactionalApiKey}`,
      },
      body: JSON.stringify({
        from: `${config.fromName || 'Nexa'} <${config.fromAddress}>`,
        to,
        subject,
        html,
      }),
    })
    if (!res.ok) return { ok: false, error: res.error }
    return { ok: true, externalId: res.data?.id }
  },
}

const WELCOME_SUBJECT: Record<string, string> = {
  nl: 'Bedankt voor uw interesse',
  en: 'Thank you for your interest',
  de: 'Vielen Dank für Ihr Interesse',
  es: 'Gracias por su interés',
}

function welcomeSubject(locale: string): string {
  return WELCOME_SUBJECT[locale] || WELCOME_SUBJECT.en
}

function welcomeHtml(lead: { name: string; locale: string }): string {
  const heading = welcomeSubject(lead.locale)
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#1B2A4A">
    <h2>${heading}, ${escapeHtml(lead.name)}</h2>
    <p>We received your inquiry and will follow up within one business day.</p>
  </body></html>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]!))
}
