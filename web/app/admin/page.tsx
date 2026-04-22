import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { loadAllBusinesses } from '@/lib/engine/data-loader'
import { BUSINESS_TYPES } from '@/lib/types'

export const runtime = 'nodejs'

const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluqueria',
  salon_belleza: 'Salon de Belleza',
  gimnasio: 'Gimnasio',
  spa: 'Spa',
  unas: 'Unas',
  tatuajes: 'Tatuajes',
  barberia: 'Barberia',
  estetica: 'Estetica',
  maquillaje: 'Maquillaje',
  depilacion: 'Depilacion',
  pestanas: 'Pestanas y Cejas',
}

const STATUS_COLORS: Record<string, string> = {
  generated: 'bg-[var(--color-success-surface)] text-[var(--color-success)]',
  draft: 'bg-gray-100 text-gray-800',
  error: 'bg-[var(--color-error-surface)] text-[var(--color-error)]',
}

export default async function AdminDashboard() {
  const businesses = await loadAllBusinesses()

  // Live inbox counts for the tile badge. Best-effort — failures show 0
  // rather than blocking the dashboard render.
  let inboxNewCount = 0
  let inboxOverdueCount = 0
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('leads')
      .select('status, created_at, contacted_at')
      .in('status', ['new', 'contacted'])
      .limit(1000)
    const now = Date.now()
    for (const l of (data ?? []) as Array<{ status: string; created_at: string; contacted_at: string | null }>) {
      if (l.status === 'new') {
        inboxNewCount++
        const age = (now - new Date(l.created_at).getTime()) / 3_600_000
        if (age > 48) inboxOverdueCount++
      } else if (l.status === 'contacted' && l.contacted_at) {
        const age = (now - new Date(l.contacted_at).getTime()) / 3_600_000
        if (age > 144) inboxOverdueCount++
      }
    }
  } catch {
    // Silent — show zeros.
  }

  // Commerce tile counts — awaiting_payment + of-those-with-comprobante-sent
  // + low-stock products across ALL tenants. Best-effort; failures show 0.
  let commerceAwaitingCount = 0
  let commerceComprobanteSentCount = 0
  let commerceLowStockCount = 0
  try {
    const supabase = await createClient()
    const { data: orders } = await supabase
      .from('orders')
      .select('status, comprobante_sent_at')
      .eq('status', 'awaiting_payment')
      .limit(1000)
    const oRows = (orders ?? []) as Array<{ status: string; comprobante_sent_at: string | null }>
    commerceAwaitingCount = oRows.length
    commerceComprobanteSentCount = oRows.filter((o) => o.comprobante_sent_at).length
    const { data: products } = await supabase
      .from('products')
      .select('inventory_qty, low_stock_threshold, inventory_policy, status')
      .eq('inventory_policy', 'deny')
      .eq('status', 'active')
      .lte('inventory_qty', 10)
      .limit(500)
    commerceLowStockCount = ((products ?? []) as Array<{ inventory_qty: number; low_stock_threshold: number | null }>)
      .filter((p) => p.inventory_qty <= (p.low_stock_threshold ?? 3)).length
  } catch {
    // Silent.
  }

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
            <p className="mt-1 text-3xl font-bold text-[var(--color-success)]">{businesses.length}</p>
          </div>
        </div>

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
