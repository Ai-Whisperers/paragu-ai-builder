'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  businessId: string
  orderId: string
}

/**
 * Tiny form on admin order detail for recording internal notes. Each
 * submit writes a `note_added` row to order_events so the timeline
 * preserves context the operator added. Not visible to the customer.
 */
export function OrderNoteForm({ businessId, orderId }: Props) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!note.trim() || state === 'submitting') return
    setState('submitting')
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/orders/${orderId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })
      if (!res.ok) throw new Error('failed')
      setNote('')
      setState('idle')
      router.refresh()
    } catch {
      setState('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="mb-1 block text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
        Agregar nota interna
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Ej: Llamé al cliente, no atiende."
        className="w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-[color:var(--text-muted,#6b7280)]">
          Solo visible para el equipo, queda en el historial.
        </span>
        <button
          type="submit"
          disabled={!note.trim() || state === 'submitting'}
          className="rounded-md bg-[color:var(--primary,#111)] px-3 py-1.5 text-xs font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90 disabled:opacity-50"
        >
          {state === 'submitting' ? 'Guardando…' : 'Guardar nota'}
        </button>
      </div>
      {state === 'error' ? (
        <p role="alert" className="mt-1 text-xs text-red-700">
          No pudimos guardar. Intentá de nuevo.
        </p>
      ) : null}
    </form>
  )
}
