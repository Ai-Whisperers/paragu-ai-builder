import type { CrmAdapter } from './types'
import { integrationFetch } from '@/lib/integrations/http'

interface PipedriveResponse<T = unknown> {
  data?: T
  success?: boolean
}

export const pipedriveAdapter: CrmAdapter = {
  name: 'pipedrive',
  async submit(lead, config) {
    if (!config.apiKey) return { ok: false, error: 'pipedrive apiKey required' }
    const base = 'https://api.pipedrive.com/v1'
    const token = encodeURIComponent(config.apiKey)

    const personRes = await integrationFetch<PipedriveResponse<{ id: number }>>(
      `${base}/persons?api_token=${token}`,
      {
        adapter: 'pipedrive',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: [{ value: lead.email, primary: true }],
          phone: lead.phone ? [{ value: lead.phone, primary: true }] : undefined,
        }),
      },
    )
    if (!personRes.ok || !personRes.data?.data?.id) {
      const detail = personRes.error || personRes.body?.slice(0, 200) || 'unknown'
      return { ok: false, error: `pipedrive person: ${detail}` }
    }

    const leadRes = await integrationFetch<PipedriveResponse<{ id: string }>>(
      `${base}/leads?api_token=${token}`,
      {
        adapter: 'pipedrive',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${lead.name} — ${lead.programInterest || 'Consultation'}`,
          person_id: personRes.data.data.id,
          label_ids: [],
        }),
      },
    )
    if (!leadRes.ok) {
      const detail = leadRes.error || leadRes.body?.slice(0, 200) || 'unknown'
      return { ok: false, error: `pipedrive lead: ${detail}` }
    }
    return { ok: true, externalId: leadRes.data?.data?.id }
  },
}
