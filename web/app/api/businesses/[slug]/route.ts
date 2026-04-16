/**
 * Single Business CRUD API
 *
 * GET    /api/businesses/[slug]  - Load single business by slug
 * PUT    /api/businesses/[slug]  - Update business data
 * DELETE /api/businesses/[slug]  - Delete business
 *
 * Uses Supabase when configured, falls back to demo data for GET.
 */

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { loadBusiness } from '@/lib/engine/data-loader'

const LOG_PREFIX = '[API/businesses/slug]'

type RouteContext = { params: Promise<{ slug: string }> }

function isSupabaseConfigured(): boolean {
  try {
    const url = env.SUPABASE_URL
    return Boolean(url) && !url.includes('placeholder')
  } catch {
    return false
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug del negocio es requerido' },
        { status: 400 }
      )
    }

    // --- Supabase path ---
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error(`${LOG_PREFIX} Supabase query error for slug "${slug}":`, error)
        return NextResponse.json(
          { error: 'Negocio no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({ data })
    }

    // --- Demo fallback ---
    const business = await loadBusiness(slug)

    if (!business) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: business,
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

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug del negocio es requerido' },
        { status: 400 }
      )
    }

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

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud no puede estar vacío' },
        { status: 400 }
      )
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('businesses')
      .update(body)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error(`${LOG_PREFIX} Update error for slug "${slug}":`, error)
      return NextResponse.json(
        { error: 'Error al actualizar el negocio' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error(`${LOG_PREFIX} Unexpected error in PUT:`, error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug del negocio es requerido' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Base de datos no configurada' },
        { status: 503 }
      )
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error(`${LOG_PREFIX} Delete error for slug "${slug}":`, error)
      return NextResponse.json(
        { error: 'Error al eliminar el negocio' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Negocio eliminado correctamente' })
  } catch (error) {
    console.error(`${LOG_PREFIX} Unexpected error in DELETE:`, error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
