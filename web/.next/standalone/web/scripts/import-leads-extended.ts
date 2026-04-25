#!/usr/bin/env node
/**
 * Win 66: Import 500 more leads
 * 
 * Usage: npm run import:leads:extended -- --file=path/to/extended_leads.csv
 */
import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { slugify } from '@/lib/utils'

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace('--', '').split('=')
  acc[key] = value || true
  return acc
}, {})

const BATCH_SIZE = parseInt(args['batch-size']) || 100
const DRY_RUN = args['dry-run'] === 'true'
const TARGET_COUNT = 500

// Extended type mapping with more categories
const TYPE_MAPPING: Record<string, string> = {
  'hair_salon': 'peluqueria',
  'beauty_salon': 'salon_belleza',
  'nail_salon': 'unas',
  'barbershop': 'barberia',
  'spa': 'spa',
  'gym': 'gimnasio',
  'makeup_artist': 'maquillaje',
  'waxing': 'depilacion',
  'eyelash': 'pestanas',
  'tattoo': 'tatuajes',
  'esthetician': 'estetica',
  'graphic_design': 'diseno_grafico',
  'legal': 'legal',
  'consulting': 'consultoria',
  'education': 'educacion',
  'health': 'salud',
  'investment': 'inversiones',
  'real_estate': 'inmobiliaria',
  'relocation': 'relocation',
  'meal_prep': 'meal_prep',
  'restaurant': 'restaurant',
  'sushi_restaurant': 'sushi_bar',
  'cafe': 'restaurant',
  'bakery': 'restaurant',
  'dentist': 'salud',
  'doctor': 'salud',
  'pharmacy': 'salud',
  'veterinary': 'salud',
  'accountant': 'consultoria',
  'architect': 'consultoria',
  'photographer': 'diseno_grafico',
  'florist': 'estetica',
  'pet_grooming': 'estetica',
  'car_repair': 'consultoria',
  'auto_parts': 'consultoria',
  'electronics': 'consultoria',
  'furniture': 'inmobiliaria',
  'hardware_store': 'consultoria',
  'supermarket': 'meal_prep',
  'butcher': 'meal_prep',
  'fish_market': 'meal_prep',
  'wine_shop': 'restaurant',
  'cleaning_service': 'consultoria',
  'plumber': 'consultoria',
  'electrician': 'consultoria',
  'carpenter': 'consultoria',
  'painter': 'consultoria',
  'landscaping': 'estetica',
  'pest_control': 'consultoria',
  'security': 'consultoria',
  'laundry': 'consultoria',
  'dry_cleaning': 'consultoria',
  'tailor': 'consultoria',
  'shoe_repair': 'consultoria',
  'jewelry': 'estetica',
  'watch_repair': 'consultoria',
  'print_shop': 'diseno_grafico',
  'copy_shop': 'diseno_grafico',
  'internet_cafe': 'consultoria',
  'cybercafe': 'consultoria',
  'travel_agency': 'relocation',
  'insurance': 'inversiones',
  'bank': 'inversiones',
  'atm': 'inversiones',
  'money_transfer': 'inversiones',
  'mobile_phone': 'consultoria',
  'computer_repair': 'consultoria',
  'software': 'consultoria',
  'web_design': 'diseno_grafico',
  'marketing': 'consultoria',
  'translation': 'consultoria',
  'driving_school': 'educacion',
  'language_school': 'educacion',
  'music_school': 'educacion',
  'dance_school': 'educacion',
  'art_school': 'educacion',
  'sports_club': 'gimnasio',
  'yoga_studio': 'gimnasio',
  'martial_arts': 'gimnasio',
  'swimming_pool': 'gimnasio',
  'tennis_court': 'gimnasio',
  'soccer_field': 'gimnasio',
  'basketball_court': 'gimnasio',
  'volleyball_court': 'gimnasio',
  'golf_course': 'gimnasio',
  'horse_riding': 'gimnasio',
  'bowling': 'gimnasio',
  'billiards': 'gimnasio',
  'casino': 'inversiones',
  'nightclub': 'restaurant',
  'bar': 'restaurant',
  'pub': 'restaurant',
  'karaoke': 'restaurant',
  'cinema': 'restaurant',
  'theater': 'educacion',
  'museum': 'educacion',
  'library': 'educacion',
  'bookstore': 'educacion',
  'toy_store': 'educacion',
  'baby_store': 'educacion',
  'children_clothing': 'educacion',
  'school_supplies': 'educacion',
  'uniform_store': 'educacion',
  'optician': 'salud',
  'hearing_aids': 'salud',
  'medical_equipment': 'salud',
  'pharmacy': 'salud',
  'natural_medicine': 'salud',
  'acupuncture': 'salud',
  'chiropractic': 'salud',
  'physiotherapy': 'salud',
  'psychology': 'salud',
  'psychiatry': 'salud',
  'nutritionist': 'salud',
  'dietitian': 'salud',
  'personal_trainer': 'gimnasio',
  'sports_nutrition': 'gimnasio',
  'supplements': 'gimnasio',
  'sports_store': 'gimnasio',
}

