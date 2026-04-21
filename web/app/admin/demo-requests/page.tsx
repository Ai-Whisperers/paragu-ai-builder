/**
 * Admin: Demo Requests
 *
 * Surfaces leads captured from the public `/demo` qualifier flow. These come
 * in as `lead_created` events on `analytics_events` with metadata.source =
 * 'demo_qualifier'. Distinct from /admin/leads (outbound prospect CRM).
 *
 * Server component: fetches the most recent 200 events server-side and
 * renders a sortable table. No client-side state — refresh to see new ones.
 */
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { TEMPLATES } from '@/lib/landing/marketing-data'

export const runtime = 'nodejs'

export const metadata = {
  title: 'Admin · Demo Requests | ParaguAI',
  description: 'Inbound leads from the /demo qualifier flow.',
}

const RUBRO_LABEL: Record<string, string> = Object.fromEntries(TEMPLATES.map((t) => [t.id, t.name]))

const SIZE_LABEL: Record<string, string> = {
  solo: 'Solo (1)',
  small: '2-5',
  medium: '6-15',
  large: '15+',
}

const PRESENCE_LABEL: Record<string, string> = {
  none: 'Solo IG/WA',
  facebook: 'Facebook',
  'old-site': 'Sitio viejo',
  'new-site': 'Rediseño',
}

type DemoLead = {
  id: string
  lead_id: string | null
  created_at: string
  metadata: {
    rubro?: string
    size?: string
    presence?: string
    stage?: string
    source?: string
  } | null
  referrer: string | null
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('es-PY', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ago(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const min = Math.round(ms / 60_000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const hr = Math.round(min / 60)
  if (hr < 24) return `hace ${hr} h`
  const day = Math.round(hr / 24)
  return `hace ${day} d`
}

export default async function DemoRequestsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('id, lead_id, created_at, metadata, referrer')
    .eq('event_type', 'lead_created')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows: DemoLead[] = (events ?? []).filter((e: DemoLead) => e.metadata?.source === 'demo_qualifier')

  // Aggregate counts for the header. Date.now() is fine here — Server
  // Component re-renders per request, so "now" advances with each load.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now()
  const today = new Date(nowMs)
  today.setHours(0, 0, 0, 0)
  const todayCount = rows.filter((r) => new Date(r.created_at) >= today).length
  const last7d = nowMs - 7 * 86_400_000
  const last7Count = rows.filter((r) => new Date(r.created_at).getTime() >= last7d).length

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Demo Requests</h1>
            <p className="text-sm text-gray-500">
              Leads inbound del qualifier de <Link href="/demo" className="underline">/demo</Link>
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <Stat label="Hoy" value={todayCount} />
            <Stat label="7 días" value={last7Count} />
            <Stat label="Total (200 max)" value={rows.length} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Error al cargar eventos: {error.message}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="rounded-lg border bg-white p-12 text-center">
            <p className="text-gray-600">
              Aún no hay demo requests. Cuando alguien complete el qualifier en{' '}
              <Link href="/demo" className="text-blue-600 underline">
                /demo
              </Link>
              , aparecerá acá.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Cuándo</th>
                  <th className="px-4 py-3">Rubro</th>
                  <th className="px-4 py-3">Equipo</th>
                  <th className="px-4 py-3">Presencia actual</th>
                  <th className="px-4 py-3">Origen</th>
                  <th className="px-4 py-3">Lead ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{ago(r.created_at)}</div>
                      <div className="text-xs text-gray-500">{fmtDate(r.created_at)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {RUBRO_LABEL[r.metadata?.rubro ?? ''] ?? r.metadata?.rubro ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {SIZE_LABEL[r.metadata?.size ?? ''] ?? r.metadata?.size ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {PRESENCE_LABEL[r.metadata?.presence ?? ''] ?? r.metadata?.presence ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {r.referrer ? new URL(r.referrer).pathname : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {r.lead_id?.slice(0, 8) ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500">
          Los datos vienen de <code>analytics_events</code> (event_type = lead_created, source =
          demo_qualifier). Refrescá para ver nuevos.
        </p>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-white px-4 py-2 text-center">
      <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  )
}
