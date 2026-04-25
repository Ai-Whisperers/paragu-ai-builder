'use client'

import { useEffect, useState } from 'react'

interface AuditEntry {
  id: string
  actor: string | null
  field: string
  old_value: string | null
  new_value: string | null
  created_at: string
}

const FIELD_LABELS: Record<string, string> = {
  status: 'Status',
  assigned_to: 'Assignee',
  close_reason: 'Close reason',
}

export function AuditTimeline({ leadId }: { leadId: string }) {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/leads/${leadId}/audit`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'audit load failed')
        if (!cancelled) setEntries(j.entries as AuditEntry[])
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'failed')
      })
    return () => { cancelled = true }
  }, [leadId])

  if (error) {
    return <p className="text-xs text-red-600">Failed to load audit trail: {error}</p>
  }
  if (entries === null) {
    return <p className="text-xs text-slate-400">Loading timeline…</p>
  }
  if (entries.length === 0) {
    return <p className="text-xs text-slate-400">No changes recorded yet.</p>
  }
  return (
    <ol className="space-y-2 text-xs">
      {entries.map((e) => (
        <li key={e.id} className="flex gap-2 border-l-2 border-slate-200 pl-3">
          <div className="flex-1">
            <p className="text-slate-700">
              <span className="font-medium">{FIELD_LABELS[e.field] ?? e.field}</span>
              {e.old_value && <> from <code className="rounded bg-slate-100 px-1">{e.old_value}</code></>}
              {' '}→ <code className="rounded bg-slate-100 px-1">{e.new_value ?? '—'}</code>
            </p>
            <p className="mt-0.5 text-slate-400">
              {e.actor ?? 'system'} · {formatTime(e.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
