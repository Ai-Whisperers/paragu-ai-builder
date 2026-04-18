#!/usr/bin/env node
/**
 * Lead Import Script
 * 
 * Imports Priority A leads from paragu-ai-leads CSV into Supabase.
 * Usage: npm run import:leads -- --file=../../paragu-ai-leads/data/processed/paraguay_priority_a.csv
 * 
 * Options:
 *   --file         Path to CSV file (required)
 *   --batch-size   Number of leads per batch (default: 100)
 *   --dry-run      Preview without inserting (default: false)
 *   --limit        Max leads to import (default: all)
 */

import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { slugify } from '../lib/utils.js'

// Parse CLI args
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace('--', '').split('=')
  acc[key] = value || true
  return acc
}, {})

const BATCH_SIZE = parseInt(args['batch-size']) || 100
const DRY_RUN = args['dry-run'] === 'true' || args['dry-run'] === true
const LIMIT = parseInt(args['limit']) || Infinity

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Business type mapping (from leads repo taxonomy to builder types)
const TYPE_MAPPING = {
  // Beauty & Wellness
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
  
  // Services
  'graphic_design': 'diseno_grafico',
  'legal': 'legal',
  'consulting': 'consultoria',
  'education': 'educacion',
  'health': 'salud',
  'investment': 'inversiones',
  'real_estate': 'inmobiliaria',
  'relocation': 'relocation',
  'meal_prep': 'meal_prep',
}

function mapBusinessType(category) {
  const normalized = category?.toLowerCase().replace(/[^a-z_]/g, '_')
  return TYPE_MAPPING[normalized] || 'peluqueria' // Default fallback
}

function generateSlug(name, placeId) {
  const base = slugify(name.toLowerCase())
  const shortId = placeId?.slice(-8) || Math.random().toString(36).slice(2, 8)
  return `${base}-${shortId}`
}

async function importLeads() {
  const csvFile = args['file']
  
  if (!csvFile) {
    console.error('❌ Usage: npm run import:leads -- --file=path/to/paraguay_priority_a.csv')
    process.exit(1)
  }

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
    console.error('❌ Failed to read CSV:', error.message)
    process.exit(1)
  }

  console.log(`📊 Found ${records.length} records in CSV`)
  
  if (LIMIT < records.length) {
    console.log(`⚠️  Limiting to ${LIMIT} leads`)
    records = records.slice(0, LIMIT)
  }

  // Transform records
  const leads = records.map((record, index) => ({
    business_name: record.name || record.business_name || 'Unknown Business',
    slug: generateSlug(
      record.name || record.business_name || 'business',
      record.place_id || record.google_maps_place_id
    ),
    business_type: mapBusinessType(record.category || record.business_type),
    
    // Contact
    phone: record.phone || record.phone_number || null,
    phone_status: record.phone_status || 'unknown',
    email: record.email || null,
    whatsapp: record.whatsapp || record.phone || null,
    instagram: record.instagram || record.instagram_handle || null,
    facebook_url: record.facebook || record.facebook_url || null,
    social_followers_estimate: record.social_followers ? parseInt(record.social_followers) : null,
    
    // Location
    address: record.address || record.formatted_address || null,
    neighborhood: record.neighborhood || null,
    city: record.city || 'Asuncion',
    state: record.state || 'Central',
    coordinates: record.latitude && record.longitude 
      ? { lat: parseFloat(record.latitude), lng: parseFloat(record.longitude) }
      : null,
    google_maps_url: record.google_maps_url || null,
    google_maps_place_id: record.place_id || record.google_maps_place_id || null,
    
    // Details
    hours: record.hours ? JSON.parse(record.hours) : null,
    years_in_operation: record.years_in_operation ? parseInt(record.years_in_operation) : null,
    rating: record.rating ? parseFloat(record.rating) : null,
    review_count: record.review_count ? parseInt(record.review_count) : null,
    
    // Scoring
    priority_score: record.priority_score ? parseInt(record.priority_score) : 70,
    priority_tier: record.priority_tier || 'A',
    has_website: record.has_website === 'true' || record.has_website === true || false,
    has_phone: !!record.phone,
    has_reviews: (record.review_count || 0) > 0,
    
    // Status
    status: 'new',
    source: 'google_maps_import',
    
    // Metadata
    imported_at: new Date().toISOString(),
    last_enriched_at: record.last_enriched_at || null,
  }))

  console.log(`\n📝 Transformed ${leads.length} leads`)
  
  // Preview
  console.log('\n📋 Sample lead:')
  console.log(JSON.stringify(leads[0], null, 2))

  if (DRY_RUN) {
    console.log('\n🏃 Dry run - no data inserted')
    console.log(`Would insert ${leads.length} leads in batches of ${BATCH_SIZE}`)
    return
  }

  // Check for existing slugs
  console.log('\n🔍 Checking for existing leads...')
  const slugs = leads.map(l => l.slug)
  const { data: existing, error: checkError } = await supabase
    .from('leads')
    .select('slug')
    .in('slug', slugs.slice(0, 100)) // Check first 100

  if (checkError) {
    console.error('❌ Failed to check existing leads:', checkError.message)
    process.exit(1)
  }

  const existingSlugs = new Set(existing?.map(e => e.slug) || [])
  const newLeads = leads.filter(l => !existingSlugs.has(l.slug))
  const skippedCount = leads.length - newLeads.length

  if (skippedCount > 0) {
    console.log(`⚠️  Skipping ${skippedCount} existing leads`)
  }

  console.log(`\n🚀 Inserting ${newLeads.length} new leads...`)

  // Batch insert
  let inserted = 0
  let failed = 0
  const errors = []

  for (let i = 0; i < newLeads.length; i += BATCH_SIZE) {
    const batch = newLeads.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(newLeads.length / BATCH_SIZE)
    
    process.stdout.write(`  Batch ${batchNum}/${totalBatches}... `)
    
    const { data, error } = await supabase
      .from('leads')
      .insert(batch)
      .select('id')

    if (error) {
      process.stdout.write('❌\n')
      failed += batch.length
      errors.push({ batch: batchNum, error: error.message })
      console.error(`    Error: ${error.message}`)
    } else {
      inserted += data.length
      process.stdout.write(`✅ (${data.length})\n`)
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n✨ Import complete!`)
  console.log(`   Inserted: ${inserted}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Skipped (existing): ${skippedCount}`)
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Errors in ${errors.length} batches`)
    errors.slice(0, 5).forEach(e => console.log(`   - Batch ${e.batch}: ${e.error}`))
  }

  // Summary stats
  const { count, error: countError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  if (!countError) {
    console.log(`\n📊 Total leads in database: ${count}`)
  }
}

// Run
importLeads().catch(error => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
