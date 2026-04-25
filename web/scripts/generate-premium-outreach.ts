#!/usr/bin/env node
/**
 * Premium outreach message generator.
 * Creates detailed, hand-crafted messages per lead using all available research.
 *
 * Output: sites/premium-outreach.json — complete outreach kit for bot/team.
 *
 * Usage: npx tsx web/scripts/generate-premium-outreach.ts
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

// Instagram handles discovered during deep research
const INSTAGRAM_HANDLES: Record<string, string> = {
  'TAJOS Barberos (Central)': '@tajosbarberos',
  'TAJOS Barberos (Superseis)': '@tajosbarberos',
  'Barberia H2O': '@barberiah2o',
  'Portas barber shop': '@portas_barbershop',
  'Urban Spa Acquadolce': '@acquadolcespa',
  'Overfit Gym': '@overfitgym',
  'Medina Fitness': '@medinafitness_gym',
  'Gym Victor Niella': '@gimnasiovictorniella',
  'Teranu': '@teranuspa',
  'Barber club py': '@thebarberclubpy',
  'Lyon Gym': '@lyongympy',
  'RENUVA - Clínica estética y laser': '@clinica.renuva',
  'Bonita Depilaciones': '@bonitadepilaciones',
  'Leticia Carballo Makeup & Store': '@lcmakeuphaircolor',
  'HidroBaby | Babyspa | Spa de bebés | Hidroestimulación': '@aguadulcebebes',
}

// Known facts from research
const LEAD_NOTES: Record<string, string[]> = {
  'TAJOS Barberos (Central)': ['3 sucursales en Asunción', 'Marca muy fuerte', 'Público joven y moderno'],
  'Barberia H2O': ['Frente a la UNA (universidad)', 'Clientela joven y estudiantil', 'Cortes clásicos + afeitado con toalla caliente'],
  'Portas barber shop': ['Se mudaron de local recientemente (inversión)', 'También tienen 0991 983 113', 'Cortes + barba + cejas + limpieza facial'],
  'Urban Spa Acquadolce': ['58.000 seguidores en Facebook', 'Solo mujeres', 'Precios desde Gs 80.000'],
  'Overfit Gym': ['Capiatá (zona en crecimiento)', 'Público familiar', 'Musculación + cardio'],
  'Medina Fitness': ['Dos sucursales (Norte + Sur)', '6.700 seguidores en Facebook', 'Transformaciones antes/después'],
  'Gym Victor Niella': ['27 años de trayectoria', 'Dueño: presidente de la Federación de Fisicoculturismo', 'Gs 20.000/día'],
  'Teranu': ['YA TIENE WEB (teranu.com.my)', 'Solo hombres', '15 años en el mercado'],
  'Barber club py': ['9 años (desde 2015)', '3.600 seguidores en Facebook', '100% de recomendaciones'],
  'Lyon Gym': ['Ubicación premium (Edificio Corporativo Farmazona)', 'Spinning, step, funcional', 'Trinidad (zona alta)'],
}

function phoneToDigits(phone: string): string {
  const clean = phone.replace(/[\s\-()+]/g, '')
  if (clean.startsWith('595')) return clean
  if (/^0/.test(clean)) return '595' + clean.slice(1)
  return '595' + clean
}

function waLink(phone: string, message: string): string {
  return `https://wa.me/${phoneToDigits(phone)}?text=${encodeURIComponent(message)}`
}

function typeEmoji(t: string): string {
  const map: Record<string, string> = { barberia: '💈', gimnasio: '🏋️', spa: '🧖', peluqueria: '✂️', depilacion: '✨', maquillaje: '💄', estetica: '💅' }
  return map[t] || '🏪'
}

interface LeadOutreach {
  id: string
  business_name: string
  business_type: string
  city: string
  phone: string
  rating: number
  review_count: number
  instagram: string
  preview_url: string
  notes: string[]
  messages: {
    initial: { body: string; wa_link: string }
    demo_ready: { body: string; wa_link: string }
    follow_up_3d: { body: string; wa_link: string }
    follow_up_7d: { body: string; wa_link: string }
    pricing: { body: string; wa_link: string }
  }
  priority: number
}

async function main() {
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'demo_ready')
    .not('preview_site_id', 'is', null)
    .order('review_count', { ascending: false })

  if (error) { console.error('Query failed:', error); process.exit(1) }

  console.log(`Generating premium outreach for ${leads.length} leads...\n`)

  const outreach: LeadOutreach[] = leads.map((lead) => {
    const bizName = (lead.business_name || '').trim()
    const bizType = (lead.business_type || 'peluqueria') as string
    const city = (lead.city || 'Asunción').trim()
    const slug = lead.preview_site_id || ''
    const previewUrl = slug ? `${BASE_URL}/s/es/${slug}` : `${BASE_URL}/demo`
    const phone = (lead.phone || '').trim()
    const rating = lead.rating || 0
    const reviews = lead.review_count || 0
    const emoji = typeEmoji(bizType)
    const ig = INSTAGRAM_HANDLES[bizName] || ''
    const notes = LEAD_NOTES[bizName] || []
    const addr = (lead.address || '').trim()

    // Priority scoring
    const priority = Math.min(100,
      (reviews >= 200 ? 40 : reviews >= 100 ? 32 : reviews >= 50 ? 25 : reviews >= 20 ? 18 : 10) +
      (rating >= 4.9 ? 30 : rating >= 4.7 ? 24 : rating >= 4.5 ? 18 : 10) +
      (city === 'Asunción' ? 20 : ['Fernando de la Mora','San Lorenzo','Lambaré','Luque','Capiatá'].includes(city) ? 14 : 8) +
      (bizType === 'barberia' ? 12 : bizType === 'gimnasio' ? 10 : bizType === 'spa' ? 8 : 5)
    )

    // --- Build custom hooks ---
    const socialHook = ig ? `Veo que están activos en Instagram (${ig}) con muy buena presencia, pero noté que no tienen página web todavía.` : 'Veo que tienen muy buena reputación en Google pero no tienen página web propia todavía.'

    const reviewHook = reviews >= 200 ? `¡${reviews} reseñas en Google con ${rating} estrellas!${reviews >= 500 ? ' Eso es impresionante.' : ' Eso es muchísimo.'}` : reviews >= 50 ? `Tienen ${reviews} reseñas y ${rating} estrellas en Google — muy buen puntaje.` : `Tienen ${rating} estrellas en Google${reviews > 0 ? ` con ${reviews} reseñas` : ''}.`

    const locationHook = addr ? `Están en ${addr.split(',')[0]}, ${city}.` : `Están en ${city}.`

    const notesHook = notes.length > 0 ? notes.slice(0, 2).join('. ') + '.' : ''

    const competitionHook = bizType === 'barberia' ? 'Cada vez más barberías están teniendo página web y eso las diferencia. Las que no tienen, pierden clientes que buscan online.'
      : bizType === 'gimnasio' ? 'Los gimnasios con web captan muchos más miembros. La gente busca horarios, precios y fotos antes de ir.'
      : bizType === 'spa' ? 'Un spa con página web transmite mucha más confianza. La gente investiga mucho antes de elegir dónde ir.'
      : bizType === 'depilacion' ? 'La depilación láser es un servicio que la gente investiga muchísimo antes de comprar. Una web con precios y tratamientos les da mucha ventaja.'
      : bizType === 'maquillaje' ? 'Una maquilladora con portafolio web queda mucho más profesional que solo con Instagram.'
      : 'Tener una página web profesional ayuda a que más clientes los encuentren y confíen en su negocio.'

    // ====== INITIAL OUTREACH ======
    const initial = `¡Hola ${bizName}! 👋

Soy Ian, de Paragu-AI ${emoji} — ayudamos a negocios paraguayos a tener su página web profesional.

${socialHook}

${reviewHook}

${competitionHook}

Les preparé un demo gratis para que vean cómo quedaría su sitio:

👉 ${previewUrl}

¿Qué opinan? ¿Les gusta? Sin compromiso alguno.

Saludos,
Ian — Paragu-AI 🇵🇾`

    // ====== DEMO READY (reply after they respond positively) ======
    const demo = `¡Qué bueno que les gustó! 🎉

Justamente, ese demo lo armamos con las secciones que cualquier ${bizType === 'barberia' ? 'barbería' : bizType === 'gimnasio' ? 'gimnasio' : bizType === 'spa' ? 'spa' : 'negocio como el suyo'} necesita:

✅ Servicios con precios
✅ Galería de trabajos
✅ Equipo profesional
✅ Testimonios de clientes
✅ WhatsApp directo
✅ Se ve perfecto en celular 📱

El siguiente paso es personalizarlo con SUS fotos, SUS colores y SUS textos. Queda tal cual la identidad de ${bizName}.

¿Les parece si agendamos una videollamada de 10 minutos esta semana? Les muestro cómo se edita y qué información necesitamos de su parte.

Saludos,
Ian — Paragu-AI 🇵🇾`

    // ====== FOLLOW-UP 3 DAYS (no reply after initial) ======
    const followUp3d = `¡Hola! 👋

Soy Ian, de Paragu-AI. Les escribí hace unos días sobre la página web para ${bizName}.

Les comparto el link del demo por si quieren verlo:

👉 ${previewUrl}

${ig ? `Por cierto, muy lindo lo que comparten en ${ig} 🔥` : ''}

${reviewHook}

Sin apuro, cuando quieran me avisan. Si prefieren, puedo enviarles un video de 2 min explicando cómo funciona todo.

Saludos,
Ian — Paragu-AI 🇵🇾`

    // ====== FOLLOW-UP 7 DAYS (final touch) ======
    const followUp7d = `¡Hola! 👋

Soy Ian, de Paragu-AI. La semana pasada les compartí un demo de página web para ${bizName}.

Entiendo que están con mucho trabajo (¡se nota por la cantidad de clientes que tienen! ${reviews >= 50 ? `${reviews} reseñas no se consiguen solas 💪` : ''}).

Les dejo el link por si más adelante quieren dar el paso:

👉 ${previewUrl}

Cuando quieran, acá estamos. ¡Mucho éxito con ${bizName}! 🚀

Saludos,
Ian — Paragu-AI 🇵🇾`

    // ====== PRICING (when they ask about price) ======
    const pricing = `¡Me alegra que pregunten! Los precios son bien accesibles:

🌟 PLAN BÁSICO — ₲290.000/mes
  Sitio web completo + hosting + dominio
  
🌟 PLAN PROFESIONAL — ₲590.000/mes
  Todo lo básico + blog + más secciones
  
🌟 PLAN PREMIUM — ₲990.000/mes
  Todo + ediciones ilimitadas + soporte prioritario + WhatsApp Business

Los 3 planes incluyen:
📱 Diseño responsive (se ve bien en celular)
🔍 Optimizado para Google
🇵🇾 Dominio .com.py
🛠️ Soporte permanente

El demo que vieron es de los que entran en el plan Básico. ¿Cuál creen que se ajusta más a ${bizName}?

Saludos,
Ian — Paragu-AI 🇵🇾`

    return {
      id: lead.id,
      business_name: bizName,
      business_type: bizType,
      city,
      phone,
      rating,
      review_count: reviews,
      instagram: ig,
      preview_url: previewUrl,
      notes,
      messages: {
        initial: { body: initial, wa_link: waLink(phone, initial) },
        demo_ready: { body: demo, wa_link: waLink(phone, demo) },
        follow_up_3d: { body: followUp3d, wa_link: waLink(phone, followUp3d) },
        follow_up_7d: { body: followUp7d, wa_link: waLink(phone, followUp7d) },
        pricing: { body: pricing, wa_link: waLink(phone, pricing) },
      },
      priority,
    }
  })

  outreach.sort((a, b) => b.priority - a.priority)

  const outputPath = path.join(ROOT, 'sites', 'premium-outreach.json')
  fs.writeFileSync(outputPath, JSON.stringify({
    generated_at: new Date().toISOString(),
    total: outreach.length,
    instructions: `Send initial outreach → wait 3 days → send follow_up_3d → wait 4 days → send follow_up_7d → if interested → send pricing`,
    leads: outreach,
  }, null, 2))

  // Print top 5 detail
  console.log('=== TOP 5 — FULL OUTREACH KIT ===\n')
  for (const l of outreach.slice(0, 5)) {
    console.log(`╔══════════════════════════════════════════════════`)
    console.log(`║ ${l.business_name}`)
    console.log(`║ ${l.business_type} · ${l.city} · ⭐${l.rating} · 🏆${l.review_count} reviews · Prioridad: ${l.priority}`)
    console.log(`║ 📞 ${l.phone} ${l.instagram ? '· IG: ' + l.instagram : ''}`)
    if (l.notes.length) console.log(`║ ℹ️ ${l.notes.join(' | ')}`)
    console.log(`║ 🔗 ${l.preview_url}`)
    console.log(`╠══ MESSAGE 1 — INITIAL OUTREACH ═══`)
    console.log(l.messages.initial.body)
    console.log(`╠══ LINK: ${l.messages.initial.wa_link}`)
    console.log(`╚══════════════════════════════════════════════════\n`)
  }

  // Priority distribution
  const dist: Record<string, number> = {}
  outreach.forEach(l => {
    const b = l.priority >= 80 ? '🔥 80-100' : l.priority >= 60 ? '✅ 60-79' : l.priority >= 40 ? '📋 40-59' : '🔄 <40'
    dist[b] = (dist[b] || 0) + 1
  })
  console.log(`\n=== PRIORITY DISTRIBUTION ===`)
  Object.entries(dist).sort().forEach(([b, c]) => console.log(`  ${b}: ${c} leads`))

  console.log(`\n=== OUTPUT ===`)
  console.log(`📄 ${outputPath}`)
  console.log(`✅ Done — ${outreach.length} leads ready for outreach`)
}

main().catch(console.error)
