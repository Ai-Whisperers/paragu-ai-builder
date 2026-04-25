/**
 * GET /api/properties/:id — single property detail.
 * Degrades gracefully when the properties table isn't provisioned yet.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ id: string }>(async (_req, { log }, { id }) => {
  log.debug('property detail requested', { id })

  const supabase = await createClient('anon')
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle()

  if (error) {
    if (/does not exist|relation .* does not exist/.test(error.message)) {
      return NextResponse.json(
        { error: 'not_provisioned', note: 'properties table not yet provisioned' },
        { status: 404 },
      )
    }
    log.warn('property detail query failed', { id, error: error.message })
    return NextResponse.json({ error: 'query_failed', detail: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'not_found', id }, { status: 404 })
  }

  return NextResponse.json({ data })
})
