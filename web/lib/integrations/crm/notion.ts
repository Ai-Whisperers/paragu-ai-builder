import type { CrmAdapter } from './types'

export const notionAdapter: CrmAdapter = {
  name: 'notion',
  async submit(lead, config) {
    if (!config.apiKey || !config.endpoint) {
      return { ok: false, error: 'notion apiKey + endpoint (databaseId) required' }
    }
    try {
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
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
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        return { ok: false, error: `notion ${res.status}: ${text.slice(0, 200)}` }
      }
      const json = await res.json()
      return { ok: true, externalId: json.id }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'notion error' }
    }
  },
}
