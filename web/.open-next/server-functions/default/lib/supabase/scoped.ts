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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryFilter = (query: any) => any

const SLOW_QUERY_THRESHOLD_MS = 1000

function trackQuery(table: string, operation: string, duration: number, rowCount?: number): void {
  if (duration > SLOW_QUERY_THRESHOLD_MS) {
    console.warn(
      `[SLOW QUERY] ${operation} ${table}: ${Math.round(duration)}ms` +
        (rowCount !== undefined ? ` (${rowCount} rows)` : '')
    )
  }
}

export function scopedQueries(supabase: SupabaseClient, businessId: string) {
  if (!businessId) {
    throw new Error('[ScopedQueries] business_id is required for scoped queries')
  }

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
        trackQuery(table, 'select', performance.now() - startTime, result.data ? 1 : 0)
        return { data: result.data as T | null, error: result.error, count: result.count ?? undefined }
      }

      const result = await query
      const rowCount = Array.isArray(result.data) ? result.data.length : undefined
      trackQuery(table, 'select', performance.now() - startTime, rowCount)
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
      trackQuery(table, 'insert', performance.now() - startTime, scopedRecords.length)
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
      const { business_id: _, ...safeData } = data

      const baseQuery = filter(
        supabase.from(table).update(safeData).eq('business_id', businessId)
      )

      const result = options?.returning !== false ? await baseQuery.select() : await baseQuery
      const rowCount = Array.isArray(result.data) ? result.data.length : undefined
      trackQuery(table, 'update', performance.now() - startTime, rowCount)
      return { data: result.data as T[] | null, error: result.error }
    },

    delete: async (table: string, filter: QueryFilter): Promise<{ error: Error | null }> => {
      const startTime = performance.now()
      let query = supabase.from(table).delete()
      query = query.eq('business_id', businessId)
      query = filter(query)

      const result = await query
      trackQuery(table, 'delete', performance.now() - startTime)
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
      trackQuery(table, 'count', performance.now() - startTime, result.count || 0)
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
  }
}

export type ScopedQueries = ReturnType<typeof scopedQueries>

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
