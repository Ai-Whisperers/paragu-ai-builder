import { NextResponse } from 'next/server'
import { z } from 'zod'
import { loadSite } from '@/lib/engine/site-loader'
import { resolveAdapters } from '@/lib/integrations/registry'
import { withRequestLog } from '@/lib/api/with-request-log'
import { metrics } from '@/lib/obs/metrics'
import type { Lead } from '@/lib/integrations/types'

export const runtime = 'nodejs'

const LeadSchema = z.object({
  siteSlug: z.string().min(1),
  locale: z.string().min(2).max(5),
  name: z.string().min(2).max(200).optional(),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  country: z.string().max(80).optional(),
  programInterest: z.string().max(80).optional(),
  objective: z.string().max(2000).optional(),
  source: z.string().max(120).optional(),
  referer: z.string().max(500).optional(),
  utm: z.record(z.string(), z.string()).optional(),
  consent: z.object({
    marketing: z.boolean(),
    privacyPolicy: z.boolean(),
  }),
  honey: z.string().max(0, 'bot detected').optional().default(''),
})

export const POST = withRequestLog(async (req, { log, perf, requestId }) => {
  const respond = (status: number, body: Record<string, unknown>) =>
    NextResponse.json({ ...body, requestId }, { status })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    log.warn('Invalid JSON body on /api/leads')
    return respond(400, { error: 'invalid json' })
  }

  const parsed = LeadSchema.safeParse(json)
  if (!parsed.success) {
    log.warn('Lead validation failed', { issues: parsed.error.flatten().fieldErrors })
    return respond(400, { error: 'validation', detail: parsed.error.flatten() })
  }
  const data = parsed.data
  perf.checkpoint('validate')

  if (!data.consent.privacyPolicy) {
    log.info('Lead rejected: privacy policy not accepted', { siteSlug: data.siteSlug })
    return respond(400, { error: 'privacy_not_accepted' })
  }

  if (data.honey) {
    log.warn('Bot submission detected (honeypot)', { siteSlug: data.siteSlug })
    return respond(400, { error: 'bot detected' })
  }

  // Synthesize name from email for lightweight submissions (newsletter,
  // exit-intent). The NOT NULL constraint on public.leads.name is enforced
  // at the DB level; rather than null-out the column, derive a reasonable
  // placeholder. The CRM adapter layer still gets a usable Lead shape.
  if (!data.name || data.name.trim().length < 2) {
    const localPart = data.email.split('@')[0] || 'Subscriber'
    data.name = localPart.slice(0, 200)
  }

  let site
  try {
    site = loadSite(data.siteSlug)
  } catch (e) {
    log.warn('Unknown site on /api/leads', {
      siteSlug: data.siteSlug,
      error: e instanceof Error ? e.message : String(e),
    })
    return respond(404, { error: 'unknown_site' })
  }
  perf.checkpoint('load-site')

  const lead: Lead = {
    siteSlug: data.siteSlug,
    locale: data.locale,
    name: data.name,
    email: data.email,
    phone: data.phone,
    country: data.country,
    programInterest: data.programInterest,
    objective: data.objective,
    source: data.source,
    referer: data.referer,
    utm: data.utm,
    createdAt: new Date().toISOString(),
  }

  log.info('Processing lead', { siteSlug: data.siteSlug, locale: data.locale, source: data.source })
  metrics.inc('lead.submitted', { siteSlug: data.siteSlug, source: data.source ?? 'unknown' })

  const [supabaseResult, forwardResults] = await Promise.all([
    persistLeadToSupabase(lead).catch((e) => ({ ok: false, error: String(e) })),
    forwardLeadToAdapters(lead, site.integrations, data.consent.marketing),
  ])
  perf.checkpoint('persist-and-forward')

  if (!supabaseResult.ok) {
    log.warn('Supabase lead persistence failed', {
      siteSlug: data.siteSlug,
      error: 'error' in supabaseResult ? supabaseResult.error : 'unknown',
    })
  }
  for (const r of forwardResults) {
    metrics.inc('integration.call', {
      siteSlug: data.siteSlug,
      adapter: r.name,
      outcome: r.ok ? 'success' : 'failure',
    })
    if (!r.ok) {
      log.warn('Integration adapter failed', {
        siteSlug: data.siteSlug,
        adapter: r.name,
        error: r.error,
      })
    } else {
      log.debug('Integration adapter succeeded', { siteSlug: data.siteSlug, adapter: r.name })
    }
  }

  const ok = supabaseResult.ok || forwardResults.some((r) => r.ok)
  if (!ok) {
    log.error('All lead destinations failed', {
      siteSlug: data.siteSlug,
      supabase: supabaseResult,
      forwards: forwardResults,
    })
    metrics.inc('lead.rejected', { siteSlug: data.siteSlug, reason: 'all_destinations_failed' })
    return respond(502, {
      error: 'all_destinations_failed',
      details: { supabase: supabaseResult, forwards: forwardResults },
    })
  }

  const leadId = (supabaseResult as { id?: string }).id || 'unknown'
  const duration = perf.finish({ siteSlug: data.siteSlug, leadId })
  log.info('Lead accepted', { siteSlug: data.siteSlug, leadId, durationMs: duration })
  metrics.inc('lead.accepted', { siteSlug: data.siteSlug })

  return respond(201, {
    ok: true,
    leadId,
    message: 'Lead created successfully',
  })
})

async function forwardLeadToAdapters(
  lead: Lead,
  integrations: import('@/lib/engine/site-types').SiteIntegrations,
  marketingConsent: boolean,
) {
  const adapters = resolveAdapters(integrations)
  const tasks: Array<Promise<{ name: string; ok: boolean; error?: string }>> = []
  if (adapters.crm) {
    tasks.push(
      adapters.crm
        .submit(lead, {
          apiKey: process.env.CRM_API_KEY,
          portalId: process.env.CRM_PORTAL_ID,
          endpoint: process.env.CRM_ENDPOINT,
        })
        .then((r) => ({ name: 'crm', ...r })),
    )
  }
  if (adapters.email && marketingConsent) {
    tasks.push(
      adapters.email
        .subscribe(lead, {
          apiKey: process.env.EMAIL_API_KEY,
          listId: process.env.EMAIL_LIST_ID,
          fromAddress: process.env.EMAIL_FROM_ADDRESS,
          fromName: process.env.EMAIL_FROM_NAME,
          transactionalApiKey: process.env.EMAIL_TRANSACTIONAL_KEY,
        })
        .then((r) => ({ name: 'email', ...r })),
    )
  }
  return Promise.all(tasks)
}

async function persistLeadToSupabase(
  lead: Lead,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || url.includes('placeholder') || !key) {
    return { ok: false, error: 'supabase_not_configured' }
  }
  try {
    const res = await fetch(`${url}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        site_slug: lead.siteSlug,
        locale: lead.locale,
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? null,
        country: lead.country ?? null,
        program_interest: lead.programInterest ?? null,
        objective: lead.objective ?? null,
        source: lead.source ?? null,
        referer: lead.referer ?? null,
        utm: lead.utm ?? {},
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      // 409 = unique-constraint violation on (site_slug, lower(email)) —
      // treat as success because the lead was already captured by a
      // previous submission. Re-submission is effectively idempotent.
      if (res.status === 409) {
        return { ok: true, id: 'dedup' }
      }
      return { ok: false, error: `supabase ${res.status}: ${text.slice(0, 200)}` }
    }
    const rows = await res.json()
    return { ok: true, id: rows?.[0]?.id }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'supabase error' }
  }
}
