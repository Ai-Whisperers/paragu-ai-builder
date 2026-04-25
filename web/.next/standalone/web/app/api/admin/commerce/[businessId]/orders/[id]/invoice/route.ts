import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { recordOrderEvent } from '@/lib/commerce/order-events'

export const runtime = 'nodejs'

// Manual "Emitir factura" flow. Pre-SET/Timbrado — the admin types in
// the invoice number + legal name + RUC + concept; the data model is
// populated so the shopper's /orden/[id]/recibo page flips from
// "recibo provisional" to "Factura". Once Batch L (SET integration)
// ships, this same endpoint will be replaced by the webhook from
// Facture / Arandú that populates the same fields automatically.
const BodySchema = z.object({
  invoiceNumber: z.string().trim().min(1).max(40),
  legalName: z.string().trim().min(1).max(200),
  ruc: z.string().trim().max(20).optional(),
  concept: z.string().trim().max(500).optional(),
  pdfUrl: z.string().url().max(500).optional(),
})

export const POST = withRequestLog<{ businessId: string; id: string }>(
  async (req, { log }, { businessId, id }) => {
    const admin = await requireAdminUser()
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    let json: unknown
    try {
      json = await req.json()
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
    }
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: existing, error: fetchError } = await supabase
      .from('orders')
      .select('id, invoice_number')
      .eq('id', id)
      .eq('business_id', businessId)
      .maybeSingle()
    if (fetchError || !existing) {
      return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
    }
    if (existing.invoice_number) {
      return NextResponse.json({ error: 'already_invoiced' }, { status: 409 })
    }

    const now = new Date().toISOString()
    const { error } = await supabase
      .from('orders')
      .update({
        invoice_number: parsed.data.invoiceNumber,
        invoice_issued_at: now,
        invoice_legal_name: parsed.data.legalName,
        invoice_ruc: parsed.data.ruc ?? null,
        invoice_concept: parsed.data.concept ?? null,
        invoice_pdf_url: parsed.data.pdfUrl ?? null,
      })
      .eq('id', id)
      .eq('business_id', businessId)
    if (error) {
      log.error('admin.commerce.invoice.update_failed', { orderId: id, error: error.message })
      return NextResponse.json({ error: 'update_failed' }, { status: 500 })
    }

    await recordOrderEvent({
      businessId,
      orderId: id,
      eventType: 'invoice_issued',
      actorId: admin.userId,
      actorLabel: admin.email ?? null,
      metadata: {
        invoiceNumber: parsed.data.invoiceNumber,
        legalName: parsed.data.legalName,
      },
    })

    log.info('admin.commerce.invoice.issued', { orderId: id, invoiceNumber: parsed.data.invoiceNumber })
    return NextResponse.json({ ok: true })
  },
)
