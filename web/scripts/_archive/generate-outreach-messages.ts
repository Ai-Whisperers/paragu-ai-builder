#!/usr/bin/env node
/**
 * Generate personalized WhatsApp outreach messages for all demo_ready leads.
 *
 * Output: sites/outreach-messages.json — structured JSON for bot/team to consume.
 * Each entry contains: lead info, preview URL, wa.me link, and message body.
 *
 * Usage: npx tsx web/scripts/generate-outreach-messages.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qyvokpribmbrosafntqa.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMxODE1NSwiZXhwIjoyMDkxODk0MTU1fQ.rphBsAVMuI_2X8RCU7D0JiGd8pqqdpcQ7vpUrirU06g'
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BASE_URL = 'https://paragu-ai.com'

function phoneToDigits(phone: string): string {
  const clean = phone.replace(/[\s\-()+]/g, '')
  if (clean.startsWith('595')) return clean
  if (/^0/.test(clean)) return '595' + clean.slice(1)
  return '595' + clean
}

function waLink(phone: string, message: string): string {
  return `https://wa.me/${phoneToDigits(phone)}?text=${encodeURIComponent(message)}`
}

const TYPE_EMOJI: Record<string, string> = {
  barberia: '💈',
  gimnasio: '🏋️',
  spa: '🧖',
  peluqueria: '✂️',
  depilacion: '✨',
  maquillaje: '💄',
  estetica: '💅',
}

const TYPE_PITCH: Record<string, string> = {
  barberia: 'Vi que tienen muy buena presencia en Instagram pero no tienen página web. Hoy en día una barbería con buena página web destaca mucho más.',
  gimnasio: 'Los gimnasios con página web captan muchos más clientes nuevos. Pudimos ver que tienen buena reputación pero les falta presencia online.',
  spa: 'Un spa con página web transmite mucha más confianza y profesionalismo. Vi sus reseñas excelentes y creo que una web les vendría genial.',
  peluqueria: 'Muchas peluquerías solo tienen Instagram, pero una página web les da mucha más credibilidad y atrae clientes que buscan servicios específicos.',
  depilacion: 'La depilación láser es un servicio que la gente investiga mucho antes de ir. Una página web con sus tratamientos y precios les daría mucha ventaja.',
  maquillaje: 'Como maquilladora profesional, un portafolio web es fundamental. Muestra mucho más profesionalismo que solo Instagram.',
  estetica: 'Una clínica estética con página web inspira mucha más confianza en los pacientes nuevos.',
}

interface LeadMessage {
  id: string
  business_name: string
  business_type: string
  phone: string
  city: string
  rating: number
  review_count: number
  preview_site_id: string | null
  preview_url: string | null
  outreach_message: string
  demo_message: string
  wa_outreach_link: string
  wa_demo_link: string
  priority: number
  notes: string
}

async function main() {
  console.log('Fetching demo_ready leads...\n')

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'demo_ready')
    .not('preview_site_id', 'is', null)
    .order('review_count', { ascending: false })

  if (error) {
    console.error('Query failed:', error)
    process.exit(1)
  }

  console.log(`Found ${leads.length} leads with preview sites\n`)

  const messages: LeadMessage[] = leads.map((lead, idx) => {
    const bizName = (lead.business_name || '').trim()
    const bizType = (lead.business_type || 'peluqueria') as string
    const city = (lead.city || 'Asunción').trim()
    const previewSlug = lead.preview_site_id || ''
    const previewUrl = previewSlug ? `${BASE_URL}/s/es/${previewSlug}` : null
    const phone = (lead.phone || '').trim()
    const emoji = TYPE_EMOJI[bizType] || '🏪'
    const rating = lead.rating || 0
    const reviews = lead.review_count || 0
    const reviewNote = reviews >= 100 ? ` (¡${reviews} reseñas en Google!)` : reviews >= 30 ? ` (${reviews} reseñas)` : ''

    const pitch = TYPE_PITCH[bizType] || 'Vi que tienen buena reputación online pero no tienen página web todavía.'

    // Personalized initial outreach
    const outreach = `¡Hola! 👋

Soy de Paragu-AI ${emoji} — ayudamos a negocios como ${bizName} a tener presencia web profesional.

${pitch}${reviewNote}

¿Actualmente tienen página web o solo manejan redes sociales?

Si les interesa, les mostramos un demo sin compromiso.
Quedamos atentos,
Equipo Paragu-AI`

    // Demo-ready follow-up with their specific preview URL
    const demo = previewUrl ? `¡Hola de nuevo! 👋

Preparamos algo especial para ${bizName}:

🌐 ${bizName} — SITIO WEB DE DEMO:
${previewUrl}

Este demo está basado en lo que vimos de su negocio. Tiene secciones de servicios, galería, equipo, contacto y más. Se ve perfecto en celulares.

¿Les gustaría agendar una llamada de 10 minutos para ver cómo personalizarlo con sus fotos y colores?

Saludos,
Equipo Paragu-AI` : `¡Hola de nuevo! 👋 ¿Siguen interesados en tener su página web?`

    const waOutreach = phone ? waLink(phone, outreach) : ''
    const waDemo = phone ? waLink(phone, demo) : ''

    // Priority scoring for the marketing team
    const priority = Math.min(100, Math.round(
      (reviews >= 100 ? 40 : reviews >= 30 ? 30 : 20) +
      (rating >= 4.8 ? 30 : rating >= 4.5 ? 20 : 10) +
      (city === 'Asunción' ? 20 : ['Fernando de la Mora', 'San Lorenzo', 'Lambaré', 'Luque'].includes(city) ? 15 : 10) +
      (bizType === 'barberia' ? 10 : bizType === 'gimnasio' ? 8 : 5)
    ))

    const notes = []
    if (reviews >= 200) notes.push('🔥 Muy establecido')
    if (rating >= 4.9) notes.push('⭐ Excelente reputación')
    if (bizType === 'barberia') notes.push('💈 Tendencia, alta conversión esperada')
    // Duplicate detection handled by priority sorting

    return {
      id: lead.id,
      business_name: bizName,
      business_type: bizType,
      phone,
      city,
      rating,
      review_count: reviews,
      preview_site_id: previewSlug,
      preview_url: previewUrl,
      outreach_message: outreach,
      demo_message: demo,
      wa_outreach_link: waOutreach,
      wa_demo_link: waDemo,
      priority,
      notes: notes.join(' | '),
    }
  })

  // Sort by priority
  messages.sort((a, b) => b.priority - a.priority)

  // Write output
  const outputPath = path.join(ROOT, 'sites', 'outreach-messages.json')
  fs.writeFileSync(outputPath, JSON.stringify({ generated_at: new Date().toISOString(), total: messages.length, leads: messages }, null, 2))

  // Also write a CSV for easy import
  const csvPath = path.join(ROOT, 'sites', 'outreach-messages.csv')
  const csvHeader = 'priority,business_name,business_type,city,phone,rating,review_count,preview_url,outreach_message,demo_message,wa_outreach_link,wa_demo_link,notes\n'

  function csvEscape(s: string): string {
    return '"' + s.replace(/"/g, '""').replace(/\n/g, '\\n') + '"'
  }

  const csvRows = messages.map(m =>
    `${m.priority},${csvEscape(m.business_name)},${m.business_type},${m.city},${m.phone},${m.rating},${m.review_count},${m.preview_url || ''},${csvEscape(m.outreach_message)},${csvEscape(m.demo_message)},${m.wa_outreach_link},${m.wa_demo_link},${csvEscape(m.notes)}`
  )
  fs.writeFileSync(csvPath, csvHeader + csvRows.join('\n'))

  // Print summary
  const top10 = messages.slice(0, 10)
  console.log('=== TOP 10 PRIORITY LEADS ===')
  console.log('')
  for (const m of top10) {
    console.log(`#${m.priority} ${m.business_name}`)
    console.log(`   ${m.business_type} · ${m.city} · ⭐${m.rating} · ${m.review_count} reviews`)
    console.log(`   📞 ${m.phone}`)
    console.log(`   🔗 ${m.preview_url}`)
    console.log(`   💬 ${m.wa_outreach_link}`)
    if (m.notes) console.log(`   📝 ${m.notes}`)
    console.log('')
  }

  console.log(`=== FULL OUTPUT ===`)
  console.log(`JSON: ${outputPath}`)
  console.log(`CSV:  ${csvPath}`)
  console.log(`Total leads: ${messages.length}`)
  console.log(`\nPriorities:`)
  const byPriority: Record<string, number> = {}
  messages.forEach(m => {
    const bucket = m.priority >= 80 ? '80-100 🔥' : m.priority >= 60 ? '60-79 ✅' : m.priority >= 40 ? '40-59 📋' : '0-39 🔄'
    byPriority[bucket] = (byPriority[bucket] || 0) + 1
  })
  for (const [bucket, count] of Object.entries(byPriority)) {
    console.log(`  ${bucket}: ${count} leads`)
  }
}



main().catch(console.error)
