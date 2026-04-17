import type { CrmAdapter } from './types'

export const pipedriveAdapter: CrmAdapter = {
  name: 'pipedrive',
  async submit(lead, config) {
    if (!config.apiKey) return { ok: false, error: 'pipedrive apiKey required' }
    const base = 'https://api.pipedrive.com/v1'
    const commonParams = `api_token=${encodeURIComponent(config.apiKey)}`
    try {
      const personRes = await fetch(`${base}/persons?${commonParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: [{ value: lead.email, primary: true }],
          phone: lead.phone ? [{ value: lead.phone, primary: true }] : undefined,
        }),
      })
      const person = await personRes.json()
      if (!personRes.ok || !person.data?.id) {
        return { ok: false, error: `pipedrive person: ${JSON.stringify(person).slice(0, 200)}` }
      }
      const leadRes = await fetch(`${base}/leads?${commonParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${lead.name} — ${lead.programInterest || 'Consultation'}`,
          person_id: person.data.id,
          label_ids: [],
        }),
      })
      const leadJson = await leadRes.json()
      if (!leadRes.ok) {
        return { ok: false, error: `pipedrive lead: ${JSON.stringify(leadJson).slice(0, 200)}` }
      }
      return { ok: true, externalId: leadJson.data?.id }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'pipedrive error' }
    }
  },
}
