/**
 * POST /api/mailchimp-journey-import — one-shot importer that turns
 * sites/<slug>/email-nurture.json into a Mailchimp Customer Journey.
 *
 * Guarded by an admin token (env.MAILCHIMP_IMPORT_TOKEN). Scaffold: validates
 * input, logs to intended mapping, returns a dry-run plan. The Mailchimp
 * API call is stubbed pending MC list + journey ids.
 */

import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

const Schema = z.object({
  siteSlug: z.string(),
  dryRun: z.boolean().default(true),
})

export const POST = withRequestLog(async (req, { log }) => {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.MAILCHIMP_IMPORT_TOKEN}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const parsed = Schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }
  const { siteSlug, dryRun } = parsed.data

  const nurturePath = resolve(process.cwd(), '..', 'sites', siteSlug, 'email-nurture.json')
  if (!existsSync(nurturePath)) {
    return NextResponse.json({ error: 'nurture_not_found', siteSlug }, { status: 404 })
  }
  const nurture = JSON.parse(readFileSync(nurturePath, 'utf-8')) as {
    sequence?: Array<{ dayOffset: number; locales?: Record<string, { subject: string; body: string }> }>
  }

  const plan = (nurture.sequence || []).map((e) => ({
    dayOffset: e.dayOffset,
    locales: Object.keys(e.locales || {}),
    subjects: Object.fromEntries(
      Object.entries(e.locales || {}).map(([loc, v]) => [loc, v.subject]),
    ),
  }))

  log.info('mailchimp journey import plan', { siteSlug, emails: plan.length, dryRun })

  if (dryRun) {
    return NextResponse.json({ ok: true, dryRun: true, plan, scaffolded: true })
  }

  const mailchimpJourneyEnabled = process.env.MAILCHIMP_JOURNEY_ENABLED === 'true' && process.env.MAILCHIMP_JOURNEY_ID && process.env.MAILCHIMP_API_KEY
  if (mailchimpJourneyEnabled) {
    log.warn('Mailchimp Customer Journeys API call stubbed - MC_JOURNEY_ID and MC_API_KEY not implemented yet')
  }

  return NextResponse.json({ ok: true, planned: plan.length, scaffolded: true })
})