function mapBusinessType(category: string): string {
  const normalized = category?.toLowerCase().replace(/[^a-z_]/g, '_')
  return TYPE_MAPPING[normalized] || 'consultoria'
}

function generateSlug(name: string, placeId: string, index: number): string {
  const base = slugify(name.toLowerCase())
  const shortId = placeId?.slice(-6) || Math.random().toString(36).slice(2, 8)
  return `${base}-${shortId}-${index}`
}

async function importExtendedLeads() {
  const csvFile = args['file']
  
  if (!csvFile) {
    console.error('❌ Usage: npx tsx scripts/import-leads-extended.ts --file=path/to/leads.csv')
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  console.log(`📖 Reading ${csvFile}...`)
  
  let records
  try {
    const content = readFileSync(resolve(csvFile), 'utf-8')
    records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
  } catch (error) {
    console.error('❌ Failed to read CSV:', (error as Error).message)
    process.exit(1)
  }

  // Limit to 500 records
  records = records.slice(0, TARGET_COUNT)
  console.log(`📊 Processing ${records.length} records (target: ${TARGET_COUNT})`)

  // Get current lead count
  const { count: currentCount, error: countError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('⚠️ Could not get current count:', countError.message)
  } else {
    console.log(`📊 Current leads in database: ${currentCount}`)
  }

  // Transform records
  const leads = records.map((record: Record<string, string>, index: number) => ({
    business_name: record.name || record.business_name || `Business ${index + 1}`,
    slug: generateSlug(
      record.name || record.business_name || 'business',
      record.place_id || record.google_maps_place_id || '',
      index
    ),
    business_type: mapBusinessType(record.category || record.business_type),
    phone: record.phone || record.phone_number || null,
    email: record.email || null,
    whatsapp: record.whatsapp || record.phone || null,
    instagram: record.instagram || record.instagram_handle || null,
    facebook_url: record.facebook || record.facebook_url || null,
    address: record.address || record.formatted_address || null,
    neighborhood: record.neighborhood || null,
    city: record.city || 'Asuncion',
    state: record.state || 'Central',
    coordinates: record.latitude && record.longitude 
      ? { lat: parseFloat(record.latitude), lng: parseFloat(record.longitude) }
      : null,
    google_maps_url: record.google_maps_url || null,
    google_maps_place_id: record.place_id || record.google_maps_place_id || null,
    hours: record.hours ? (() => { try { return JSON.parse(record.hours) } catch { return null } })() : null,
    years_in_operation: record.years_in_operation ? parseInt(record.years_in_operation) : null,
    rating: record.rating ? parseFloat(record.rating) : null,
    review_count: record.review_count ? parseInt(record.review_count) : null,
    priority_score: record.priority_score ? parseInt(record.priority_score) : 50,
    priority_tier: record.priority_tier || 'B',
    has_website: record.has_website === 'true' || record.has_website === true || false,
    has_phone: !!record.phone,
    has_reviews: (parseInt(record.review_count) || 0) > 0,
    status: 'new',
    source: 'extended_import_batch',
    imported_at: new Date().toISOString(),
  }))

  // Check for existing slugs
  const slugs = leads.map(l => l.slug)
  const { data: existing } = await supabase
    .from('leads')
    .select('slug')
    .in('slug', slugs.slice(0, 100))

  const existingSlugs = new Set(existing?.map((e: { slug: string }) => e.slug) || [])
  const newLeads = leads.filter(l => !existingSlugs.has(l.slug))
  const skippedCount = leads.length - newLeads.length

  console.log(`\n📋 Lead distribution by type:`)
  const typeCount = leads.reduce((acc: Record<string, number>, lead: { business_type: string }) => {
    acc[lead.business_type] = (acc[lead.business_type] || 0) + 1
    return acc
  }, {})
  Object.entries(typeCount)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`)
    })

  if (skippedCount > 0) {
    console.log(`\n⚠️  Skipping ${skippedCount} existing leads`)
  }

  if (DRY_RUN) {
    console.log(`\n🏃 Dry run - no data inserted`)
    console.log(`Would insert ${newLeads.length} leads`)
    return
  }

  console.log(`\n🚀 Inserting ${newLeads.length} new leads...`)

  // Batch insert
  let inserted = 0
  let failed = 0
  const errors: Array<{ batch: number; error: string }> = []

  for (let i = 0; i < newLeads.length; i += BATCH_SIZE) {
    const batch = newLeads.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(newLeads.length / BATCH_SIZE)
    
    process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.length} leads)... `)
    
    const { data, error } = await supabase
      .from('leads')
      .insert(batch)
      .select('id')

    if (error) {
      process.stdout.write('❌\n')
      failed += batch.length
      errors.push({ batch: batchNum, error: error.message })
    } else {
      inserted += (data?.length || 0)
      process.stdout.write(`✅ (${data?.length || 0})\n`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n✨ Import complete!`)
  console.log(`   Inserted: ${inserted}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Skipped (existing): ${skippedCount}`)
  
  // Final count
  const { count: finalCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  console.log(`\n📊 Total leads in database: ${finalCount}`)
  console.log(`📊 Leads added in this run: ${inserted}`)
}

importExtendedLeads().catch(error => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
