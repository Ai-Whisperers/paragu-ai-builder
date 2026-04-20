/**
 * GET /api/properties/:id — single property detail.
 * Scaffold — returns 404 until Supabase properties table exists.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ id: string }>(async (_req, { log }, { id }) => {
  log.debug('property detail requested', { id })
  // TODO(properties): fetch from Supabase
  return NextResponse.json({ error: 'not_found', id, scaffolded: true }, { status: 404 })
})
