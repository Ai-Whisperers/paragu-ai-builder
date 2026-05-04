#!/usr/bin/env node
/**
 * lead-scout-import.ts
 * 
 * Imports Lead Scout CSV output (~/leads_tracker.csv) into Supabase.
 * Maps the lead-scout CSV columns to the leads table schema.
 * 
 * Usage:
 *   npm run import:leads:scout              # default: ~/leads_tracker.csv
 *   npm run import:leads:scout -- --file=/path/to/leads.csv
 *   npm run import:leads:scout -- --dry-run --limit=10
 * 
 * Compatible with the existing leads table schema.
 * Deduplicates by phone number.
 */

import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { homedir } from 'os'
import { config as dotenv } from 'dotenv'

// Load .env.local
dotenv({ path: resolve(__dirname, '../.env.local') })

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace('--', '').split('=')
  acc[key] = value || true
  return acc
}, {} as Record<string, string | boolean>)

const BATCH_SIZE = parseInt(args['batch-size'] as string) || 100
const DRY_RUN = args['dry-run'] === 'true' || args['dry-run'] === true
const LIMIT = parseInt(args['limit'] as string) || Infinity

const DEFAULT_CSV = resolve(homedir(), 'lead_scout_results', 'leads_tracker.csv')
const csvFile = (args['file'] as string) || DEFAULT_CSV

// CSV column mapping: lead-scout.py columns -> DB columns
const COLUMN_MAP: Record<string, string> = {
  'Date': 'imported_at',
  'Name': 'business_name',
  'City': 'city',
  'Category': 'business_type',
  'Phone': 'phone',
  'URL': 'google_maps_url',
  'Priority': 'priority_score',
}

const TYPE_MAPPING: Record<string, string> = {
  'peluqueria': 'peluqueria',
  'barberia': 'barberia',
  'taller_mecanico': 'taller_mecanico',
  'odontologia': 'odontologia',
  'estetica': 'estetica',
  'contador': 'contador',
  'abogado': 'abogado',
  'gimnasio': 'gimnasio',
  'veterinaria': 'veterinaria',
  'farmacia': 'farmacia',
  'electricista': 'electricista',
  'plomero': 'plomero',
  'restaurant': 'restaurant',
  'panaderia': 'panaderia',
}

function guessBusinessType(category: string): string {
  const c = (category || '').toLowerCase().trim()
  return TYPE_MAPPING[c] || c || 'peluqueria'
}

function parseDate(raw: string): string {
  if (!raw || raw === '') return new Date().toISOString()
  try {
    const d = new Date(raw)
    if (!isNaN(d.getTime())) return d.toISOString()
  } catch {}
  return new Date().toISOString()
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    console.error('   Copy from: https://supabase.com/dashboard/project/_/settings/api')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  if (!existsSync(csvFile)) {
    console.error(`❌ CSV not found: ${csvFile}`)
    console.error('   Run lead-scout.py first to generate leads_tracker.csv')
    process.exit(1)
  }

  console.log(`📖 Reading ${csvFile}...`)
  const content = readFileSync(csvFile, 'utf-8')
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    // Handle potential BOM
    bom: true,
  })

  console.log(`📊 Found ${records.length} records in CSV`)

  // Filter out header-row duplicates (if CSV was appended multiple times)
  const headerNames = ['Date', 'Name', 'City', 'Category', 'Phone', 'URL', 'Priority', 'Status']
  const cleanRecords = records.filter((r: any) => {
    return r.Name && !headerNames.includes(r.Name) && r.Name !== 'Name'
  })

  console.log(`🧹 After dedup headers: ${cleanRecords.length} records`)

  let leads = cleanRecords.map((r: any, index: number) => {
    const businessType = guessBusinessType(r.Category)
    
    return {
      business_name: r.Name?.slice(0, 200) || 'Unknown Business',
      business_type: businessType,
      slug: `${businessType}-${r.Phone || r.Name?.slice(0, 20) || index}-${Date.now()}`,
      
      // Contact
      phone: r.Phone || null,
      whatsapp: r.Phone || null,
      
      // Location
      city: r.City || 'Asuncion',
      state: 'Central',
      
      // Source
      source: 'lead_scout',
      google_maps_url: r.URL || null,
      
      // Scoring
      priority_score: parseInt(r.Priority || r.Score) || 50,
      priority_tier: (parseInt(r.Priority || r.Score) || 50) >= 60 ? 'A' : 'B',
      has_phone: !!r.Phone,
      has_website: false,
      has_reviews: false,
      
      // Pipeline
      status: 'new',
      imported_at: parseDate(r.Date),
    }
  })

  if (LIMIT < leads.length) {
    console.log(`⚠️  Limiting to ${LIMIT} leads`)
    leads = leads.slice(0, LIMIT)
  }

  console.log(`\n📝 Transformed ${leads.length} leads for import`)
  
  // Preview
  const sample = { ...leads[0] }
  delete sample.slug
  console.log('\n📋 Sample:')
  console.log(JSON.stringify(sample, null, 2))

  if (DRY_RUN) {
    console.log(`\n🏃 Dry run — would insert ${leads.length} leads`)
    return
  }

  // Check existing by phone
  console.log('\n🔍 Checking for existing leads by phone...')
  const phones = leads.filter(l => l.phone).map(l => l.phone).filter(Boolean)
  let existingPhones = new Set<string>()
  
  if (phones.length > 0) {
    for (let i = 0; i < phones.length; i += 50) {
      const batch = phones.slice(i, i + 50)
      const { data } = await supabase
        .from('leads')
        .select('phone')
        .in('phone', batch.map(String))
      if (data) {
        data.forEach(r => { if (r.phone) existingPhones.add(String(r.phone)) })
      }
    }
  }

  const newLeads = leads.filter(l => !l.phone || !existingPhones.has(String(l.phone)))
  const skippedCount = leads.length - newLeads.length
  console.log(`⚠️  Skipping ${skippedCount} existing by phone`)

  console.log(`\n🚀 Inserting ${newLeads.length} new leads...`)

  let inserted = 0
  let failed = 0
  const errors: string[] = []

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
      errors.push(`Batch ${batchNum}: ${error.message}`)
      console.error(`    Error: ${error.message}`)
    } else {
      inserted += data?.length || 0
      process.stdout.write(`✅ (${data?.length || 0})\n`)
    }
    
    await new Promise(r => setTimeout(r, 100))
  }

  console.log(`\n✨ Import complete!`)
  console.log(`   Inserted: ${inserted}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Skipped (existing): ${skippedCount}`)

  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} batch errors`)
    errors.slice(0, 3).forEach(e => console.log(`   - ${e}`))
  }
}

main().catch(err => {
  console.error('❌ Import failed:', err)
  process.exit(1)
})
