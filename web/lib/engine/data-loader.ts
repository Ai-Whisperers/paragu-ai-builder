/**
 * Business Data Loader
 *
 * Loads business data from Supabase database.
 * Falls back to demo data if Supabase is not configured.
 */

import type { BusinessData } from './compose'
import { getDemoBusiness, getDemoBusinessBySlug, getAllDemoSlugs, RELOCATION_DEMO_BUSINESSES, DEMO_BUSINESSES } from './demo-data'

// Conditionally import lead data
let LEAD_BUSINESSES: Record<string, BusinessData> = {}
try {
  const leadData = require('./lead-data')
  LEAD_BUSINESSES = leadData.LEAD_BUSINESSES || {}
} catch {
  // Lead data not generated yet
}

function rowToBusinessData(row: any): BusinessData {
  const data = row.data_json || {}
  return {
    slug: row.slug,
    name: row.name,
    type: row.type,
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
    services: data.services,
    products: data.products,
    team: data.team,
    gallery: data.gallery,
    testimonials: data.testimonials,
    heroImage: data.heroImage,
  }
}

async function loadFromSupabase(slug: string): Promise<BusinessData | null> {
  try {
    // Try direct import without cookies for static generation
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qyvokpribmbrosafntqa.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KQ-sFNr7r6AauoG0B4nyTg_vuPHmeCm'
    const supabase = createClient(supabaseUrl, supabaseKey)

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
      data.forEach((row: any) => slugs.add(row.slug))
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