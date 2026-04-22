'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { InboxLead, InboxStats } from './page'

type Filters = { site?: string; status?: string; q?: string }

const STATUS_ORDER: InboxLead['status'][] = ['new', 'contacted', 'qualified', 'closed']
const STATUS_LABELS: Record<InboxLead['status'], string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  closed: 'Closed',
}
const STATUS_COLORS: Record<InboxLead['status'], string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
}

const CLOSE_REASON_LABELS: Record<string, string> = {
  won: 'Won (paid)',
  lost_not_fit: 'Lost — not a fit',
  lost_no_response: 'Lost — no response',
  lost_other: 'Lost — other',
}

export function InboxDashboard({
  leads,
  stats,
  siteOptions,
  activeFilters,
}: {
  leads: InboxLead[]
  stats: InboxStats
  siteOptions: string[]
  activeFilters: Filters
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<InboxLead | null>(null)
  const [pending, startTransition] = useTransition()

  const applyFilters = (next: Filters) => {
    const qs = new URLSearchParams()
    if (next.site) qs.set('site', next.site)
    if (next.status) qs.set('status', next.status)
    if (next.q) qs.set('q', next.q)
    const query = qs.toString()
    startTransition(() => {
      router.push(query ? `/admin/inbox?${query}` : '/admin/inbox')
    })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
              <p className="text-sm text-slate-500">
                Inbound consultation leads across tenants.
              </p>
            </div>
            <a
              href="/admin"
              className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
            >
              ← Back to admin
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <StatsRow stats={stats} />
        <Filters
          active={activeFilters}
          siteOptions={siteOptions}
          onApply={applyFilters}
          pending={pending}
        />
        <LeadsTable
          leads={leads}
          onSelect={setSelected}
          pending={pending}
        />
      </section>

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdated={(next) => {
            // Refresh the page data so the table reflects the update.
            setSelected(next)
            startTransition(() => router.refresh())
          }}
        />
      )}
    </main>
  )
}

function StatsRow({ stats }: { stats: InboxStats }) {
  const cards = [
    { label: 'Total', value: stats.total, tone: 'slate' },
    { label: 'New', value: stats.new, tone: 'blue' },
    { label: 'Contacted', value: stats.contacted, tone: 'amber' },
    { label: 'Qualified', value: stats.qualified, tone: 'purple' },
    { label: 'Won (30d)', value: stats.wonLast30Days, tone: 'emerald' },
  ]
  const tone: Record<string, string> = {
    slate: 'text-slate-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
    purple: 'text-purple-700',
    emerald: 'text-emerald-700',
  }
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {c.label}
          </p>
          <p className={`mt-1 text-2xl font-semibold ${tone[c.tone]}`}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function Filters({
  active,
  siteOptions,
  onApply,
  pending,
}: {
  active: Filters
  siteOptions: string[]
  onApply: (next: Filters) => void
  pending: boolean
}) {
  const [local, setLocal] = useState<Filters>(active)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onApply(local)
      }}
      className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4"
    >
      <label className="flex-1 min-w-[180px]">
        <span className="mb-1 block text-xs font-medium text-slate-600">Search</span>
        <input
          type="search"
          value={local.q ?? ''}
          onChange={(e) => setLocal({ ...local, q: e.target.value })}
          placeholder="name, email, objective…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </label>
      <label>
        <span className="mb-1 block text-xs font-medium text-slate-600">Site</span>
        <select
          value={local.site ?? ''}
          onChange={(e) => setLocal({ ...local, site: e.target.value || undefined })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All sites</option>
          {siteOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="mb-1 block text-xs font-medium text-slate-600">Status</span>
        <select
          value={local.status ?? ''}
          onChange={(e) => setLocal({ ...local, status: e.target.value || undefined })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? 'Applying…' : 'Apply'}
      </button>
      {(active.site || active.status || active.q) && (
        <button
          type="button"
          onClick={() => { setLocal({}); onApply({}) }}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Clear
        </button>
      )}
    </form>
  )
}

