/**
 * Lead Import API (Admin Only)
 *
 * POST /api/leads/import - Bulk import leads as businesses
 *
 * Accepts either:
 *   - JSON body with { leads: [...] } array
 *   - CSV text in body with { csv: "name,type,city,phone\n..." }
 *
 * Each lead must have: name, type, city, phone
 * Leads are inserted into the businesses table.
 */

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

const LOG_PREFIX = '[API/leads/import]'

interface LeadRecord {
  name: string
  type: string
  city: string
  phone: string
  slug?: string
  address?: string
  neighborhood?: string
  email?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  [key: string]: unknown
}

function isSupabaseConfigured(): boolean {
  try {
    const url = env.SUPABASE_URL
    return Boolean(url) && !url.includes('placeholder')
  } catch {
    return false
  }
}

/**
 * Generate a URL-safe slug from a business name and city.
 */
function generateSlug(name: string, city: string): string {
  const base = `${name}-${city}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base
}

/**
 * Parse CSV text into an array of lead records.
 * Expects the first line to be headers.
 */
function parseCsv(csv: string): LeadRecord[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) {
    return []
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
  const records: LeadRecord[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim())
    const record: Record<string, string> = {}

    for (let j = 0; j < headers.length; j++) {
      if (headers[j] && values[j]) {
        record[headers[j]] = values[j]
      }
    }

    records.push(record as unknown as LeadRecord)
  }

  return records
}

/**
 * Validate a single lead record and return errors if any.
 */
function validateLead(
  lead: LeadRecord,
  index: number
): string | null {
  if (!lead.name || typeof lead.name !== 'string' || lead.name.trim().length === 0) {
    return `Fila ${index + 1}: el nombre es requerido`
  }
  if (!lead.type || typeof lead.type !== 'string' || lead.type.trim().length === 0) {
    return `Fila ${index + 1}: el tipo de negocio es requerido`
  }
  if (!lead.city || typeof lead.city !== 'string' || lead.city.trim().length === 0) {
    return `Fila ${index + 1}: la ciudad es requerida`
  }
  if (!lead.phone || typeof lead.phone !== 'string' || lead.phone.trim().length === 0) {
    return `Fila ${index + 1}: el teléfono es requerido`
  }
  return null
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

    // Determine input format: JSON array or CSV string
    let leads: LeadRecord[]

    if (Array.isArray(body.leads)) {
      leads = body.leads as LeadRecord[]
    } else if (typeof body.csv === 'string') {
      leads = parseCsv(body.csv)
    } else {
      return NextResponse.json(
        {
          error:
            'Formato no válido. Envíe { "leads": [...] } o { "csv": "..." }',
        },
        { status: 400 }
      )
    }

    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron registros para importar' },
        { status: 400 }
      )
    }

    // Validate all leads before inserting
    const validationErrors: string[] = []
    for (let i = 0; i < leads.length; i++) {
      const error = validateLead(leads[i], i)
      if (error) {
        validationErrors.push(error)
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Errores de validación',
          details: validationErrors,
        },
        { status: 400 }
      )
    }

    // Prepare records for insertion
    const records = leads.map((lead) => ({
      name: lead.name.trim(),
      slug: lead.slug?.trim() || generateSlug(lead.name, lead.city),
      type: lead.type.trim(),
      city: lead.city.trim(),
      phone: lead.phone.trim(),
      address: lead.address?.trim() ?? null,
      neighborhood: lead.neighborhood?.trim() ?? null,
      email: lead.email?.trim() ?? null,
      whatsapp: lead.whatsapp?.trim() ?? null,
      instagram: lead.instagram?.trim() ?? null,
      facebook: lead.facebook?.trim() ?? null,
    }))

    // Bulk insert via Supabase
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('businesses')
      .insert(records)
      .select('id, slug, name')

    if (error) {
      console.error(`${LOG_PREFIX} Bulk insert error:`, error)
      return NextResponse.json(
        { error: 'Error al importar los registros' },
        { status: 500 }
      )
    }

    console.info(
      `${LOG_PREFIX} Successfully imported ${data?.length ?? 0} leads`
    )

    return NextResponse.json(
      {
        message: `${data?.length ?? 0} registros importados correctamente`,
        imported: data?.length ?? 0,
        data,
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
