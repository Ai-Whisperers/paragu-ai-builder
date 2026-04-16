import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface LeadPayload {
  name: string
  email: string
  phone?: string
  country: string
  program: string
  objective?: string
  source?: string
  businessName: string
}

function validateLead(data: unknown): { valid: true; lead: LeadPayload } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid payload' }
  }

  const payload = data as Record<string, unknown>

  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    return { valid: false, error: 'Name is required (min 2 characters)' }
  }

  if (!payload.email || typeof payload.email !== 'string' || !payload.email.includes('@')) {
    return { valid: false, error: 'Valid email is required' }
  }

  if (!payload.country || typeof payload.country !== 'string') {
    return { valid: false, error: 'Country is required' }
  }

  if (!payload.program || typeof payload.program !== 'string') {
    return { valid: false, error: 'Program selection is required' }
  }

  if (!payload.businessName || typeof payload.businessName !== 'string') {
    return { valid: false, error: 'Business name is required' }
  }

  return {
    valid: true,
    lead: {
      name: (payload.name as string).trim(),
      email: (payload.email as string).trim().toLowerCase(),
      phone: payload.phone ? String(payload.phone).trim() : undefined,
      country: (payload.country as string).trim(),
      program: (payload.program as string).trim(),
      objective: payload.objective ? String(payload.objective).trim() : undefined,
      source: payload.source ? String(payload.source).trim() : undefined,
      businessName: (payload.businessName as string).trim(),
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = validateLead(body)

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const { lead } = result

    // Log the lead for now — in production, store in Supabase
    console.log('[API/leads] New lead received:', {
      name: lead.name,
      email: lead.email,
      country: lead.country,
      program: lead.program,
      business: lead.businessName,
      timestamp: new Date().toISOString(),
    })

    // TODO: Store in Supabase when configured
    // const supabase = await createClient()
    // const { error } = await supabase.from('leads').insert({
    //   name: lead.name,
    //   email: lead.email,
    //   phone: lead.phone,
    //   country: lead.country,
    //   program: lead.program,
    //   objective: lead.objective,
    //   source: lead.source,
    //   business_name: lead.businessName,
    // })

    return NextResponse.json({
      success: true,
      message: 'Lead received successfully',
    })
  } catch (error) {
    console.error('[API/leads] Error processing lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
