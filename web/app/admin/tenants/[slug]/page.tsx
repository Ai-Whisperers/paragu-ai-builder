/**
 * Admin: Tenant detail
 *
 * Per-tenant control panel. Shows business info, current subscription /
 * grace status, recent analytics events, recent outreach events, and a
 * notes log. Note-add posts to /api/admin/tenants/[slug]/notes.
 *
 * Auth: presence of an authenticated session (middleware blocks anon).
 * TODO: gate by profiles.role='admin' once that table is introduced.
 */
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { TenantNoteForm } from './tenant-note-form'

export const runtime = 'nodejs'

type Params = { slug: string }

export const metadata = {
  title: 'Admin · Tenant | ParaguAI',
}

type Business = {
  id: string
  slug: string
  name: string
  type: string
  city: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  instagram: string | null
  status: string
  data_json: Record<string, unknown> | null
  created_at: string
}

type Subscription = {
  id: string
  plan_tier: string
  plan_name: string
  status: string
  trial_ends_at: string | null
  current_period_start: string
  current_period_end: string
}

type AnalyticsEvent = {
  id: string
  event_type: string
  metadata: Record<string, unknown> | null
  created_at: string
}

type OutreachEvent = {
  id: string
  event_type: string
  channel: string | null
  message_template: string | null
  created_at: string
}

type Note = {
  id: string
  body: string
  pinned: boolean
  created_at: string
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-PY', {
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
  if (min < 60) return `hace ${Math.max(1, min)} min`
  const hr = Math.round(min / 60)
  if (hr < 24) return `hace ${hr} h`
  const day = Math.round(hr / 24)
  return `hace ${day} d`
}

export default async function TenantDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=unauthorized')

  const { data: biz, error } = await supabase
    .from('businesses')
    .select('id, slug, name, type, city, phone, whatsapp, email, instagram, status, data_json, created_at')
    .eq('slug', slug)
    .single()

  if (error || !biz) {
    logger.warn('admin.tenant.not_found', { slug, error: error?.message })
    notFound()
  }
  const business = biz as Business

  // Parallel fetch the rest.
  const [subRes, eventsRes, outreachRes, notesRes] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('id, plan_tier, plan_name, status, trial_ends_at, current_period_start, current_period_end')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('analytics_events')
      .select('id, event_type, metadata, created_at')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('outreach_events')
      .select('id, event_type, channel, message_template, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('tenant_notes')
      .select('id, body, pinned, created_at')
      .eq('business_id', business.id)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false }),
  ])

  const sub = subRes.data as Subscription | null
  const events = (eventsRes.data ?? []) as AnalyticsEvent[]
  const outreach = (outreachRes.data ?? []) as OutreachEvent[]
  const notes = (notesRes.data ?? []) as Note[]

  const data = business.data_json ?? {}
  const whatsappGroupUrl = (data as Record<string, unknown>).whatsapp_group_url as string | undefined

  // Date.now() is fine in a Server Component — re-renders per request.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now()
  const graceEnd = sub?.trial_ends_at
  const inGrace = graceEnd ? new Date(graceEnd).getTime() > nowMs : false
  const daysLeft = graceEnd
    ? Math.max(0, Math.ceil((new Date(graceEnd).getTime() - nowMs) / 86_400_000))
    : null

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link href="/admin/tenants" className="text-sm text-gray-500 hover:underline">
            ← Tenants
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
              <p className="text-sm text-gray-500">
                <code>{business.slug}</code> · {business.type} · {business.city ?? 'sin ciudad'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/${business.slug}`}
                target="_blank"
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Ver sitio público
              </Link>
              {whatsappGroupUrl && (
                <a
                  href={whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Abrir grupo WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-6 md:grid-cols-3">
        {/* Left: contact + subscription */}
        <aside className="space-y-4 md:col-span-1">
          <Card title="Suscripción">
            {sub ? (
              <div className="space-y-1.5 text-sm">
                <Field label="Plan">{sub.plan_name} ({sub.plan_tier})</Field>
                <Field label="Status">{sub.status}</Field>
                <Field label="Grace ends">
                  {graceEnd ? (
                    <span className={inGrace ? 'font-bold text-green-700' : 'text-gray-500'}>
                      {fmtDateTime(graceEnd)} {inGrace && `(${daysLeft}d restantes)`}
                    </span>
                  ) : (
                    '—'
                  )}
                </Field>
                <Field label="Period end">{fmtDateTime(sub.current_period_end)}</Field>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Sin suscripción registrada en <code>subscriptions</code>.
              </div>
            )}
          </Card>

          <Card title="Contacto">
            <div className="space-y-1.5 text-sm">
              {business.whatsapp && (
                <Field label="WhatsApp">
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    {business.whatsapp}
                  </a>
                </Field>
              )}
              {business.phone && <Field label="Teléfono">{business.phone}</Field>}
              {business.email && <Field label="Email">{business.email}</Field>}
              {business.instagram && (
                <Field label="Instagram">
                  <a
                    href={`https://instagram.com/${business.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    {business.instagram}
                  </a>
                </Field>
              )}
              {!whatsappGroupUrl && (
                <p className="mt-3 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800">
                  Falta link al grupo de WhatsApp. Agregalo a{' '}
                  <code>businesses.data_json.whatsapp_group_url</code> en Supabase.
                </p>
              )}
            </div>
          </Card>
        </aside>

        {/* Right: notes + activity */}
        <section className="space-y-4 md:col-span-2">
          <Card title={`Notas (${notes.length})`}>
            <TenantNoteForm slug={business.slug} />
            <ul className="mt-4 space-y-3">
              {notes.length === 0 && (
                <li className="text-sm text-gray-500">Sin notas todavía.</li>
              )}
              {notes.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-md border p-3 text-sm ${
                    n.pinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-gray-800">{n.body}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {ago(n.created_at)} · {fmtDateTime(n.created_at)}
                    {n.pinned && ' · 📌 fijada'}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={`Eventos analytics (${events.length} de últimos 20)`}>
            {events.length === 0 ? (
              <div className="text-sm text-gray-500">Sin eventos para este tenant.</div>
            ) : (
              <ul className="space-y-2 text-sm">
                {events.map((e) => (
                  <li key={e.id} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <span className="font-mono text-xs font-medium">{e.event_type}</span>
                      {e.metadata && Object.keys(e.metadata).length > 0 && (
                        <pre className="mt-1 max-w-md overflow-x-auto rounded bg-gray-50 p-2 text-xs text-gray-700">
                          {JSON.stringify(e.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-gray-500">{ago(e.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Outreach (todos los tenants, últimos 20)">
            {outreach.length === 0 ? (
              <div className="text-sm text-gray-500">
                <code>outreach_events</code> está vacío. Esta tabla se llena cuando enviás un
                mensaje desde el CRM <Link href="/admin/leads" className="text-blue-700 hover:underline">/admin/leads</Link>.
              </div>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {outreach.map((o) => (
                  <li key={o.id} className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs">{o.event_type}</span>
                      {o.channel && <span className="ml-2 text-xs text-gray-500">· {o.channel}</span>}
                    </div>
                    <span className="text-xs text-gray-500">{ago(o.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </main>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs uppercase tracking-wider text-gray-500">{label}</span>
      <span className="text-right text-gray-900">{children}</span>
    </div>
  )
}
