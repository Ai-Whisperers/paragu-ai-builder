/**
 * POST /api/data-request — GDPR / Paraguay Ley 1.682 data-request intake.
 * Persists to Supabase `data_requests` with a 30-day SLA timer.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const Schema = z.object({
  siteSlug: z.string().min(1),
  email: z.string().email(),
  kind: z.enum(['access', 'rectification', 'deletion', 'portability', 'objection']),
  description: z.string().max(2000).optional(),
  identityProof: z.string().max(500).optional(),
})

export const POST = withRequestLog(async (req, { log }) => {
  const parsed = Schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  const { siteSlug, email, kind, description, identityProof } = parsed.data
  const dueAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
  log.info('data-request received', { siteSlug, email, kind, dueAt })

  const supabase = await createClient('service_role')
  const { error } = await supabase.from('data_requests').insert({
    site_slug: siteSlug,
    email,
    kind,
    description,
    identity_proof: identityProof,
    due_at: dueAt,
  })

  if (error && !/does not exist|relation/.test(error.message)) {
    log.warn('data-request insert failed', { error: error.message })
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  // TODO(compliance): email notification to compliance officer. Ship once
  // an outbound email adapter (Resend / Postmark) is wired in.

  return NextResponse.json({
    ok: true,
    message: 'Solicitud recibida. Respondemos en maximo 30 dias.',
    dueAt,
    ...(error ? { note: 'data_requests table not yet provisioned' } : {}),
  })
})