function LeadsTable({
  leads,
  onSelect,
  pending,
}: {
  leads: InboxLead[]
  onSelect: (l: InboxLead) => void
  pending: boolean
}) {
  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-sm text-slate-500">No leads match the current filters.</p>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Name + contact</th>
            <th className="px-4 py-3">Site · locale</th>
            <th className="px-4 py-3">Program</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-slate-100 ${pending ? 'opacity-60' : ''}`}>
          {leads.map((l) => (
            <tr
              key={l.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => onSelect(l)}
            >
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {formatDate(l.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{l.name}</div>
                <div className="text-xs text-slate-500">{l.email}</div>
                {l.country && (
                  <div className="text-xs text-slate-400">{l.country}</div>
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                <span className="font-mono text-xs">{l.site_slug}</span>
                <span className="text-slate-400"> · {l.locale}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {l.program_interest || <span className="text-slate-300">—</span>}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={l.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: InboxLead['status'] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

function LeadDrawer({
  lead,
  onClose,
  onUpdated,
}: {
  lead: InboxLead
  onClose: () => void
  onUpdated: (next: InboxLead) => void
}) {
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState(lead.admin_notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const patch = async (body: Partial<{ status: InboxLead['status']; admin_notes: string; close_reason: string | null }>) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'update failed')
      if (json.lead) onUpdated({ ...lead, ...json.lead })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'update failed')
    } finally {
      setSaving(false)
    }
  }

  const whatsappHref = lead.phone
    ? `https://wa.me/${lead.phone.replace(/\D/g, '')}`
    : null
  const mailHref = `mailto:${lead.email}?subject=${encodeURIComponent('Re: your Nexa Paraguay consultation')}&body=${encodeURIComponent(`Hi ${lead.name},\n\nThanks for reaching out. `)}`

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      onClick={onClose}
    >
      <aside
        className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {lead.site_slug} · {lead.locale}
            </p>
            <h2 className="text-lg font-semibold text-slate-900">{lead.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact
            </h3>
            <dl className="space-y-1 text-sm">
              <Row label="Email"><a href={mailHref} className="text-blue-600 hover:underline">{lead.email}</a></Row>
              {lead.phone && <Row label="Phone">{lead.phone}</Row>}
              {lead.country && <Row label="Country">{lead.country}</Row>}
              {lead.program_interest && <Row label="Program">{lead.program_interest}</Row>}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white"
                >
                  WhatsApp
                </a>
              )}
              <a
                href={mailHref}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Email
              </a>
            </div>
          </section>

          {lead.objective && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Objective
              </h3>
              <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                {lead.objective}
              </p>
            </section>
          )}

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pipeline
            </h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => patch({ status: s })}
                  disabled={saving || lead.status === s}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                    lead.status === s
                      ? `${STATUS_COLORS[s]} ring-2 ring-offset-1 ring-slate-400`
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  } ${saving ? 'opacity-50' : ''}`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <div>Received: {formatDate(lead.created_at)}</div>
              {lead.contacted_at && <div>Contacted: {formatDate(lead.contacted_at)}</div>}
              {lead.qualified_at && <div>Qualified: {formatDate(lead.qualified_at)}</div>}
              {lead.closed_at && <div>Closed: {formatDate(lead.closed_at)}{lead.close_reason && ` — ${CLOSE_REASON_LABELS[lead.close_reason]}`}</div>}
            </div>
            {lead.status === 'closed' && (
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">Close reason</label>
                <select
                  value={lead.close_reason ?? ''}
                  onChange={(e) => patch({ close_reason: e.target.value || null })}
                  disabled={saving}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">— pick one —</option>
                  {Object.entries(CLOSE_REASON_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Internal notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Context, follow-ups, decisions. Not shared with the lead."
              className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => patch({ admin_notes: notes })}
              disabled={saving || notes === (lead.admin_notes ?? '')}
              className="mt-2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save notes'}
            </button>
          </section>

          {(lead.source || lead.referer || (lead.utm && Object.keys(lead.utm).length > 0)) && (
            <section className="border-t pt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Attribution
              </h3>
              <dl className="space-y-1 font-mono text-xs text-slate-600">
                {lead.source && <Row label="source" mono>{lead.source}</Row>}
                {lead.referer && <Row label="referer" mono><span className="break-all">{lead.referer}</span></Row>}
                {lead.utm &&
                  Object.entries(lead.utm).map(([k, v]) => (
                    <Row key={k} label={k} mono>{v}</Row>
                  ))}
              </dl>
            </section>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>
      </aside>
    </div>
  )
}

function Row({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex gap-3">
      <dt className={`w-24 flex-shrink-0 ${mono ? 'font-mono' : ''} text-slate-500`}>{label}</dt>
      <dd className="flex-1 text-slate-800">{children}</dd>
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
