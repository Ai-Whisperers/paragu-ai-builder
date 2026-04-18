import { NextResponse } from 'next/server'
import { createRequestLogger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Check {
  name: string
  ok: boolean
  durationMs: number
  detail?: string
}

async function checkSupabase(): Promise<Check> {
  const start = performance.now()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || url.includes('placeholder') || !key) {
    return {
      name: 'supabase',
      ok: false,
      durationMs: Math.round(performance.now() - start),
      detail: 'not configured',
    }
  }

  try {
    const res = await fetch(`${url}/rest/v1/businesses?select=id&limit=1`, {
      method: 'GET',
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(3000),
    })
    return {
      name: 'supabase',
      ok: res.ok,
      durationMs: Math.round(performance.now() - start),
      detail: res.ok ? `HTTP ${res.status}` : `HTTP ${res.status} ${res.statusText}`,
    }
  } catch (err) {
    return {
      name: 'supabase',
      ok: false,
      durationMs: Math.round(performance.now() - start),
      detail: err instanceof Error ? err.message : String(err),
    }
  }
}

function checkEnv(): Check {
  const start = performance.now()
  const required = ['NEXT_PUBLIC_SUPABASE_URL']
  const missing = required.filter((k) => !process.env[k])
  return {
    name: 'env',
    ok: missing.length === 0,
    durationMs: Math.round(performance.now() - start),
    detail: missing.length === 0 ? 'all required vars present' : `missing: ${missing.join(', ')}`,
  }
}

export async function GET(request: Request) {
  const log = createRequestLogger(request)
  const url = new URL(request.url)
  const deep = url.searchParams.get('deep') === '1'

  const checks: Check[] = [checkEnv()]
  if (deep) {
    checks.push(await checkSupabase())
  }

  const allOk = checks.every((c) => c.ok)
  const body = {
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    service: 'paragu-ai-builder',
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    commit: process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown',
    env: process.env.NODE_ENV || 'unknown',
    checks,
    requestId: log.requestId,
  }

  if (!allOk) {
    log.warn('Health check degraded', { checks })
  } else {
    log.debug('Health check ok', { deep, checkCount: checks.length })
  }

  return NextResponse.json(body, {
    status: allOk ? 200 : 503,
    headers: { 'x-request-id': log.requestId, 'cache-control': 'no-store' },
  })
}
