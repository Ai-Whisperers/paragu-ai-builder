/**
 * Contact Form Submission API
 *
 * POST /api/contact - Receive and store contact form submissions
 *
 * Validates required fields, stores in Supabase when configured,
 * or logs the submission for demo purposes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

const LOG_PREFIX = '[API/contact]'

// TODO: Integrate Upstash rate limiting when UPSTASH_REDIS_REST_URL is configured
// import { Ratelimit } from '@upstash/ratelimit'
// import { Redis } from '@upstash/redis'
//
// const ratelimit = env.UPSTASH_REDIS_REST_URL
//   ? new Ratelimit({
//       redis: Redis.fromEnv(),
//       limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
//       analytics: true,
//     })
//   : null

interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  businessSlug: string
}

function isSupabaseConfigured(): boolean {
  try {
    const url = env.SUPABASE_URL
    return Boolean(url) && !url.includes('placeholder')
  } catch {
    return false
  }
}

function validateContactForm(
  body: Record<string, unknown>
): { valid: true; data: ContactFormData } | { valid: false; error: string } {
  const { name, email, message, businessSlug } = body as Record<string, string | undefined>

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'El nombre es requerido' }
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, error: 'El correo electrónico es requerido' }
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'El formato del correo electrónico es inválido' }
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'El mensaje es requerido' }
  }

  if (!businessSlug || typeof businessSlug !== 'string' || businessSlug.trim().length === 0) {
    return { valid: false, error: 'El identificador del negocio es requerido' }
  }

  return {
    valid: true,
    data: {
      name: name.trim(),
      email: email.trim(),
      phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
      message: message.trim(),
      businessSlug: businessSlug.trim(),
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Apply rate limiting here when Upstash is configured
    // if (ratelimit) {
    //   const ip = request.headers.get('x-forwarded-for') ?? request.ip ?? '127.0.0.1'
    //   const { success } = await ratelimit.limit(ip)
    //   if (!success) {
    //     return NextResponse.json(
    //       { error: 'Demasiadas solicitudes. Intente de nuevo en un momento.' },
    //       { status: 429 }
    //     )
    //   }
    // }

    // Parse body
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'JSON inválido en el cuerpo de la solicitud' },
        { status: 400 }
      )
    }

    // Validate fields
    const validation = validateContactForm(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { data: contactData } = validation

    // --- Supabase path ---
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

      // Resolve business_id from slug for proper foreign key relationship
      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', contactData.businessSlug)
        .single()

      if (bizError || !business) {
        console.error(`${LOG_PREFIX} Business lookup failed for slug "${contactData.businessSlug}":`, bizError)
        return NextResponse.json(
          { error: 'Negocio no encontrado' },
          { status: 404 }
        )
      }

      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert({
          business_id: business.id,
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone ?? null,
          message: contactData.message,
        })

      if (insertError) {
        console.error(`${LOG_PREFIX} Insert error:`, insertError)
        return NextResponse.json(
          { error: 'Error al guardar el mensaje' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { message: 'Mensaje enviado correctamente' },
        { status: 201 }
      )
    }

    // --- Demo fallback: log and return success ---
    console.info(
      `${LOG_PREFIX} [DEMO] Contact submission received:`,
      JSON.stringify({
        businessSlug: contactData.businessSlug,
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        messageLength: contactData.message.length,
      })
    )

    return NextResponse.json(
      {
        message: 'Mensaje enviado correctamente',
        _source: 'demo',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(`${LOG_PREFIX} Unexpected error in POST:`, error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
