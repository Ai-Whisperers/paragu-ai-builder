/**
 * Business List + Create API
 *
 * GET  /api/businesses  - List all businesses (admin only)
 * POST /api/businesses  - Create a new business
 *
 * Uses Supabase when configured, falls back to demo data for GET.
 */

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { loadAllBusinesses } from '@/lib/engine/data-loader'

const LOG_PREFIX = '[API/businesses]'

function isSupabaseConfigured(): boolean {
  try {
    const url = env.SUPABASE_URL
    return Boolean(url) && !url.includes('placeholder')
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    // --- Supabase path ---
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error(`${LOG_PREFIX} Supabase query error:`, error)
        return NextResponse.json(
          { error: 'Error al obtener negocios' },
          { status: 500 }
        )
      }

      return NextResponse.json({ data })
    }

    // --- Demo fallback ---
    const businesses = await loadAllBusinesses()
    return NextResponse.json({
      data: businesses,
      _source: 'demo',
    })
  } catch (error) {
    console.error(`${LOG_PREFIX} Unexpected error in GET:`, error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Base de datos no configurada' },
        { status: 503 }
      )
    }

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

    // Validate required fields
    const { name, slug, type, city } = body as {
      name?: string
      slug?: string
      type?: string
      city?: string
    }

    if (!name || !slug || !type || !city) {
      return NextResponse.json(
        {
          error: 'Campos requeridos faltantes: name, slug, type, city',
        },
        { status: 400 }
      )
    }

    // Insert via Supabase
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        name,
        slug,
        type,
        city,
        ...body,
      })
      .select()
      .single()

    if (error) {
      console.error(`${LOG_PREFIX} Insert error:`, error)
      return NextResponse.json(
        { error: 'Error al crear el negocio' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error(`${LOG_PREFIX} Unexpected error in POST:`, error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
