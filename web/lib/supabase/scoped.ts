/**
 * Business-Scoped Query Builders
 *
 * Adapted from Vete's tenant-scoped queries (ai-whisperers/vete).
 * Provides query builders that automatically enforce business isolation,
 * preventing cross-business data access at the application level.
 *
 * Usage:
 * ```typescript
 * const { select, insert, update } = scopedQueries(supabase, businessId)
 * await select('site_pages', '*')
 * await insert('generation_logs', { step: 'render', status: 'success' })
 * ```
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { cachedQuery, invalidateTag } from './cache'

// Query filter — intentionally loose because Supabase's chainable builder
// types (PostgrestFilterBuilder<T>) are heavy and change across versions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryFilter = (query: any) => any

const SLOW_QUERY_THRESHOLD_MS = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS || '1000', 10)

function trackQuery(
  table: string,
  operation: string,
  duration: number,
  businessId: string,
  rowCount?: number,
  error?: Error | null,
): void {
  const ms = Math.round(duration)
  if (error) {
    logger.error('Scoped query failed', {
      action: 'scopedQuery',
      table,
      operation,
      businessId,
      duration: ms,
      rowCount,
      error: error.message,
    })
    return
  }
  if (duration > SLOW_QUERY_THRESHOLD_MS) {
    logger.warn('Slow scoped query', {
      action: 'scopedQuery',
      table,
      operation,
      businessId,
      duration: ms,
      rowCount,
    })
  } else {
    logger.debug('Scoped query', {
      action: 'scopedQuery',
      table,
      operation,
      businessId,
      duration: ms,
      rowCount,
    })
  }
}

export function scopedQueries(supabase: SupabaseClient, businessId: string) {
  if (!businessId) {
    throw new Error('[ScopedQueries] business_id is required for scoped queries')
  }

   
  // selectCached / batchInsert, so we capture it as a named const before return.
  let queries: ReturnType<typeof buildScopedQueries>
   
  queries = buildScopedQueries(supabase, businessId, () => queries)
  return queries
}

function buildScopedQueries(
  supabase: SupabaseClient,
  businessId: string,
  self: () => ReturnType<typeof buildScopedQueries>,
) {
  return {
    client: supabase,
    businessId,

    select: async <T = unknown>(
      table: string,
      columns: string = '*',
      options?: {
        filter?: QueryFilter
        single?: boolean
        count?: 'exact' | 'planned' | 'estimated'
      }
    ): Promise<{ data: T[] | T | null; error: Error | null; count?: number }> => {
      const startTime = performance.now()

      let query = supabase.from(table).select(columns, { count: options?.count })
      query = query.eq('business_id', businessId)

      if (options?.filter) {
        query = options.filter(query)
      }

      if (options?.single) {
        const result = await query.single()
        trackQuery(table, 'select', performance.now() - startTime, businessId, result.data ? 1 : 0, result.error)
        return { data: result.data as T | null, error: result.error, count: result.count ?? undefined }
      }

      const result = await query
      const rowCount = Array.isArray(result.data) ? result.data.length : undefined
      trackQuery(table, 'select', performance.now() - startTime, businessId, rowCount, result.error)
      return { data: result.data as T[] | null, error: result.error, count: result.count ?? undefined }
    },

    insert: async <T = unknown>(
      table: string,
      data: Record<string, unknown> | Record<string, unknown>[],
      options?: { returning?: boolean }
    ): Promise<{ data: T[] | null; error: Error | null }> => {
      const startTime = performance.now()
      const records = Array.isArray(data) ? data : [data]

      const scopedRecords = records.map((record) => ({
        ...record,
        business_id: businessId,
      }))

      const baseQuery = supabase.from(table).insert(scopedRecords)
      const result = options?.returning !== false ? await baseQuery.select() : await baseQuery
      trackQuery(table, 'insert', performance.now() - startTime, businessId, scopedRecords.length, result.error)
      return { data: result.data as T[] | null, error: result.error }
    },

    update: async <T = unknown>(
      table: string,
      data: Record<string, unknown>,
      filter: QueryFilter,
      options?: { returning?: boolean }
    ): Promise<{ data: T[] | null; error: Error | null }> => {
      const startTime = performance.now()
      // Prevent cross-business moves
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { business_id: _unused, ...safeData } = data

      const baseQuery = filter(
        supabase.from(table).update(safeData).eq('business_id', businessId)
      )

      const result = options?.returning !== false ? await baseQuery.select() : await baseQuery
      const rowCount = Array.isArray(result.data) ? result.data.length : undefined
      trackQuery(table, 'update', performance.now() - startTime, businessId, rowCount, result.error)
      return { data: result.data as T[] | null, error: result.error }
    },

    delete: async (table: string, filter: QueryFilter): Promise<{ error: Error | null }> => {
      const startTime = performance.now()
      let query = supabase.from(table).delete()
      query = query.eq('business_id', businessId)
      query = filter(query)

      const result = await query
      trackQuery(table, 'delete', performance.now() - startTime, businessId, undefined, result.error)
      return { error: result.error }
    },

    count: async (
      table: string,
      filter?: QueryFilter
    ): Promise<{ count: number; error: Error | null }> => {
      const startTime = performance.now()
      let query = supabase.from(table).select('*', { count: 'exact', head: true })
      query = query.eq('business_id', businessId)

      if (filter) {
        query = filter(query)
      }

      const result = await query
      trackQuery(table, 'count', performance.now() - startTime, businessId, result.count || 0, result.error)
      return { count: result.count || 0, error: result.error }
    },

    exists: async (
      table: string,
      id: string
    ): Promise<{ exists: boolean; error: Error | null }> => {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('id', id)
        .eq('business_id', businessId)

      return { exists: (count || 0) > 0, error }
    },

    verify: async <T = unknown>(
      table: string,
      id: string,
      columns: string = 'id, business_id'
    ): Promise<{ data: T | null; valid: boolean; error: Error | null }> => {
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .eq('id', id)
        .eq('business_id', businessId)
        .single()

      return { data: data as T | null, valid: !!data, error }
    },

    /**
     * Execute a cached select query
     */
    selectCached: async <T = unknown>(
      table: string,
      columns: string = '*',
      options?: {
        filter?: QueryFilter
        single?: boolean
        cacheTtl?: number
        cacheTags?: string[]
      }
    ): Promise<{ data: T[] | T | null; error: Error | null }> => {
      const cacheKey = `scoped:${businessId}:${table}:${columns}:${JSON.stringify(options?.filter)}`
      const ttl = options?.cacheTtl || 60000 // Default 1 minute

      try {
        const result = await cachedQuery(
          cacheKey,
          async () => {
            const { data, error } = await self().select<T>(table, columns, {
              filter: options?.filter,
              single: options?.single,
            })
            if (error) throw error
            return { data, error }
          },
          { ttl, tags: options?.cacheTags || [table, businessId] }
        )
        return result
      } catch (error) {
        return { data: null, error: error as Error }
      }
    },

    /**
     * Batch insert records
     */
    batchInsert: async <T = unknown>(
      table: string,
      records: Record<string, unknown>[],
      options?: { batchSize?: number; returning?: boolean }
    ): Promise<{ data: T[] | null; error: Error | null }> => {
      const startTime = performance.now()
      const batchSize = options?.batchSize || 100
      const results: T[] = []

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize)
        const { data, error } = await self().insert<T>(table, batch, {
          returning: options?.returning,
        })

        if (error) {
          trackQuery(table, 'batchInsert', performance.now() - startTime, businessId, results.length, error)
          return { data: results.length > 0 ? results : null, error }
        }

        if (data) results.push(...data)
      }

      trackQuery(table, 'batchInsert', performance.now() - startTime, businessId, results.length, null)

      // Invalidate cache for this table
      invalidateTag(table)

      return { data: results, error: null }
    },

    /**
     * Invalidate cache for this business
     */
    invalidateCache: (pattern?: string): void => {
      if (pattern) {
        invalidateTag(pattern)
      } else {
        invalidateTag(businessId)
      }
    },
  }
}

/**
 * Tables that require business isolation
 */
export const BUSINESS_SCOPED_TABLES = [
  'businesses',
  'generated_sites',
  'site_pages',
  'site_assets',
  'generation_logs',
] as const

export type BusinessScopedTable = (typeof BUSINESS_SCOPED_TABLES)[number]
