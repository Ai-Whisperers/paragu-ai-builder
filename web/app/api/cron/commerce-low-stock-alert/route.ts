import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { resolveAdminEmail } from '@/lib/commerce/notifications'

export const runtime = 'nodejs'

/**
 * Dedicated low-stock alert email — separate from the daily merchant
 * digest so tenants with no orders yesterday still get the stock alert.
 * Scheduled: 10:00 UTC (07:00 Asunción). Protected by CRON_SECRET.
 *
 * Fires at most once per tenant per day: checks last sent against the
 * outbox. This keeps a merchant with 20 low-stock SKUs from receiving
 * 20 emails when only one recently dropped under threshold.
 */
interface BusinessRow {
  id: string
  slug: string
  name: string
  data_json: unknown
}

interface LowStockProduct {
  id: string
  name: string
  sku: string | null
  inventory_qty: number
  low_stock_threshold: number | null
}

function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}

export const POST = withRequestLog(async (request, { log }) => {
  if (process.env.CRON_SECRET && request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createAdminClient()
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, slug, name, data_json')
    .eq('status', 'active')

  const tenants = (Array.isArray(businesses) ? businesses : []) as BusinessRow[]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://paragu-ai.com'
  const sinceYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  let tenantsChecked = 0
  let alertsEnqueued = 0
  let skippedRateLimited = 0

  for (const t of tenants) {
    tenantsChecked++
    const adminEmail = resolveAdminEmail(t.data_json)
    if (!adminEmail) continue

    // Rate limit: at most one low-stock email per tenant per 24h.
    const { count: recentCount } = await supabase
      .from('commerce_email_outbox')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', t.id)
      .eq('template', 'low_stock_digest')
      .gte('created_at', sinceYesterday)
    if ((recentCount ?? 0) > 0) {
      skippedRateLimited++
      continue
    }

    const { data: products } = await supabase
      .from('products')
      .select('id, name, sku, inventory_qty, low_stock_threshold')
      .eq('business_id', t.id)
      .eq('status', 'active')
      .eq('inventory_policy', 'deny')
      .lte('inventory_qty', 10)
      .order('inventory_qty', { ascending: true })
      .limit(50)

    const low = ((products as LowStockProduct[] | null) ?? []).filter(
      (p) => p.inventory_qty <= (p.low_stock_threshold ?? 3),
    )
    if (low.length === 0) continue

    const outOfStock = low.filter((p) => p.inventory_qty === 0)
    const nearOut = low.filter((p) => p.inventory_qty > 0)

    const productsUrl = `${appUrl}/admin/commerce/${t.id}/products`
    const renderList = (label: string, rows: LowStockProduct[], color: string): string => {
      if (rows.length === 0) return ''
      const items = rows
        .map(
          (p) =>
            `<li style="margin:4px 0;">${escape(p.name)}${p.sku ? ` <span style="color:#9ca3af;font-size:11px;">(${escape(p.sku)})</span>` : ''} — <strong>${p.inventory_qty}</strong> ${p.inventory_qty === 1 ? 'unidad' : 'unidades'}</li>`,
        )
        .join('')
      return `<h3 style="font-size:14px;margin:16px 0 4px 0;color:${color};">${label} <span style="color:#6b7280;font-weight:400;">(${rows.length})</span></h3><ul style="padding-left:20px;margin:0;">${items}</ul>`
    }

    const subject = `⚠️ Stock bajo ${t.name} — ${low.length} ${low.length === 1 ? 'producto' : 'productos'}`
    const html = `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 8px 0;">Alerta de stock</h1>
  <p style="color:#6b7280;margin:0 0 16px 0;">${t.name} · ${new Date().toLocaleDateString('es-PY')}</p>
  ${renderList('Sin stock', outOfStock, '#b91c1c')}
  ${renderList('Quedan pocas unidades', nearOut, '#b45309')}
  <p style="margin:16px 0;"><a href="${productsUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Actualizar inventario →</a></p>
  <p style="color:#9ca3af;font-size:11px;margin-top:24px;">Paragu-AI · alerta automática</p>
</body></html>`.trim()

    const { error } = await supabase.from('commerce_email_outbox').insert({
      business_id: t.id,
      order_id: null,
      template: 'low_stock_digest',
      recipient_email: adminEmail,
      subject,
      html_body: html,
    })
    if (error) {
      log.warn('commerce.low_stock_alert.enqueue_failed', { tenantId: t.id, error: error.message })
    } else {
      alertsEnqueued++
    }
  }

  log.info('commerce.cron.low_stock.done', { tenantsChecked, alertsEnqueued, skippedRateLimited })
  return NextResponse.json({ tenantsChecked, alertsEnqueued, skippedRateLimited })
})

export const GET = POST
