import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mapLeadToPreviewConfig } from '@/lib/generation/from-lead'
import { sendWhatsApp } from '@/lib/portal/whatsapp-notify'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TOP5_IDS = [
  '1957a0c8-917c-43b9-9839-c1996245cf57', // Galilea Estetica — Asunción — ⭐5.0 — 395 reviews
  '01e8c321-c722-4203-b0a1-a1093e6d1efb', // Studio 22 Body Piercing & Tattoo — ⭐4.9 — 954 reviews
  '96e3a6dc-28c4-48d9-8e27-70a6091303c6', // HidroBaby Spa — Asunción — ⭐5.0 — 736 reviews
  '98362b30-70bf-4903-922a-eb9f988cc421', // Guillén Barbershop — Fdo de la Mora — ⭐4.8 — 301 reviews
  '8a513e78-ee6c-4f16-8aec-1b08b8a040ab', // Full Fitness Gym — Luque — ⭐4.7 — 197 reviews
]

const MESSAGES: Record<string, string> = {
  '1957a0c8-917c-43b9-9839-c1996245cf57': `Hola! 👋

Vemos que Galilea Estetica tiene 395 reseñas ⭐5.0 en Google — claramente hacen un trabajo excelente.

Pero notamos que NO TIENEN SITIO WEB. Hoy en día, cuando alguien busca centro de estética en Asunción y no encuentra su web, termina yendo a la competencia.

Les podemos armar un sitio web profesional en 48 HORAS con:
📱 Botón de WhatsApp directo
📅 Sistema de turnos online
📸 Galería de trabajos (antes/después)
💰 Precios y servicios visibles

Sin que toquen código. Sin permanencia.

Quieren que les mandemos una demo personalizada para que vean cómo quedaría?`,

  '01e8c321-c722-4203-b0a1-a1093e6d1efb': `Hola! 👋

Studio 22 tiene 954 reseñas ⭐4.9 — son unos cracks!

Pero para un estudio de tatuajes y piercing, NO TENER SITIO WEB es perder clientes todos los días. La gente quiere ver fotos de trabajos antes de confiar su piel a alguien.

Les podemos armar un sitio profesional en 48hs con:
📸 Galería de tatuajes por cada artista
📋 Precios y servicios
📱 Consultas de diseño por WhatsApp
📍 Ubicación en Google Maps

Sin que toquen código. Quieren ver una demo?`,

  '96e3a6dc-28c4-48d9-8e27-70a6091303c6': `Hola! 👋

HidroBaby Spa tiene 736 reseñas ⭐5.0 — rating perfecto!

Pero para un spa de bebés, NO TENER WEB es perder clientes que buscan "baby spa en Asunción" en Google.

Les armamos un sitio web profesional en 48hs con:
📅 Reserva de turnos online
📋 Paquetes y precios visibles
📱 Botón de WhatsApp
📍 Google Maps

Sin que toquen código. Sin permanencia. Quieren ver una demo?`,

  '98362b30-70bf-4903-922a-eb9f988cc421': `Hola! 👋

Guillén Barbershop tiene 301 reseñas ⭐4.8 — claramente son la mejor barbería de Fernando!

Pero sin sitio web, cuando alguien busca "barbería en Fernando de la Mora" no los encuentra.

Les podemos armar un sitio en 48hs con:
💈 Lista de precios actualizada
📅 Turnos online (sin tener que contestar WhatsApp)
📸 Galería de cortes y fades
📍 Ubicación

Quieren que les mostremos una demo personalizada?`,

  '8a513e78-ee6c-4f16-8aec-1b08b8a040ab': `Hola! 👋

Full Fitness Gym tiene 197 reseñas ⭐4.7 en Luque — son el gimnasio de referencia!

Pero sin sitio web, los potenciales socios no encuentran sus planes, horarios ni precios en Google.

Les armamos un sitio profesional en 48hs con:
💪 Planes de membresía y precios
📅 Horarios de clases
👨‍🏫 Perfiles de instructores
📱 Captación de leads por WhatsApp

Sin que toquen código. Quieren ver una demo?`
}

export async function POST() {
  try {
    const supabase = await createClient('service_role')
    const results: Array<{ name: string; slug?: string; demoUrl?: string; status: string }> = []

    for (const id of TOP5_IDS) {
      const { data: lead } = await supabase.from('leads').select('*').eq('id', id).single()

      if (!lead) {
        results.push({ name: 'unknown', status: 'lead_not_found' })
        continue
      }

      try {
        const config = mapLeadToPreviewConfig(lead as unknown as Record<string, unknown>)
        const slug = config.siteSlug

        const { data: existing } = await supabase
          .from('businesses')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()

        if (!existing) {
          await supabase.from('businesses').insert({
            slug,
            lead_id: id,
            name: config.schema.businessName,
            type: config.businessType,
            phone: config.schema.contact.phone || null,
            email: config.schema.contact.email || null,
            whatsapp: config.schema.contact.whatsapp || null,
            city: (config.schema.location as Record<string, string> | undefined)?.city || 'Asunción',
            status: 'active',
            is_demo: true,
            data_json: { tagline: `${config.schema.businessName} — Profesional`, services: config.schema.services || [] },
          })
        }

        const demoUrl = `https://paragu-ai.com/s/es/${slug}`
        const phone = lead.whatsapp || lead.phone || ''
        const cleanPhone = phone.replace(/[^0-9]/g, '')

        if (cleanPhone.length >= 10) {
          const waInstance = process.env.DEFAULT_WA_INSTANCE || 'paragu-ai'
          const message = MESSAGES[id] || `Hola! 👋 Te armamos una demo de tu sitio web. La podés ver acá: ${demoUrl}`
          try {
            await sendWhatsApp(waInstance, cleanPhone, message)
          } catch (err) {
            logger.warn('[outreach:top5] whatsapp send failed', { leadId: id, error: String(err) })
          }
        }

        await supabase.from('leads').update({ status: 'contacted' }).eq('id', id)

        results.push({ name: lead.business_name, slug, demoUrl, status: 'sent' })
        logger.info('[outreach:top5] sent', { leadId: id, name: lead.business_name, slug, phone: cleanPhone.slice(0, 4) + '...' })
      } catch (err) {
        results.push({ name: lead.business_name, status: `error: ${err instanceof Error ? err.message : String(err)}` })
      }
    }

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
