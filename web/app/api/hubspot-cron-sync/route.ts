/**
 * GET /api/hubspot-cron-sync — scheduled drift check between HubSpot contacts
 * and Supabase leads. Intended to be hit by a Cloudflare Cron Trigger daily.
 * Scaffold: currently a dry-run that reports counts only.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

export const GET = withRequestLog(async (req, { log }) => {
  const auth = req.headers.get('x-cron-token')
  if (auth !== process.env.CRON_TOKEN && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // TODO(hubspot): page through HubSpot CRM contacts created since last sync,
  // upsert into Supabase `leads`, emit drift report.
  log.info('hubspot cron sync triggered (scaffold)')

  return NextResponse.json({
    ok: true,
    scaffolded: true,
    drift: { hubspotOnly: 0, supabaseOnly: 0, matched: 0 },
  })
})
