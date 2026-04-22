'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { InboxLead, InboxStats } from './page'

type Filters = { site?: string; status?: string; q?: string; assignee?: string }

interface Pagination {
  page: number
  pageSize: number
  totalCount: number
}

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

// SLA urgency — visual cue for leads sitting outside the expected response
// window. New leads should move to "contacted" within 24h; contacted leads
// should progress (qualified or closed) within 72h. Exceed 2× threshold → overdue.
const SLA_HOURS = { new: 24, contacted: 72 } as const

type SlaLevel = 'ok' | 'warning' | 'overdue' | null

function slaStatus(lead: Pick<InboxLead, 'status' | 'created_at' | 'contacted_at'>): SlaLevel {
  const now = Date.now()
  if (lead.status === 'new') {
    const age = (now - new Date(lead.created_at).getTime()) / 3_600_000
    if (age > SLA_HOURS.new * 2) return 'overdue'
    if (age > SLA_HOURS.new) return 'warning'
    return 'ok'
  }
  if (lead.status === 'contacted' && lead.contacted_at) {
    const age = (now - new Date(lead.contacted_at).getTime()) / 3_600_000
    if (age > SLA_HOURS.contacted * 2) return 'overdue'
    if (age > SLA_HOURS.contacted) return 'warning'
    return 'ok'
  }
  return null
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
  assigneeOptions,
  adminEmails,
  pagination,
  activeFilters,
}: {
  leads: InboxLead[]
  stats: InboxStats
  siteOptions: string[]
  assigneeOptions: string[]
  adminEmails: string[]
  pagination: Pagination
  activeFilters: Filters
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<InboxLead | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const applyFilters = useCallback(
    (next: Filters & { page?: number }) => {
      const qs = new URLSearchParams()
      if (next.site) qs.set('site', next.site)
      if (next.status) qs.set('status', next.status)
      if (next.q) qs.set('q', next.q)
      if (next.assignee) qs.set('assignee', next.assignee)
      if (next.page && next.page > 1) qs.set('page', String(next.page))
      const query = qs.toString()
      setSelectedIds(new Set())
      startTransition(() => {
        router.push(query ? `/admin/inbox?${query}` : '/admin/inbox')
      })
    },
    [router],
  )

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds((prev) => (prev.size === leads.length ? new Set() : new Set(leads.map((l) => l.id))))
  }

  const exportHref = (() => {
    const qs = new URLSearchParams()
    if (activeFilters.site) qs.set('site', activeFilters.site)
    if (activeFilters.status) qs.set('status', activeFilters.status)
    if (activeFilters.q) qs.set('q', activeFilters.q)
    if (activeFilters.assignee) qs.set('assignee', activeFilters.assignee)
    const s = qs.toString()
    return s ? `/api/admin/leads/export?${s}` : '/api/admin/leads/export'
  })()

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
              <p className="text-sm text-slate-500">Inbound consultation leads across tenants.</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href={exportHref} className="text-slate-600 hover:text-slate-900 hover:underline">
                Export CSV
              </a>
              <a href="/admin" className="text-slate-600 hover:text-slate-900 hover:underline">
                ← Back to admin
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <StatsRow stats={stats} />
        <FiltersBar
          active={activeFilters}
          siteOptions={siteOptions}
          assigneeOptions={assigneeOptions}
          onApply={applyFilters}
          pending={pending}
        />

        {selectedIds.size > 0 && (
          <BulkActionBar
            count={selectedIds.size}
            ids={Array.from(selectedIds)}
            adminEmails={adminEmails}
            onCleared={() => setSelectedIds(new Set())}
            onApplied={() => {
              setSelectedIds(new Set())
              startTransition(() => router.refresh())
            }}
          />
        )}

        <LeadsTable
          leads={leads}
          selected={selectedIds}
          onSelect={setSelected}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          pending={pending}
        />

        <Paginator
          pagination={pagination}
          onGo={(page) => applyFilters({ ...activeFilters, page })}
          pending={pending}
        />
      </section>

      {selected && (
        <LeadDrawer
          lead={selected}
          adminEmails={adminEmails}
          onClose={() => setSelected(null)}
          onUpdated={(next) => {
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
    { label: 'Total', value: stats.total, tone: 'text-slate-700' },
    { label: 'New', value: stats.new, tone: 'text-blue-700' },
    { label: 'Contacted', value: stats.contacted, tone: 'text-amber-700' },
    { label: 'Qualified', value: stats.qualified, tone: 'text-purple-700' },
    { label: 'Won (30d)', value: stats.wonLast30Days, tone: 'text-emerald-700' },
  ]
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{c.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${c.tone}`}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}

function FiltersBar({
  active,
  siteOptions,
  assigneeOptions,
  onApply,
  pending,
}: {
  active: Filters
  siteOptions: string[]
  assigneeOptions: string[]
  onApply: (next: Filters) => void
  pending: boolean
}) {
  const [local, setLocal] = useState<Filters>(active)
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onApply(local) }}
      className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4"
    >
      <label className="flex-1 min-w-[180px]">
        <span className="mb-1 block text-xs font-medium text-slate-600">Search</span>
        <input
          type="search"
          value={local.q ?? ''}
          onChange={(e) => setLocal({ ...local, q: e.target.value })}
          placeholder="name, email, objective…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
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
          {siteOptions.map((s) => <option key={s} value={s}>{s}</option>)}
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
          {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </label>
      <label>
        <span className="mb-1 block text-xs font-medium text-slate-600">Assignee</span>
        <select
          value={local.assignee ?? ''}
          onChange={(e) => setLocal({ ...local, assignee: e.target.value || undefined })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Anyone</option>
          <option value="unassigned">Unassigned</option>
          {assigneeOptions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
      <button type="submit" disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
        {pending ? 'Applying…' : 'Apply'}
      </button>
      {(active.site || active.status || active.q || active.assignee) && (
        <button type="button"
          onClick={() => { setLocal({}); onApply({}) }}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Clear
        </button>
      )}
    </form>
  )
}

function BulkActionBar({
  count, ids, adminEmails, onCleared, onApplied,
}: {
  count: number
  ids: string[]
  adminEmails: string[]
  onCleared: () => void
  onApplied: () => void
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bulk = async (body: Record<string, unknown>) => {
    setPending(true); setError(null)
    try {
      const res = await fetch('/api/admin/leads/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, ...body }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'bulk update failed')
      onApplied()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'bulk update failed')
    } finally { setPending(false) }
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <span className="font-medium text-amber-900">{count} selected</span>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-amber-700">Set status:</span>
        {STATUS_ORDER.map((s) => (
          <button key={s} type="button" disabled={pending} onClick={() => bulk({ status: s })}
            className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-amber-100 disabled:opacity-50">
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-amber-700">Assign to:</span>
        <select disabled={pending} onChange={(e) => {
          if (!e.target.value) return
          const val = e.target.value === '__unassign' ? null : e.target.value
          bulk({ assigned_to: val })
          e.target.value = ''
        }} className="rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs">
          <option value="">— pick —</option>
          <option value="__unassign">Unassign</option>
          {adminEmails.map((email) => <option key={email} value={email}>{email}</option>)}
        </select>
      </div>
      <button type="button" onClick={onCleared} className="ml-auto text-xs text-amber-800 hover:underline">
        Clear selection
      </button>
      {error && <p className="mt-2 w-full text-xs text-red-700">{error}</p>}
    </div>
  )
}

function LeadsTable({
  leads, selected, onSelect, onToggleRow, onToggleAll, pending,
}: {
  leads: InboxLead[]
  selected: Set<string>
  onSelect: (l: InboxLead) => void
  onToggleRow: (id: string) => void
  onToggleAll: () => void
  pending: boolean
}) {
  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-sm text-slate-500">No leads match the current filters.</p>
      </div>
    )
  }
  const allSelected = leads.length > 0 && selected.size === leads.length
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-3 py-3 w-10">
              <input type="checkbox" checked={allSelected} onChange={onToggleAll} aria-label="Select all" className="h-4 w-4 rounded border-slate-300" />
            </th>
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Name + contact</th>
            <th className="px-4 py-3">Site · locale</th>
            <th className="px-4 py-3">Program</th>
            <th className="px-4 py-3">Assignee</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-slate-100 ${pending ? 'opacity-60' : ''}`}>
          {leads.map((l) => {
            const sla = slaStatus(l)
            const slaCls = sla === 'overdue' ? 'border-l-4 border-l-red-500' : sla === 'warning' ? 'border-l-4 border-l-amber-500' : ''
            return (
            <tr key={l.id} className={`hover:bg-slate-50 ${slaCls} ${selected.has(l.id) ? 'bg-amber-50/40' : ''}`}>
              <td className="px-3 py-3">
                <input type="checkbox" checked={selected.has(l.id)} onChange={() => onToggleRow(l.id)} onClick={(e) => e.stopPropagation()} aria-label={`Select ${l.name}`} className="h-4 w-4 rounded border-slate-300" />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600 cursor-pointer" onClick={() => onSelect(l)}>{formatDate(l.created_at)}</td>
              <td className="px-4 py-3 cursor-pointer" onClick={() => onSelect(l)}>
                <div className="font-medium text-slate-900">{l.name}</div>
                <div className="text-xs text-slate-500">{l.email}</div>
                {l.country && <div className="text-xs text-slate-400">{l.country}</div>}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600 cursor-pointer" onClick={() => onSelect(l)}>
                <span className="font-mono text-xs">{l.site_slug}</span>
                <span className="text-slate-400"> · {l.locale}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600 cursor-pointer" onClick={() => onSelect(l)}>
                {l.program_interest || <span className="text-slate-300">—</span>}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600 cursor-pointer" onClick={() => onSelect(l)}>
                {l.assigned_to
                  ? <span className="font-mono text-xs">{l.assigned_to.split('@')[0]}</span>
                  : <span className="text-slate-300 italic">unassigned</span>}
              </td>
              <td className="px-4 py-3 cursor-pointer" onClick={() => onSelect(l)}>
                <div className="flex items-center gap-2">
                  <StatusBadge status={l.status} />
                  {sla === 'overdue' && <span className="text-xs font-medium text-red-600">overdue</span>}
                  {sla === 'warning' && <span className="text-xs font-medium text-amber-600">late</span>}
                </div>
              </td>
            </tr>
                    )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Paginator({
  pagination, onGo, pending,
}: {
  pagination: Pagination
  onGo: (page: number) => void
  pending: boolean
}) {
  const { page, pageSize, totalCount } = pagination
  if (totalCount === 0) return null
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
      <p className="text-slate-600">
        Showing <span className="font-medium text-slate-900">{start}</span>–
        <span className="font-medium text-slate-900">{end}</span> of{' '}
        <span className="font-medium text-slate-900">{totalCount}</span>
      </p>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1 || pending} onClick={() => onGo(page - 1)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">
          Previous
        </button>
        <button type="button" disabled={end >= totalCount || pending} onClick={() => onGo(page + 1)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: InboxLead['status'] }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
}

function LeadDrawer({
  lead, adminEmails, onClose, onUpdated,
}: {
  lead: InboxLead
  adminEmails: string[]
  onClose: () => void
  onUpdated: (next: InboxLead) => void
}) {
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState(lead.admin_notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const patch = async (body: Partial<{ status: InboxLead['status']; admin_notes: string; close_reason: string | null; assigned_to: string | null }>) => {
    setSaving(true); setError(null)
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
    } finally { setSaving(false) }
  }

  const whatsappHref = lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, '')}` : null
  const mailHref = `mailto:${lead.email}?subject=${encodeURIComponent('Re: your Nexa Paraguay consultation')}&body=${encodeURIComponent(`Hi ${lead.name},\n\nThanks for reaching out. `)}`

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={onClose}>
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">{lead.site_slug} · {lead.locale}</p>
            <h2 className="text-lg font-semibold text-slate-900">{lead.name}</h2>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">✕</button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</h3>
            <dl className="space-y-1 text-sm">
              <Row label="Email"><a href={mailHref} className="text-blue-600 hover:underline">{lead.email}</a></Row>
              {lead.phone && <Row label="Phone">{lead.phone}</Row>}
              {lead.country && <Row label="Country">{lead.country}</Row>}
              {lead.program_interest && <Row label="Program">{lead.program_interest}</Row>}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white">WhatsApp</a>
              )}
              <a href={mailHref} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Email</a>
            </div>
          </section>

          {lead.objective && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Objective</h3>
              <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm text-slate-700">{lead.objective}</p>
            </section>
          )}

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Assignee</h3>
            <select value={lead.assigned_to ?? ''} onChange={(e) => patch({ assigned_to: e.target.value || null })} disabled={saving}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Unassigned</option>
              {adminEmails.map((email) => <option key={email} value={email}>{email}</option>)}
            </select>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Pipeline</h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button key={s} type="button" onClick={() => patch({ status: s })} disabled={saving || lead.status === s}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${lead.status === s ? `${STATUS_COLORS[s]} ring-2 ring-offset-1 ring-slate-400` : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'} ${saving ? 'opacity-50' : ''}`}>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <div>Received: {formatDate(lead.created_at)}</div>
              {lead.contacted_at && <div>Contacted: {formatDate(lead.contacted_at)}</div>}
              {lead.qualified_at && <div>Qualified: {formatDate(lead.qualified_at)}</div>}
              {lead.closed_at && (
                <div>
                  Closed: {formatDate(lead.closed_at)}
                  {lead.close_reason && ` — ${CLOSE_REASON_LABELS[lead.close_reason]}`}
                </div>
              )}
            </div>
            {lead.status === 'closed' && (
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">Close reason</label>
                <select value={lead.close_reason ?? ''} onChange={(e) => patch({ close_reason: e.target.value || null })} disabled={saving}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                  <option value="">— pick one —</option>
                  {Object.entries(CLOSE_REASON_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Internal notes</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6}
              placeholder="Context, follow-ups, decisions. Not shared with the lead."
              className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none" />
            <button type="button" onClick={() => patch({ admin_notes: notes })} disabled={saving || notes === (lead.admin_notes ?? '')}
              className="mt-2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save notes'}
            </button>
          </section>

          {(lead.source || lead.referer || (lead.utm && Object.keys(lead.utm).length > 0)) && (
            <section className="border-t pt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Attribution</h3>
              <dl className="space-y-1 font-mono text-xs text-slate-600">
                {lead.source && <Row label="source" mono>{lead.source}</Row>}
                {lead.referer && <Row label="referer" mono><span className="break-all">{lead.referer}</span></Row>}
                {lead.utm && Object.entries(lead.utm).map(([k, v]) => <Row key={k} label={k} mono>{v}</Row>)}
              </dl>
            </section>
          )}

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
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
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
