/**
 * Admin: Tenants index
 *
 * One row per business in `public.businesses`. Click into a row to see
 * subscription state, recent outreach + analytics events, notes, and the
 * WhatsApp group link for that tenant. Built per pricing v2 §C
 * (per-tenant WhatsApp group + admin tracking).
 */
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export const metadata = {
  title: 'Admin · Tenants | ParaguAI',
  description: 'Per-tenant overview with grace status and contact log.',
}

type Tenant = {
  id: string
  slug: string
  name: string
  type: string
  city: string | null
  status: string
  created_at: string
}

type Subscription = {
  business_id: string
  plan_tier: string
  status: string
  trial_ends_at: string | null
  current_period_end: string
}

function ago(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const d = Math.round(ms / 86_400_000)
  if (d === 0) return 'hoy'
  if (d === 1) return 'ayer'
  if (d < 30) return `hace ${d} d`
  const m = Math.round(d / 30)
  return `hace ${m} m`
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-PY', { year: 'numeric', month: 'short', day: '2-digit' })
}

export default async function TenantsIndexPage() {
  // Admin gate: env-allowlisted emails (see lib/auth/admin.ts and ADMIN_EMAILS).
  await requireAdmin()
  const supabase = await createClient()

  const { data: tenants, error } = await supabase
    .from('businesses')
    .select('id, slug, name, type, city, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('admin.tenants.list_failed', new Error(error.message))
  }

  const rows: Tenant[] = (tenants ?? []) as Tenant[]
  const ids = rows.map((r) => r.id)

  const { data: subs } = await supabase
    .from('subscriptions')
    .select('business_id, plan_tier, status, trial_ends_at, current_period_end')
    .in('business_id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])

  const subByBiz = new Map<string, Subscription>()
  for (const s of (subs ?? []) as Subscription[]) {
    if (!subByBiz.has(s.business_id)) subByBiz.set(s.business_id, s)
  }

  const activeCount = rows.filter((r) => r.status === 'active').length

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href="/admin" className="text-sm text-gray-500 hover:underline">
              ← Admin
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Tenants</h1>
            <p className="text-sm text-gray-500">
              Negocios en <code>public.businesses</code> con suscripción y notas.
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="rounded-lg border bg-white px-4 py-2 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500">Total</div>
              <div className="text-xl font-bold text-gray-900">{rows.length}</div>
            </div>
            <div className="rounded-lg border bg-white px-4 py-2 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500">Activos</div>
              <div className="text-xl font-bold text-gray-900">{activeCount}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {rows.length === 0 ? (
          <div className="rounded-lg border bg-white p-12 text-center text-gray-600">
            Aún no hay tenants en la base.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Ciudad</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Grace ends</th>
                  <th className="px-4 py-3">Alta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((t) => {
                  const sub = subByBiz.get(t.id)
                  const graceEnd = sub?.trial_ends_at
                  const inGrace = graceEnd ? new Date(graceEnd) > new Date() : false
                  return (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/tenants/${t.slug}`}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {t.name}
                        </Link>
                        <div className="text-xs text-gray-500">{t.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{t.type}</td>
                      <td className="px-4 py-3 text-gray-700">{t.city ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            t.status === 'active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sub ? (
                          <span className="text-xs">
                            <strong>{sub.plan_tier}</strong> · {sub.status}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {graceEnd ? (
                          <span
                            className={`text-xs ${inGrace ? 'font-bold text-green-700' : 'text-gray-500'}`}
                          >
                            {fmtDate(graceEnd)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{ago(t.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
