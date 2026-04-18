/**
 * Business Data Loader
 *
 * Loads business data from Supabase database.
 * Falls back to demo data if Supabase is not configured.
 */

import type { BusinessData } from './compose'
import { getDemoBusiness, getDemoBusinessBySlug, getAllDemoSlugs, RELOCATION_DEMO_BUSINESSES, DEMO_BUSINESSES } from './demo-data'

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
  }
}

function rowToBusinessData(row: BusinessRow): BusinessData {
  const data = row.data_json || {}
  return {
    slug: row.slug,
    name: row.name,
    type: row.type as BusinessType,
    tagline: row.tagline,
    city: row.city || 'Asuncion',
    neighborhood: row.neighborhood,
    address: row.address,
    phone: row.phone,
    email: row.email,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    facebook: row.facebook,
    googleMapsUrl: row.google_maps_url,
    hours: row.hours,
    services: data.services || [],
    products: data.products || [],
    team: data.team || [],
    gallery: data.gallery || [],
    testimonials: data.testimonials || [],
    heroImage: data.heroImage,
    // Relocation-specific fields
    features: data.features,
    processSteps: data.processSteps,
  }
}

async function loadFromSupabase(slug: string): Promise<BusinessData | null> {
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
    console.warn('[DataLoader] Supabase not available:', e)
    return null
  }
}

export async function loadBusiness(slug: string): Promise<BusinessData | null> {
  // Try Supabase first
  const supabaseData = await loadFromSupabase(slug)
  if (supabaseData) return supabaseData

  // Fall back to lead data
  if (LEAD_BUSINESSES[slug]) return LEAD_BUSINESSES[slug]

  // Fall back to demo data
  return getDemoBusinessBySlug(slug)
}

export async function loadAllSlugs(): Promise<string[]> {
  const slugs = new Set([...getAllDemoSlugs(), ...Object.keys(LEAD_BUSINESSES)])

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
  } catch {
    // Supabase not available, use local data only
  }

  return Array.from(slugs)
}

export async function loadAllBusinesses(): Promise<BusinessData[]> {
  const businesses: BusinessData[] = [...Object.values(DEMO_BUSINESSES), ...Object.values(LEAD_BUSINESSES)]

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
  } catch {
    // Supabase not available
  }

  return businesses
}