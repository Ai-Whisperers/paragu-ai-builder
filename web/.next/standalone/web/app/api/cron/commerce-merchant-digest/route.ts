import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { resolveAdminEmail } from '@/lib/commerce/notifications'
import { formatCents } from '@/lib/commerce/compute-totals'
import { getAppUrl } from '@/lib/env'

export const runtime = 'nodejs'

/**
 * Daily merchant digest — one email per commerce-enabled tenant with
 * yesterday's activity + current pending list. Scheduled: 11:00 UTC
 * (08:00 Asunción). Protected by CRON_SECRET header.
 *
 * Contents:
 *   - How many orders yesterday + revenue
 *   - Awaiting-payment with comprobante-sent (needs admin verify)
 *   - Awaiting-payment stalled >48h
 *   - Paid but not yet shipped
 *   - Low-stock alerts
 */
interface BusinessRow {
  id: string
  slug: string
  name: string
  data_json: unknown
}

interface OrderLite {
  id: string
  order_number: string
  status: string
  total_cents: number
  currency: string
  created_at: string
  comprobante_sent_at: string | null
}

interface ProductLowStock {
  id: string
  name: string
  inventory_qty: number
  low_stock_threshold: number | null
}

function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000)
}

export const POST = withRequestLog(async (request, { log }) => {
  if (process.env.CRON_SECRET && request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let supabase
try { supabase = await createAdminClient() } catch {
  return NextResponse.json({ ok: false, reason: 'env_not_configured' }, { status: 200 })
}
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, slug, name, data_json')
    .eq('status', 'active')

  const tenants = (Array.isArray(businesses) ? businesses : []) as BusinessRow[]
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString()
  const yesterdayEnd = new Date(new Date(yesterdayStart).getTime() + 86_400_000).toISOString()
  const stalledCutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()

  let tenantsChecked = 0
  let digestsEnqueued = 0
  let skippedNoOrders = 0

  for (const t of tenants) {
    tenantsChecked++
    const adminEmail = resolveAdminEmail(t.data_json)
    if (!adminEmail) continue

    const [yday, awaitingSent, stalledAwaiting, pendingShip, lowStock] = await Promise.all([
      supabase
        .from('orders')
        .select('id, order_number, status, total_cents, currency, created_at, comprobante_sent_at')
        .eq('business_id', t.id)
        .gte('created_at', yesterdayStart)
        .lt('created_at', yesterdayEnd),
      supabase
        .from('orders')
        .select('id, order_number, status, total_cents, currency, created_at, comprobante_sent_at')
        .eq('business_id', t.id)
        .eq('status', 'awaiting_payment')
        .not('comprobante_sent_at', 'is', null)
        .order('comprobante_sent_at', { ascending: true })
        .limit(20),
      supabase
        .from('orders')
        .select('id, order_number, status, total_cents, currency, created_at, comprobante_sent_at')
        .eq('business_id', t.id)
        .eq('status', 'awaiting_payment')
        .lt('created_at', stalledCutoff)
        .limit(20),
      supabase
        .from('orders')
        .select('id, order_number, status, total_cents, currency, created_at, comprobante_sent_at')
        .eq('business_id', t.id)
        .in('status', ['paid', 'fulfilled'])
        .order('created_at', { ascending: true })
        .limit(20),
      supabase
        .from('products')
        .select('id, name, inventory_qty, low_stock_threshold')
        .eq('business_id', t.id)
        .eq('status', 'active')
        .eq('inventory_policy', 'deny')
        .lt('inventory_qty', 10)
        .limit(20),
    ])

    const ydayOrders = (yday.data as OrderLite[] | null) ?? []
    const awaitingSentRows = (awaitingSent.data as OrderLite[] | null) ?? []
    const stalledRows = (stalledAwaiting.data as OrderLite[] | null) ?? []
    const pendingShipRows = (pendingShip.data as OrderLite[] | null) ?? []
    const lowStockRows = ((lowStock.data as ProductLowStock[] | null) ?? []).filter(
      (p) => p.inventory_qty <= (p.low_stock_threshold ?? 3),
    )

    // Skip the email if nothing happened + no pending state — the merchant
    // doesn't need a "zero activity" email every day.
    const hasActionable =
      ydayOrders.length > 0 ||
      awaitingSentRows.length > 0 ||
      stalledRows.length > 0 ||
      pendingShipRows.length > 0 ||
      lowStockRows.length > 0
    if (!hasActionable) {
      skippedNoOrders++
      continue
    }

    const ydayRevenue = ydayOrders.reduce(
      (sum, o) => (o.status !== 'cancelled' && o.status !== 'refunded' ? sum + o.total_cents : sum),
      0,
    )
    const currency = ydayOrders[0]?.currency ?? 'PYG'

    const renderList = (label: string, rows: OrderLite[]): string => {
      if (rows.length === 0) return ''
      const items = rows
        .map(
          (o) =>
            `<li style="margin:4px 0;"><a href="${getAppUrl()}/admin/commerce/${t.id}/orders/${o.id}" style="color:#111;">${o.order_number}</a> — ${formatCents(o.total_cents, o.currency)} · ${daysBetween(new Date(o.created_at), now)}d</li>`,
        )
        .join('')
      return `<h3 style="font-size:14px;margin:16px 0 4px 0;">${label} <span style="color:#6b7280;font-weight:400;">(${rows.length})</span></h3><ul style="padding-left:20px;margin:0;">${items}</ul>`
    }

    const lowStockBlock =
      lowStockRows.length > 0
        ? `<h3 style="font-size:14px;margin:16px 0 4px 0;">Stock bajo <span style="color:#6b7280;font-weight:400;">(${lowStockRows.length})</span></h3><ul style="padding-left:20px;margin:0;">${lowStockRows
            .map(
              (p) =>
                `<li style="margin:4px 0;">${escape(p.name)} — ${p.inventory_qty} ${p.inventory_qty === 1 ? 'unidad' : 'unidades'} restantes</li>`,
            )
            .join('')}</ul>`
        : ''

    const subject = `📊 Resumen diario ${t.name} — ${ydayOrders.length} ${ydayOrders.length === 1 ? 'orden' : 'órdenes'} ayer`
    const html = `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 8px 0;">Resumen del día</h1>
  <p style="color:#6b7280;margin:0 0 16px 0;">${t.name} · ${new Date(yesterdayStart).toLocaleDateString('es-PY')}</p>

  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:0 0 16px 0;">
    <p style="margin:0;font-size:13px;color:#6b7280;">Órdenes ayer</p>
    <p style="margin:4px 0 12px 0;font-size:24px;font-weight:700;">${ydayOrders.length}</p>
    <p style="margin:0;font-size:13px;color:#6b7280;">Facturado ayer</p>
    <p style="margin:4px 0 0 0;font-size:20px;font-weight:700;">${formatCents(ydayRevenue, currency)}</p>
  </div>

  ${renderList('Esperan tu verificación (comprobante enviado)', awaitingSentRows)}
  ${renderList('Pendientes >48h sin pagar', stalledRows)}
  ${renderList('Listas para enviar', pendingShipRows)}
  ${lowStockBlock}

  <p style="color:#9ca3af;font-size:11px;margin-top:24px;">Paragu-AI · digest automático diario</p>
</body></html>`.trim()

    const { error } = await supabase.from('commerce_email_outbox').insert({
      business_id: t.id,
      order_id: null,
      template: 'admin_daily_digest',
      recipient_email: adminEmail,
      subject,
      html_body: html,
    })
    if (error) {
      log.warn('commerce.digest.enqueue_failed', { tenantId: t.id, error: error.message })
    } else {
      digestsEnqueued++
    }
  }

  log.info('commerce.cron.digest.done', {
    tenantsChecked,
    digestsEnqueued,
    skippedNoOrders,
  })

  return NextResponse.json({ tenantsChecked, digestsEnqueued, skippedNoOrders })
})

export const GET = POST
