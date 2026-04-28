import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { loadAllBusinesses } from '@/lib/engine/data-loader'
import { BUSINESS_TYPES } from '@/lib/types'

export const runtime = 'nodejs'

const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluqueria', salon_belleza: 'Salon de Belleza', gimnasio: 'Gimnasio',
  spa: 'Spa', unas: 'Unas', tatuajes: 'Tatuajes', barberia: 'Barberia',
  estetica: 'Estetica', maquillaje: 'Maquillaje', depilacion: 'Depilacion',
  pestanas: 'Pestanas y Cejas',
}

const STATUS_COLORS: Record<string, string> = {
  generated: 'bg-green-50 text-green-700', draft: 'bg-gray-100 text-gray-800',
  error: 'bg-red-50 text-red-700',
}

function fmt(gs: number): string {
  if (gs >= 1000000) return `Gs ${(gs / 1000000).toFixed(1)}M`
  if (gs >= 1000) return `Gs ${(gs / 1000).toFixed(0)}.${String(Math.floor((gs % 1000) / 100))}00`
  return `Gs ${gs}`
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const businesses = await loadAllBusinesses()

  let inboxNewCount = 0
  let inboxOverdueCount = 0
  let commerceAwaitingCount = 0
  let commerceComprobanteSentCount = 0
  let commerceLowStockCount = 0
  let leadFunnel: Record<string, number> = {}
  let totalRevenueCents = 0
  let activeSubs = 0
  let trialingSubs = 0
  let monthlyRecurringCents = 0

  try {
    const [leadsResult, ordersResult, productsResult, subsResult, paymentsResult] = await Promise.all([
      supabase.from('leads').select('status').limit(5000),
      supabase.from('orders').select('status, total_cents, comprobante_sent_at').in('status', ['awaiting_payment', 'paid', 'completed']).limit(5000),
      supabase.from('products').select('inventory_qty, low_stock_threshold, inventory_policy, status').eq('inventory_policy', 'deny').eq('status', 'active').lte('inventory_qty', 10).limit(500),
      supabase.from('subscriptions').select('plan_tier, status, price_monthly').limit(1000),
      supabase.from('payments').select('amount, status').eq('status', 'completed').limit(2000),
    ])

    const leads = (leadsResult.data ?? []) as Array<{ status: string }>
    for (const l of leads) {
      leadFunnel[l.status] = (leadFunnel[l.status] || 0) + 1
      if (l.status === 'new') { inboxNewCount++ }
    }

    const orders = (ordersResult.data ?? []) as Array<{ status: string; total_cents: number; comprobante_sent_at: string | null }>
    commerceAwaitingCount = orders.filter((o) => o.status === 'awaiting_payment').length
    commerceComprobanteSentCount = orders.filter((o) => o.comprobante_sent_at).length

    const subs = (subsResult.data ?? []) as Array<{ status: string; price_monthly: number }>
    for (const s of subs) {
      if (s.status === 'active') { activeSubs++; monthlyRecurringCents += s.price_monthly }
      if (s.status === 'trialing') trialingSubs++
    }

    const payments = (paymentsResult.data ?? []) as Array<{ amount: number }>
    totalRevenueCents = payments.reduce((sum, p) => sum + p.amount, 0)

    const products = (productsResult.data ?? []) as Array<{ inventory_qty: number; low_stock_threshold: number | null }>
    commerceLowStockCount = products.filter((p) => p.inventory_qty <= (p.low_stock_threshold ?? 3)).length

    const { data: newLeads } = await supabase.from('leads').select('status, created_at').in('status', ['new', 'contacted']).limit(1000)
    const now = Date.now()
    for (const l of (newLeads ?? []) as Array<{ status: string; created_at: string }>) {
      if (l.status === 'new') {
        const age = (now - new Date(l.created_at).getTime()) / 3_600_000
        if (age > 48) inboxOverdueCount++
      }
    }
  } catch {}

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Paragu-AI Builder</h1>
            <p className="text-sm text-gray-500">Panel de Administracion</p>
          </div>
          <div className="flex gap-2 text-sm text-gray-500">
            <span>{businesses.length} negocios</span>
            <span>|</span>
            <span>{BUSINESS_TYPES.length} tipos</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm font-medium text-gray-500">Negocios</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{businesses.length}</p>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm font-medium text-gray-500">Tipos Soportados</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{BUSINESS_TYPES.length}</p>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm font-medium text-gray-500">Sitios Generados</p>
            <p className="mt-1 text-3xl font-bold text-green-600">{businesses.length}</p>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm font-medium text-gray-500">Ingresos totales</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{fmt(totalRevenueCents)}</p>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm font-medium text-gray-500">MRR</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">{fmt(monthlyRecurringCents)}</p>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <p className="text-sm font-medium text-gray-500">Suscripciones</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{activeSubs}<span className="text-base font-normal text-gray-500 ml-1">activas</span></p>
            <p className="text-xs text-amber-600">{trialingSubs} en prueba</p>
          </div>
        </div>

        {/* Funnel */}
        {Object.keys(leadFunnel).length > 0 && (
          <div className="mb-8 rounded-xl border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead funnel</h3>
            <div className="flex flex-wrap gap-2">
              {['new', 'contacted', 'demo_ready', 'paying', 'disqualified'].map((stage) => {
                const count = leadFunnel[stage] || 0
                if (count === 0) return null
                const pct = businesses.length > 0 ? Math.round((count / businesses.length) * 100) : 0
                const colors: Record<string, string> = {
                  new: 'bg-blue-50 text-blue-700', contacted: 'bg-amber-50 text-amber-700',
                  demo_ready: 'bg-purple-50 text-purple-700', paying: 'bg-green-50 text-green-700',
                  disqualified: 'bg-gray-100 text-gray-600',
                }
                return (
                  <div key={stage} className={`rounded-lg px-4 py-2 text-sm ${colors[stage] || 'bg-gray-50'}`}>
                    <span className="font-semibold">{count}</span>
                    <span className="ml-1.5 text-xs opacity-75">{stage.replace(/_/g, ' ')}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick links to admin tools */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/leads"
            className="group rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">CRM</p>
            <p className="mt-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              Leads (outbound)
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Negocios prospectados, status y outreach.
            </p>
          </Link>
          <Link
            href="/admin/inbox"
            className="group rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs uppercase tracking-wider text-gray-500">Inbound</p>
              {inboxNewCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {inboxNewCount} new
                </span>
              )}
            </div>
            <p className="mt-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              Inbox
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Consultas entrantes (contact forms) — pipeline new → closed.
            </p>
            {inboxOverdueCount > 0 && (
              <p className="mt-2 text-xs font-medium text-red-600">
                {inboxOverdueCount} overdue — SLA breached
              </p>
            )}
          </Link>
          <Link
            href="/admin/demo-requests"
            className="group rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">Inbound</p>
            <p className="mt-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              Demo requests
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Leads del qualifier en /demo (analytics_events).
            </p>
          </Link>
          <Link
            href="/admin/commerce"
            className="group rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs uppercase tracking-wider text-gray-500">Tiendas</p>
              {commerceAwaitingCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                  {commerceAwaitingCount} esperando
                </span>
              )}
            </div>
            <p className="mt-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              Commerce
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Pedidos, productos e inventario por tenant.
            </p>
            {commerceComprobanteSentCount > 0 && (
              <p className="mt-2 text-xs font-medium text-green-700">
                {commerceComprobanteSentCount} con comprobante listo para verificar
              </p>
            )}
            {commerceLowStockCount > 0 && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {commerceLowStockCount} {commerceLowStockCount === 1 ? 'producto con stock bajo' : 'productos con stock bajo'}
              </p>
            )}
          </Link>
          <Link
            href="/admin/tenants"
            className="group rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">Tenants</p>
            <p className="mt-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              Negocios + grace status
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Suscripción, contacto, notas y eventos por tenant.
            </p>
          </Link>
          <Link
            href="/admin/audit"
            className="group rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">Diagnóstico</p>
            <p className="mt-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              Site Health Audit
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Verificación de sitios demo, 404s y salud general.
            </p>
          </Link>
        </div>

        {/* Business List */}
        <div className="rounded-lg border bg-white">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Negocios</h2>
          </div>
          <div className="divide-y">
            {businesses.map((biz) => (
              <div key={biz.slug} className="flex items-center justify-between px-6 py-4">
                <div>
                  <h3 className="font-medium text-gray-900">{biz.name}</h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {TYPE_LABELS[biz.type] || biz.type}
                    </span>
                    <span>{biz.city}{biz.neighborhood ? `, ${biz.neighborhood}` : ''}</span>
                    {biz.services && <span>{biz.services.length} servicios</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS.generated}`}>
                    Generado
                  </span>
                  <a
                    href={`/${biz.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Ver Sitio
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Types Overview */}
        <div className="mt-8 rounded-lg border bg-white">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Tipos de Negocio</h2>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            {BUSINESS_TYPES.map((type) => {
              const count = businesses.filter((b) => b.type === type).length
              return (
                <div key={type} className="rounded-lg border p-4">
                  <p className="font-medium text-gray-900">{TYPE_LABELS[type] || type}</p>
                  <p className="text-sm text-gray-500">{count} negocio{count !== 1 ? 's' : ''}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
