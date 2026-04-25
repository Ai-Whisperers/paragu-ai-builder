import { NextResponse } from 'next/server'
import { z } from 'zod'
import { loadSite } from '@/lib/engine/site-loader'
import { resolveAdapters } from '@/lib/integrations/registry'
import { resendAdapter } from '@/lib/integrations/email/resend'
import { withRequestLog } from '@/lib/api/with-request-log'
import { metrics } from '@/lib/obs/metrics'
import type { Lead } from '@/lib/integrations/types'
import { rateLimit, clientIp } from '@/lib/security/rate-limit'
import { getAppUrl } from '@/lib/env'

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

  // Rate-limit by IP (10/hour) and by email (3/hour). First gate is
  // abuse prevention; second gate stops an accidentally-loop-submitted
  // form from flooding the inbox with retries.
  const ip = clientIp(req)
  const windowMs = 60 * 60 * 1000
  const [byIp, byEmail] = await Promise.all([
    rateLimit({ key: `leads:ip:${ip}`, limit: 10, windowMs }),
    rateLimit({ key: `leads:email:${data.email.toLowerCase()}`, limit: 3, windowMs }),
  ])
  if (!byIp.ok || !byEmail.ok) {
    const which = !byIp.ok ? 'ip' : 'email'
    log.warn('Lead rejected: rate-limited', {
      siteSlug: data.siteSlug,
      which,
      ip: which === 'ip' ? ip : undefined,
      email: which === 'email' ? data.email : undefined,
    })
    metrics.inc('lead.rejected', { siteSlug: data.siteSlug, reason: `rate_limit_${which}` })
    return new NextResponse(
      JSON.stringify({ error: 'rate_limited', which, requestId }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((((!byIp.ok ? byIp : byEmail).reset - Date.now()) / 1000))),
        },
      },
    )
  }
  perf.checkpoint('rate-limit')

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
  // Fire-and-forget admin notification. Don't await inside the response flow
  // so a slow Resend call doesn't hold the user's 201. The Node runtime keeps
  // the function alive until the promise resolves.
  void notifyAdminsOfNewLead({ ...lead, id: (supabaseResult as { id?: string }).id }).catch(() => { /* logged inside */ })

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

// Fire-and-forget admin notification on every new lead. Failures log but
// never block the 201 response. ADMIN_EMAILS is the source of truth for
// who gets notified (same env var that gates /admin). EMAIL_TRANSACTIONAL_KEY
// + EMAIL_FROM_ADDRESS must be configured — otherwise this silently skips.
async function notifyAdminsOfNewLead(lead: Lead & { id?: string }): Promise<void> {
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  if (admins.length === 0) return

  const subject = `New lead: ${lead.name} (${lead.siteSlug})`
  const html = `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#1B2A4A">
    <h2 style="margin:0 0 12px">New inbound lead</h2>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:4px 10px 4px 0;color:#64748b">Site</td><td><code>${escapeAttr(lead.siteSlug)}</code> (${escapeAttr(lead.locale)})</td></tr>
      <tr><td style="padding:4px 10px 4px 0;color:#64748b">Name</td><td>${escapeAttr(lead.name)}</td></tr>
      <tr><td style="padding:4px 10px 4px 0;color:#64748b">Email</td><td><a href="mailto:${encodeURIComponent(lead.email)}">${escapeAttr(lead.email)}</a></td></tr>
      ${lead.phone ? `<tr><td style="padding:4px 10px 4px 0;color:#64748b">Phone</td><td>${escapeAttr(lead.phone)}</td></tr>` : ''}
      ${lead.country ? `<tr><td style="padding:4px 10px 4px 0;color:#64748b">Country</td><td>${escapeAttr(lead.country)}</td></tr>` : ''}
      ${lead.programInterest ? `<tr><td style="padding:4px 10px 4px 0;color:#64748b">Program</td><td>${escapeAttr(lead.programInterest)}</td></tr>` : ''}
    </table>
    ${lead.objective ? `<h3 style="margin:16px 0 4px;font-size:14px">Objective</h3><p style="white-space:pre-wrap;background:#f8fafc;padding:10px;border-radius:6px;font-size:13px">${escapeAttr(lead.objective)}</p>` : ''}
    <p style="margin-top:18px">
      <a href="${getAppUrl()}/admin/inbox/${lead.id || ''}"
         style="background:#0f172a;color:white;padding:10px 16px;border-radius:6px;text-decoration:none;font-size:13px">
        Open lead
      </a>
    </p>
  </body></html>`

  const config = {
    transactionalApiKey: process.env.EMAIL_TRANSACTIONAL_KEY,
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
    fromName: process.env.EMAIL_FROM_NAME || 'Paragu-AI',
  }

  // Fan out to each admin in parallel. Each is independent; one failing
  // should not block the others.
  await Promise.all(
    admins.map(async (to) => {
      try {
        const r = await resendAdapter.sendTransactional!(to, subject, html, config)
        if (!r.ok) {
          // Non-throwing best-effort — log and move on.
          // eslint-disable-next-line no-console
          console.warn('[leads] admin notif failed', { to, error: r.error })
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[leads] admin notif exception', { to, error: e instanceof Error ? e.message : String(e) })
      }
    }),
  )
}

function escapeAttr(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

