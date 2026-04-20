import type { CrmAdapter } from './types'
import { integrationFetch } from '@/lib/integrations/http'

export const hubspotAdapter: CrmAdapter = {
  name: 'hubspot',
  async submit(lead, config) {
    if (!config.portalId || !config.endpoint) {
      return { ok: false, error: 'hubspot portalId + endpoint required' }
    }
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${config.portalId}/${config.endpoint}`
    const body = {
      fields: [
        { name: 'firstname', value: lead.name.split(' ')[0] || lead.name },
        { name: 'lastname', value: lead.name.split(' ').slice(1).join(' ') || '' },
        { name: 'email', value: lead.email },
        ...(lead.phone ? [{ name: 'phone', value: lead.phone }] : []),
        ...(lead.country ? [{ name: 'country', value: lead.country }] : []),
        ...(lead.programInterest ? [{ name: 'program_interest', value: lead.programInterest }] : []),
        ...(lead.objective ? [{ name: 'objective', value: lead.objective }] : []),
        { name: 'source_site', value: lead.siteSlug },
        { name: 'language', value: lead.locale },
      ],
      context: {
        pageUri: lead.referer,
        pageName: `${lead.siteSlug} — lead form`,
      },
    }
    const res = await integrationFetch(url, {
      adapter: 'hubspot',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok ? { ok: true } : { ok: false, error: res.error }
  },
}
