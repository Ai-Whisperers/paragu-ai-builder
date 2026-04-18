import type { EmailAdapter } from './types'
import { createHash } from 'crypto'

function hashEmail(email: string): string {
  return createHash('md5').update(email.trim().toLowerCase()).digest('hex')
}

function serverFromKey(apiKey: string): string {
  const parts = apiKey.split('-')
  return parts[parts.length - 1]
}

export const mailchimpAdapter: EmailAdapter = {
  name: 'mailchimp',
  async subscribe(lead, config) {
    if (!config.apiKey || !config.listId) {
      return { ok: false, error: 'mailchimp apiKey + listId required' }
    }
    const server = serverFromKey(config.apiKey)
    const subHash = hashEmail(lead.email)
    const url = `https://${server}.api.mailchimp.com/3.0/lists/${config.listId}/members/${subHash}`
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          email_address: lead.email,
          status_if_new: 'subscribed',
          status: 'subscribed',
          language: lead.locale,
          merge_fields: {
            FNAME: lead.name.split(' ')[0] || lead.name,
            LNAME: lead.name.split(' ').slice(1).join(' ') || '',
            COUNTRY: lead.country || '',
            PROGRAM: lead.programInterest || '',
            SITE: lead.siteSlug,
          },
          tags: [lead.siteSlug, `locale:${lead.locale}`],
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        return { ok: false, error: `mailchimp ${res.status}: ${text.slice(0, 200)}` }
      }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'mailchimp error' }
    }
  },
}
