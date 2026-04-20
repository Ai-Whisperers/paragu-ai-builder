/**
 * Supabase Query Caching Layer
 *
 * Provides intelligent caching for Supabase queries with:
 * - LRU cache with TTL
 * - Automatic cache invalidation
 * - Cache warming support
 * - Request deduplication
 */
import { logger } from '@/lib/logger'

import { LRUCache } from 'lru-cache'

// Cache configuration
const CACHE_CONFIG = {
  max: 500,                    // Maximum 500 cached items
  ttl: 1000 * 60 * 5,          // Default 5 minute TTL
  updateAgeOnGet: true,        // Reset TTL on access
  allowStale: false,           // Don't serve stale data
}

// Create cache instance
const queryCache = new LRUCache<string, unknown>(CACHE_CONFIG)

// Track pending requests for deduplication
const pendingRequests = new Map<string, Promise<unknown>>()

/**
 * Generate cache key from query parameters
 */
function generateCacheKey(
  table: string,
  operation: string,
  params: Record<string, unknown>
): string {
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join('&')
  
  return `${table}:${operation}:${sortedParams}`
}

/**
 * Execute a query with caching
 * 
 * @param key - Unique cache key
 * @param queryFn - Function that executes the query
 * @param options - Cache options
 * @returns Query result
 * 
 * @example
 * ```typescript
 * const result = await cachedQuery(
 *   'leads:all',
 *   () => supabase.from('leads').select('*'),
 *   { ttl: 60000 } // 1 minute cache
 * )
 * ```
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options?: { ttl?: number; tags?: string[] }
): Promise<T> {
  // Check cache first
  const cached = queryCache.get(key) as T | undefined
  if (cached !== undefined) {
    return cached
  }
  
  // Check for pending request (deduplication)
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>
  }
  
  // Execute query
  const promise = queryFn().then(result => {
    // Store in cache
    queryCache.set(key, result, { ttl: options?.ttl })
    
    // Store tags for invalidation
    if (options?.tags) {
      for (const tag of options.tags) {
        const tagKey = `_tag:${tag}`
        const existing = queryCache.get(tagKey) as string[] || []
        if (!existing.includes(key)) {
          queryCache.set(tagKey, [...existing, key])
        }
      }
    }
    
    // Remove from pending
    pendingRequests.delete(key)
    
    return result
  }).catch(error => {
    // Remove from pending on error
    pendingRequests.delete(key)
    throw error
  })
  
  // Track pending request
  pendingRequests.set(key, promise)
  
  return promise
}

/**
 * Invalidate cache entries by key
 */
export function invalidateCache(key: string): void {
  queryCache.delete(key)
}

/**
 * Invalidate cache entries by tag
 */
export function invalidateTag(tag: string): void {
  const tagKey = `_tag:${tag}`
  const keys = queryCache.get(tagKey) as string[] | undefined
  
  if (keys) {
    for (const key of keys) {
      queryCache.delete(key)
    }
    queryCache.delete(tagKey)
  }
}

/**
 * Invalidate multiple cache entries by pattern
 */
export function invalidatePattern(pattern: string): void {
  for (const key of queryCache.keys()) {
    if (key.includes(pattern)) {
      queryCache.delete(key)
    }
  }
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
  queryCache.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number
  maxSize: number
  hitRate: number
} {
  return {
    size: queryCache.size,
    maxSize: CACHE_CONFIG.max,
    hitRate: queryCache.hitRate,
  }
}

/**
 * Warm cache with frequently accessed data
 */
export async function warmCache<T>(
  entries: Array<{ key: string; queryFn: () => Promise<T>; ttl?: number }>
): Promise<void> {
  await Promise.all(
    entries.map(({ key, queryFn, ttl }) => 
      cachedQuery(key, queryFn, { ttl }).catch(() => {
        // Ignore warming errors
      })
    )
  )
}

// Auto-clear cache on memory pressure (Node.js only)
if (typeof process !== 'undefined' && process.on) {
  process.on('warning', (warning) => {
    if (warning.name === 'MemoryLimitExceeded') {
      logger.warn('Memory pressure detected — clearing query cache', {
        action: 'supabase.cache.memoryPressure',
        warningName: warning.name,
      })
      clearCache()
    }
  })
}
