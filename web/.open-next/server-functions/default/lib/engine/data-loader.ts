/**
 * Business Data Loader
 *
 * Loads business data from Supabase database.
 * Falls back to demo data if Supabase is not configured.
 */

import type { BusinessData } from './compose'
import { getDemoBusinessBySlug, getAllDemoSlugs, DEMO_BUSINESSES } from './demo-data'
import { logger } from '@/lib/logger'

function isStaticGenerationCookieError(message: string): boolean {
  return message.includes('Dynamic server usage') || message.includes('cookies')
}

type BusinessType = BusinessData['type']

type LeadDataModule = { LEAD_BUSINESSES?: Record<string, BusinessData> }

// Conditionally import lead data (module is generated optionally during site
// generation and may be absent in fresh checkouts).
let LEAD_BUSINESSES: Record<string, BusinessData> = {}
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional module load
  const leadData: LeadDataModule = require('./lead-data')
  LEAD_BUSINESSES = leadData.LEAD_BUSINESSES || {}
} catch {
  // Lead data not generated yet
}

interface BusinessRow {
  slug: string
  name: string
  type: string
  tagline?: string
  city?: string
  neighborhood?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  google_maps_url?: string
  hours?: Record<string, string>
  data_json?: {
    services?: BusinessData['services']
    products?: BusinessData['products']
    team?: BusinessData['team']
    gallery?: BusinessData['gallery']
    testimonials?: BusinessData['testimonials']
    heroImage?: string
    features?: BusinessData['features']
    processSteps?: BusinessData['processSteps']
    content?: BusinessData['contentOverrides']
  }
}

function rowToBusinessData(row: BusinessRow): BusinessData {
  const data = row.data_json || {}
  const content = data.content
  // Admin content editor can override top-level contact fields — when a
  // merchant edits /admin/content/<id>, their values win over the row's
  // dedicated columns. This way the editor is the source of truth once
  // used, without forcing a column-level migration for every field.
  const contactOverride = content?.contact
  return {
    slug: row.slug,
    name: row.name,
    type: row.type as BusinessType,
    tagline: content?.hero?.subheadline || row.tagline,
    city: contactOverride?.city || row.city || 'Asuncion',
    neighborhood: row.neighborhood,
    address: contactOverride?.address || row.address,
    phone: contactOverride?.phone || row.phone,
    email: contactOverride?.email || row.email,
    whatsapp: contactOverride?.whatsapp || row.whatsapp,
    instagram: row.instagram,
    facebook: row.facebook,
    googleMapsUrl: contactOverride?.googleMapsUrl || row.google_maps_url,
    hours: row.hours,
    services: data.services || [],
    products: data.products || [],
    team: data.team || [],
    gallery: data.gallery || [],
    // Testimonials — prefer the admin-edited list if present
    testimonials:
      content?.testimonials?.items?.map((t) => ({
        quote: t.quote,
        author: t.name,
        role: t.role,
        rating: t.rating,
      })) ||
      data.testimonials ||
      [],
    heroImage: content?.hero?.backgroundImageUrl || data.heroImage,
    // Relocation-specific fields
    features: data.features,
    processSteps: data.processSteps,
    contentOverrides: content,
  }
}

async function loadFromSupabase(slug: string): Promise<BusinessData | null> {
  // TODO: Implement Redis caching for business data to reduce DB load
  // TODO: Add stale-while-revalidate pattern for better performance
  // Skip Supabase during static generation to avoid cookie usage
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-export') {
    return null
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !data) return null
    return rowToBusinessData(data)
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    if (isStaticGenerationCookieError(errorMessage)) {
      logger.debug('Skipping Supabase during static generation', { slug, action: 'loadFromSupabase' })
    } else {
      logger.warn('Supabase load failed, falling back to demo/lead data', {
        slug,
        action: 'loadFromSupabase',
        error: errorMessage,
      })
    }
    return null
  }
}

export async function loadBusiness(slug: string): Promise<BusinessData | null> {
  // Try Supabase first
  const supabaseData = await loadFromSupabase(slug)
  if (supabaseData) return supabaseData

  // Fall back to lead data
  if (LEAD_BUSINESSES[slug]) return LEAD_BUSINESSES[slug]

  // Fall back to demo data — these are explicitly fictional, mark as demo so
  // <DemoBadge> renders the warning ribbon.
  const demo = getDemoBusinessBySlug(slug)
  return demo ? { ...demo, isDemo: true } : null
}

export async function loadAllSlugs(): Promise<string[]> {
  const slugs = new Set([...getAllDemoSlugs(), ...Object.keys(LEAD_BUSINESSES)])

  // Skip Supabase during static generation
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-export') {
    return Array.from(slugs)
  }

  // Try to get slugs from Supabase
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase
      .from('businesses')
      .select('slug')
      .eq('status', 'active')
    
    if (data) {
      data.forEach((row: { slug: string }) => slugs.add(row.slug))
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    if (!isStaticGenerationCookieError(errorMessage)) {
      logger.warn('Supabase slug listing failed, using local data only', {
        action: 'loadAllSlugs',
        error: errorMessage,
      })
    }
  }

  return Array.from(slugs)
}

export async function loadAllBusinesses(): Promise<BusinessData[]> {
  const businesses: BusinessData[] = [...Object.values(DEMO_BUSINESSES), ...Object.values(LEAD_BUSINESSES)]

  // Skip Supabase during static generation
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-export') {
    return businesses
  }

  // Try to get businesses from Supabase
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('status', 'active')
    
    if (data) {
      const supabaseBusinesses = data.map(rowToBusinessData)
      return supabaseBusinesses
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    if (!isStaticGenerationCookieError(errorMessage)) {
      logger.warn('Supabase business listing failed, using local data only', {
        action: 'loadAllBusinesses',
        error: errorMessage,
      })
    }
  }

  return businesses
}