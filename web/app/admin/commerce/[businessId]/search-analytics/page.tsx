import Link from 'next/link'
import { listTopSearches } from '@/lib/commerce/search-events'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function SearchAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>
  searchParams: Promise<{ days?: string; zero?: string }>
}) {
  const { businessId } = await params
  const sp = await searchParams
  const windowDays = Math.min(365, Math.max(1, parseInt(sp.days ?? '30', 10) || 30))
  const zeroResultOnly = sp.zero === '1'

  const rows = await listTopSearches(businessId, { windowDays, zeroResultOnly, limit: 50 })
  const totalHits = rows.reduce((acc, r) => acc + r.hits, 0)
  const zeroHits = rows.reduce((acc, r) => acc + r.zeroResultHits, 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-muted,#6b7280)]">
        <Link href={`/admin/commerce/${businessId}/products`} className="hover:underline">
          Productos
        </Link>
        <Link href={`/admin/commerce/${businessId}/orders`} className="hover:underline">
          Pedidos
        </Link>
        <Link href={`/admin/commerce/${businessId}/discounts`} className="hover:underline">
          Descuentos
        </Link>
        <Link href={`/admin/commerce/${businessId}/shipping`} className="hover:underline">
          Envíos
        </Link>
        <Link href={`/admin/commerce/${businessId}/reconciliation`} className="hover:underline">
          Conciliación
        </Link>
        <Link href={`/admin/commerce/${businessId}/search-analytics`} className="font-semibold text-[color:var(--text,#111)] underline">
          Búsquedas
        </Link>
        <Link href={`/admin/commerce/${businessId}/reviews`} className="hover:underline">
          Reseñas
        </Link>
      </nav>

      <h1 className="mb-2 text-2xl font-bold">Analíticas de búsqueda</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Lo que tus visitantes están buscando en la tienda. Las búsquedas sin resultados son oportunidades de inventario.
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-3 text-sm">
        <span>Últimos</span>
        {[7, 14, 30, 60, 90].map((d) => (
          <Link
            key={d}
            href={`?days=${d}${zeroResultOnly ? '&zero=1' : ''}`}
            className={`rounded border px-2 py-0.5 text-xs ${
              d === windowDays
                ? 'border-[color:var(--primary,#111)] bg-[color:var(--primary,#111)] text-[color:var(--primary-foreground,#fff)]'
                : 'border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
            }`}
          >
            {d} días
          </Link>
        ))}
        <span className="ml-auto text-xs text-[color:var(--text-muted,#6b7280)]">
          {totalHits} búsquedas · {zeroHits} sin resultado
        </span>
      </div>

      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link
          href={`?days=${windowDays}`}
          className={`rounded-full border px-3 py-1 text-xs ${
            !zeroResultOnly
              ? 'border-[color:var(--primary,#111)] bg-[color:var(--primary,#111)] text-[color:var(--primary-foreground,#fff)]'
              : 'border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
          }`}
        >
          Todas
        </Link>
        <Link
          href={`?days=${windowDays}&zero=1`}
          className={`rounded-full border px-3 py-1 text-xs ${
            zeroResultOnly
              ? 'border-red-600 bg-red-600 text-white'
              : 'border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
          }`}
        >
          Solo sin resultados
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-12 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
          {zeroResultOnly
            ? 'No hay búsquedas sin resultado en este período. Bien.'
            : 'Todavía no tenemos datos de búsqueda. Volvé después de que los visitantes empiecen a buscar.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--surface-muted,#f9fafb)] text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Búsqueda</th>
                <th className="px-4 py-3 text-right font-semibold">Veces</th>
                <th className="px-4 py-3 text-right font-semibold">Resultados (prom.)</th>
                <th className="px-4 py-3 text-right font-semibold">Sin resultados</th>
                <th className="px-4 py-3 text-right font-semibold">Última</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const zeroDominates = r.zeroResultHits / Math.max(1, r.hits) >= 0.8
                return (
                  <tr key={r.queryNormalized} className="border-t border-[color:var(--border,#e5e7eb)]">
                    <td className="px-4 py-3">
                      <span className="font-medium">{r.sampleQuery}</span>
                      {zeroDominates ? (
                        <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-700">
                          gap
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{r.hits}</td>
                    <td className="px-4 py-3 text-right font-mono text-[color:var(--text-muted,#6b7280)]">
                      {r.avgResults}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {r.zeroResultHits > 0 ? (
                        <span className="text-red-700">{r.zeroResultHits}</span>
                      ) : (
                        <span className="text-[color:var(--text-muted,#9ca3af)]">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-[color:var(--text-muted,#6b7280)]">
                      {new Date(r.lastSeen).toLocaleDateString('es-PY')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
