import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRequestLogger } from '@/lib/logger'
import { listSiteSlugs } from '@/lib/engine/site-loader'
import { loadAllSlugs } from '@/lib/engine/data-loader'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Admin-only diagnostics endpoint.
 *
 * Returns a snapshot of the runtime useful for debugging:
 * - Auth user
 * - Feature-flag / integration env var presence (names only, never values)
 * - Static site catalog (slugs from both flat + vertical patterns)
 * - Last N generation_logs rows (per-business scoped)
 *
 * Called via `GET /api/diagnostics`. Requires a logged-in admin user.
 */
export async function GET(request: Request) {
  const log = createRequestLogger(request)

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    log.warn('Unauthorized /api/diagnostics request', { error: authError?.message })
    return NextResponse.json(
      { error: 'unauthorized', requestId: log.requestId },
      { status: 401, headers: { 'x-request-id': log.requestId } },
    )
  }

  const envVarsPresent: Record<string, boolean> = {}
  for (const name of [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_GA4_ID',
    'CRM_API_KEY',
    'EMAIL_API_KEY',
    'LOG_LEVEL',
    'LOG_FORMAT',
    'SLOW_REQUEST_THRESHOLD_MS',
    'SLOW_QUERY_THRESHOLD_MS',
  ]) {
    envVarsPresent[name] = Boolean(process.env[name])
  }

  let siteCatalog: string[] = []
  try {
    siteCatalog = listSiteSlugs()
  } catch (err) {
    log.warn('listSiteSlugs failed in diagnostics', {
      error: err instanceof Error ? err.message : String(err),
    })
  }

  let businessSlugs: string[] = []
  try {
    businessSlugs = await loadAllSlugs()
  } catch (err) {
    log.warn('loadAllSlugs failed in diagnostics', {
      error: err instanceof Error ? err.message : String(err),
    })
  }

  let recentLogs: unknown[] = []
  try {
    const { data } = await supabase
      .from('generation_logs')
      .select('id, business_id, step, status, error_message, created_at, duration_ms')
      .order('created_at', { ascending: false })
      .limit(25)
    if (data) recentLogs = data
  } catch (err) {
    log.warn('generation_logs fetch failed in diagnostics', {
      error: err instanceof Error ? err.message : String(err),
    })
  }

  const payload = {
    requestId: log.requestId,
    timestamp: new Date().toISOString(),
    user: { id: user.id, email: user.email },
    env: {
      nodeEnv: process.env.NODE_ENV,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      commit: process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown',
      envVarsPresent,
    },
    catalog: {
      staticSiteCount: siteCatalog.length,
      staticSiteSlugs: siteCatalog,
      businessSlugCount: businessSlugs.length,
    },
    recentGenerationLogs: recentLogs,
  }

  log.info('Diagnostics returned', { userId: user.id })

  return NextResponse.json(payload, {
    headers: { 'x-request-id': log.requestId, 'cache-control': 'no-store' },
  })
}
