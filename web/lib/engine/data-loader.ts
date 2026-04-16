/**
 * Business Data Loader
 *
 * Abstracts the data source for business data. Currently reads from the
 * in-repo demo dataset plus any optional generated lead dataset. Supabase
 * integration lives behind this module so consumers only depend on the
 * `loadBusiness` / `loadAllSlugs` / `loadAllBusinesses` API.
 *
 * To enable Supabase (future):
 *   1. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   2. Run migrations (001_initial_schema.sql, 002_seed_demo_data.sql)
 *   3. Import leads via the scripts/ pipeline
 *   4. Wire the Supabase branch below
 *
 * IMPORTANT: Do NOT import @/lib/supabase/* eagerly here until Supabase
 * is configured. Even dynamic imports get traced by webpack and trigger
 * cookies() calls that break static generation on Cloudflare Pages.
 */

import type { BusinessData } from './business'
import {
  getDemoBusiness,
  getAllDemoSlugs,
  DEMO_BUSINESSES,
} from './demo-data'

/**
 * Optional generated lead dataset. Populated at module init by looking
 * for the sibling `lead-data` module (produced by the lead-generation
 * script). Absence is expected and fine; any other error is surfaced
 * rather than swallowed.
 */
const LEAD_BUSINESSES: Record<string, BusinessData> = loadOptionalLeadData()

function loadOptionalLeadData(): Record<string, BusinessData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('./lead-data') as
      | { LEAD_BUSINESSES?: Record<string, BusinessData> }
      | undefined
    return mod?.LEAD_BUSINESSES ?? {}
  } catch (error) {
    // Only "module not found" is expected — anything else is a real bug.
    if (
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND' &&
      /lead-data/.test(error.message)
    ) {
      return {}
    }
    console.error('[data-loader] Failed loading optional lead-data:', error)
    throw error
  }
}

/**
 * Load a single business by slug.
 * Lead data takes priority over demo data.
 */
export async function loadBusiness(slug: string): Promise<BusinessData | null> {
  if (LEAD_BUSINESSES[slug]) return LEAD_BUSINESSES[slug]
  return getDemoBusiness(slug)
}

/**
 * Load all business slugs for static generation.
 */
export async function loadAllSlugs(): Promise<string[]> {
  const slugs = new Set([
    ...getAllDemoSlugs(),
    ...Object.keys(LEAD_BUSINESSES),
  ])
  return Array.from(slugs)
}

/**
 * Load all businesses (for admin dashboard).
 */
export async function loadAllBusinesses(): Promise<BusinessData[]> {
  return [
    ...Object.values(DEMO_BUSINESSES),
    ...Object.values(LEAD_BUSINESSES),
  ]
}
