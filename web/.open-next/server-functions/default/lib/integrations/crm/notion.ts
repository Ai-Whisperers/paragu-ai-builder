import type { CrmAdapter } from './types'
import { integrationFetch } from '@/lib/integrations/http'

export const notionAdapter: CrmAdapter = {
  name: 'notion',
  async submit(lead, config) {
    if (!config.apiKey || !config.endpoint) {
      return { ok: false, error: 'notion apiKey + endpoint (databaseId) required' }
    }
    const body = {
      parent: { database_id: config.endpoint },
      properties: {
        Name: { title: [{ text: { content: lead.name } }] },
        Email: { email: lead.email },
        ...(lead.phone ? { Phone: { phone_number: lead.phone } } : {}),
        ...(lead.country ? { Country: { rich_text: [{ text: { content: lead.country } }] } } : {}),
        ...(lead.programInterest
          ? { Program: { select: { name: lead.programInterest } } }
          : {}),
        Site: { rich_text: [{ text: { content: lead.siteSlug } }] },
        Locale: { select: { name: lead.locale } },
      },
    }
    const res = await integrationFetch<{ id?: string }>('https://api.notion.com/v1/pages', {
      adapter: 'notion',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) return { ok: false, error: res.error }
    return { ok: true, externalId: res.data?.id }
  },
}
