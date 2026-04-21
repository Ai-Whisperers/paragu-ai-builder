import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

export interface ResolvedBusiness {
  id: string
  slug: string
  name: string
  type: string
  currency: string
  /** Preferred payment provider hint, surfaced from registry/data_json. */
  preferredProvider?: string
}

/**
 * Resolve `[site]` URL slug to a business record.
 * Returns null if the slug is unknown (API routes should 404, never 403).
 * The caller is responsible for checking registry.commerce.enabled.
 */
export async function resolveBusinessBySlug(slug: string): Promise<ResolvedBusiness | null> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('businesses')
    .select('id, slug, name, type, data_json')
    .eq('slug', slug)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (error) {
    logger.error('[commerce] resolveBusinessBySlug failed', {
      action: 'commerce.resolve_business',
      slug,
      error: error.message,
    })
    return null
  }
  if (!data) return null

  const commerceCfg = (data.data_json as { commerce?: { currency?: string; provider?: string } } | null)?.commerce
  const currency = commerceCfg?.currency ?? 'PYG'

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    type: data.type,
    currency,
    preferredProvider: commerceCfg?.provider,
  }
}
