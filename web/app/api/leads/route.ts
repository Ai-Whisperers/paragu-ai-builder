import { NextResponse } from 'next/server'
import { z } from 'zod'
import { loadSite } from '@/lib/engine/site-loader'
import { resolveAdapters } from '@/lib/integrations/registry'
import type { Lead } from '@/lib/integrations/types'

export const runtime = 'nodejs'

const LeadSchema = z.object({
  siteSlug: z.string().min(1),
  locale: z.string().min(2).max(5),
  name: z.string().min(2).max(200),
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

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data

  if (!data.consent.privacyPolicy) {
    return NextResponse.json({ error: 'privacy_not_accepted' }, { status: 400 })
  }

  let site
  try {
    site = loadSite(data.siteSlug)
  } catch {
    return NextResponse.json({ error: 'unknown_site' }, { status: 404 })
  }

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

  const [supabaseResult, forwardResults] = await Promise.all([
    persistLeadToSupabase(lead).catch((e) => ({ ok: false, error: String(e) })),
    forwardLeadToAdapters(lead, site.integrations, data.consent.marketing),
  ])

  const ok = supabaseResult.ok || forwardResults.some((r) => r.ok)
  if (!ok) {
    return NextResponse.json(
      { error: 'all_destinations_failed', details: { supabase: supabaseResult, forwards: forwardResults } },
      { status: 502 },
    )
  }

  return NextResponse.json({ 
  ok: true, 
  leadId: (supabaseResult as { id?: string }).id || 'unknown',
  message: 'Lead created successfully' 
}, { status: 201 })
}

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
      return { ok: false, error: `supabase ${res.status}: ${text.slice(0, 200)}` }
    }
    const rows = await res.json()
    return { ok: true, id: rows?.[0]?.id }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'supabase error' }
  }
}
