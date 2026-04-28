'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SeedCatalogButton({ businessId }: { businessId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleClick() {
    if (!confirm('Cargar productos de ejemplo? Vas a poder editarlos o eliminarlos después.')) return
    setBusy(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/seed-catalog`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'seed_failed')
      setFeedback(`${data.count} productos creados`)
      router.refresh()
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Error al cargar el catálogo')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm font-medium hover:bg-surface-light disabled:opacity-50"
      >
        {busy ? 'Cargando…' : 'Cargar catálogo de ejemplo'}
      </button>
      {feedback ? <span className="text-sm text-[color:var(--text-muted,#6b7280)]">{feedback}</span> : null}
    </div>
  )
}
