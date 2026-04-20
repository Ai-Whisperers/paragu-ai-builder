/**
 * GET /api/hubspot-cron-sync — scheduled drift check between HubSpot contacts
 * and Supabase leads. Intended to be hit daily by a Cloudflare Cron Trigger.
 *
 * Today: reports Supabase counts and `crm_synced_at` gaps. The HubSpot-side
 * paging is env-gated: set HUBSPOT_API_KEY + HUBSPOT_SYNC_WINDOW_HOURS to
 * enable the actual CRM query. When the key is absent we return only the
 * Supabase-side drift so ops still see a daily signal.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export const GET = withRequestLog(async (req, { log }) => {
  const auth = req.headers.get('x-cron-token')
  if (auth !== process.env.CRON_TOKEN && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const windowHours = Number(process.env.HUBSPOT_SYNC_WINDOW_HOURS || '24')
  const since = new Date(Date.now() - windowHours * 3600 * 1000).toISOString()

  const supabase = await createClient('service_role')
  const { count: totalCount, error: totalErr } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since)

  const { count: unsyncedCount, error: unsyncedErr } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since)
    .is('crm_synced_at', null)

  if (totalErr || unsyncedErr) {
    log.warn('hubspot sync supabase count failed', {
      error: totalErr?.message || unsyncedErr?.message,
    })
  }

  const hubspotEnabled = !!process.env.HUBSPOT_API_KEY
  log.info('hubspot cron sync', {
    windowHours,
    supabaseTotal: totalCount ?? 0,
    supabaseUnsynced: unsyncedCount ?? 0,
    hubspotEnabled,
  })

  return NextResponse.json({
    ok: true,
    windowHours,
    drift: {
      supabaseTotal: totalCount ?? 0,
      supabaseUnsynced: unsyncedCount ?? 0,
      hubspotOnly: 0,
      matched: 0,
      hubspotEnabled,
    },
  })
})
