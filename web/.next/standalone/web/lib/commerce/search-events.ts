import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { normalizeSearchTerm } from './search-normalize'

export type SearchEventSource = 'tienda' | 'suggest' | 'header'

/**
 * Fire-and-forget record of a shopper search. Non-blocking —
 * failures are logged and swallowed so the UI is never affected.
 * Powers the admin analytics view (top queries, zero-result queries).
 */
export async function recordSearchEvent(opts: {
  businessId: string
  query: string
  resultCount: number
  source: SearchEventSource
  sessionToken?: string | null
}): Promise<void> {
  const clean = opts.query.trim()
  if (!clean) return
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('search_events').insert({
      business_id: opts.businessId,
      query: clean,
      query_normalized: normalizeSearchTerm(clean),
      result_count: opts.resultCount,
      source: opts.source,
      session_token: opts.sessionToken ?? null,
    })
    if (error) {
      logger.warn('[search-events] insert failed', {
        action: 'commerce.search_event.insert_failed',
        error: error.message,
      })
    }
  } catch (err) {
    logger.warn('[search-events] insert threw', {
      action: 'commerce.search_event.threw',
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export interface SearchEventSummary {
  queryNormalized: string
  sampleQuery: string
  hits: number
  avgResults: number
  zeroResultHits: number
  lastSeen: string
}

/**
 * Admin summary: top search queries in a window, aggregated by their
 * normalized form so "uñas"/"Uñas"/"unas" collapse into one row. Sort
 * by total hits desc.
 */
export async function listTopSearches(
  businessId: string,
  opts: { windowDays?: number; limit?: number; zeroResultOnly?: boolean } = {},
): Promise<SearchEventSummary[]> {
  const windowDays = opts.windowDays ?? 30
  const limit = opts.limit ?? 20
  const supabase = await createAdminClient()
  const since = new Date(Date.now() - windowDays * 86_400_000).toISOString()
  let query = supabase
    .from('search_events')
    .select('query, query_normalized, result_count, created_at')
    .eq('business_id', businessId)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(5000)
  if (opts.zeroResultOnly) query = query.eq('result_count', 0)
  const { data } = await query

  const rows = (Array.isArray(data) ? data : []) as Array<{
    query: string
    query_normalized: string
    result_count: number
    created_at: string
  }>

  // Aggregate in-process. At 5k rows / 30 days this costs nothing.
  const agg = new Map<string, {
    queryNormalized: string
    sampleQuery: string
    hits: number
    resultsSum: number
    zeroResultHits: number
    lastSeen: string
  }>()
  for (const r of rows) {
    const key = r.query_normalized
    const current = agg.get(key)
    if (current) {
      current.hits += 1
      current.resultsSum += r.result_count
      if (r.result_count === 0) current.zeroResultHits += 1
      if (r.created_at > current.lastSeen) current.lastSeen = r.created_at
    } else {
      agg.set(key, {
        queryNormalized: key,
        sampleQuery: r.query,
        hits: 1,
        resultsSum: r.result_count,
        zeroResultHits: r.result_count === 0 ? 1 : 0,
        lastSeen: r.created_at,
      })
    }
  }
  const list: SearchEventSummary[] = [...agg.values()]
    .map((v) => ({
      queryNormalized: v.queryNormalized,
      sampleQuery: v.sampleQuery,
      hits: v.hits,
      avgResults: v.hits > 0 ? Math.round(v.resultsSum / v.hits) : 0,
      zeroResultHits: v.zeroResultHits,
      lastSeen: v.lastSeen,
    }))
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
  return list
}
