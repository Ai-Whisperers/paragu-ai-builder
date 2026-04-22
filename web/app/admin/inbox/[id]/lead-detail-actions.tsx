'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { InboxLead } from '../page'

const STATUS_ORDER: InboxLead['status'][] = ['new', 'contacted', 'qualified', 'closed']
const STATUS_LABELS: Record<InboxLead['status'], string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', closed: 'Closed',
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

export function LeadDetailActions({
  lead: initial,
  adminEmails,
}: {
  lead: InboxLead
  adminEmails: string[]
}) {
  const router = useRouter()
  const [lead, setLead] = useState(initial)
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
      if (json.lead) setLead({ ...lead, ...json.lead })
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'update failed')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Pipeline</p>
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
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Assignee</p>
        <select
          value={lead.assigned_to ?? ''}
          onChange={(e) => patch({ assigned_to: e.target.value || null })}
          disabled={saving}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Unassigned</option>
          {adminEmails.map((email) => <option key={email} value={email}>{email}</option>)}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Internal notes</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
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
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div>
  )
}
