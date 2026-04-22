import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { formatCents } from '@/lib/commerce/compute-totals'

export const runtime = 'nodejs'

// CSV export of orders for this business. Excel-friendly: BOM, semicolon
// delimiter (es-PY locale default), CRLF line endings. Capped at 5000
// rows — past that the admin should probably filter first.
const MAX_ROWS = 5000

function csvEscape(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (/[";\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

export const GET = withRequestLog<{ businessId: string }>(
  async (req, _ctx, { businessId }) => {
    const url = new URL(req.url)
    const query = (url.searchParams.get('q') ?? '').trim()
    const statusFilter = (url.searchParams.get('status') ?? '').trim()
    const admin = await requireAdminUser()
    if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const supabase = await createAdminClient()
    let q2 = supabase
      .from('orders')
      .select(
        'order_number, status, customer_name, customer_email, customer_phone, subtotal_cents, shipping_cents, discount_cents, total_cents, currency, shipping_address, notes, tracking_carrier, tracking_number, comprobante_sent_at, created_at, placed_at, paid_at, shipped_at, delivered_at',
      )
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(MAX_ROWS)
    if (statusFilter) q2 = q2.eq('status', statusFilter)
    if (query) {
      const escaped = query.replace(/[\\%_,]/g, (ch) => `\\${ch}`)
      q2 = q2.or(
        `order_number.ilike.*${escaped}*,customer_name.ilike.*${escaped}*,customer_email.ilike.*${escaped}*,customer_phone.ilike.*${escaped}*`,
      )
    }
    const { data } = await q2

    const rows = Array.isArray(data) ? data : []
    const header = [
      'Orden',
      'Estado',
      'Cliente',
      'Email',
      'Teléfono',
      'Subtotal',
      'Envío',
      'Descuento',
      'Total',
      'Moneda',
      'Dirección',
      'Ciudad',
      'Departamento',
      'Notas',
      'Transportista',
      '# Tracking',
      'Comprobante enviado',
      'Creada',
      'Confirmada (placed)',
      'Pagada',
      'Enviada',
      'Entregada',
    ]

    const lines: string[] = [header.map(csvEscape).join(';')]
    for (const r of rows) {
      const addr = (r.shipping_address as {
        line1?: string
        city?: string
        department?: string
      } | null) ?? null
      lines.push(
        [
          r.order_number,
          r.status,
          r.customer_name,
          r.customer_email,
          r.customer_phone,
          formatCents((r.subtotal_cents as number) ?? 0, (r.currency as string) ?? 'PYG'),
          formatCents((r.shipping_cents as number) ?? 0, (r.currency as string) ?? 'PYG'),
          formatCents((r.discount_cents as number) ?? 0, (r.currency as string) ?? 'PYG'),
          formatCents((r.total_cents as number) ?? 0, (r.currency as string) ?? 'PYG'),
          r.currency,
          addr?.line1 ?? '',
          addr?.city ?? '',
          addr?.department ?? '',
          r.notes,
          r.tracking_carrier,
          r.tracking_number,
          r.comprobante_sent_at,
          r.created_at,
          r.placed_at,
          r.paid_at,
          r.shipped_at,
          r.delivered_at,
        ]
          .map(csvEscape)
          .join(';'),
      )
    }

    // BOM prefix tells Excel the file is UTF-8, otherwise Spanish
    // accents render as mojibake.
    const body = '﻿' + lines.join('\r\n') + '\r\n'
    const filename = `ordenes-${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(body, {
      status: 200,
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="${filename}"`,
      },
    })
  },
)
