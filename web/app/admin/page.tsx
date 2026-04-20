import Link from 'next/link'
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
            <p className="text-xs uppercase tracking-wider text-gray-500">Tiendas</p>
            <p className="mt-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
              Commerce
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Pedidos, productos e inventario por tenant.
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
