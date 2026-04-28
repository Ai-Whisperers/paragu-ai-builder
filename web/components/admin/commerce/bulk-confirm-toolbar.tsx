'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  businessId: string
}

/**
 * Floating toolbar that activates when one or more rows in the admin
 * orders table are checked. Provides "Confirmar pago (N)" which POSTs
 * to bulk-confirm-paid and refreshes the page.
 *
 * Listens for changes on checkboxes inside the table — kept as a
 * sibling rather than passing state through the server-rendered table
 * so /admin/commerce/[id]/orders/page.tsx stays a server component.
 */
export function BulkConfirmToolbar({ businessId }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Attach change listener to all order-checkbox inputs on mount.
  useEffect(() => {
    const selector = 'input[type="checkbox"][data-order-id]'
    function refreshFromDom() {
      const boxes = Array.from(document.querySelectorAll<HTMLInputElement>(selector))
      setSelected(boxes.filter((b) => b.checked).map((b) => b.dataset.orderId!))
    }
    document.addEventListener('change', refreshFromDom)
    refreshFromDom()
    return () => document.removeEventListener('change', refreshFromDom)
  }, [])

  if (selected.length === 0) return null

  async function handleBulkConfirm() {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/orders/bulk-confirm-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selected }),
      })
      if (!res.ok) throw new Error('failed')
      const body = (await res.json()) as { ok: number; failed: number }
      if (body.failed > 0) {
        setError(`${body.ok} ok, ${body.failed} fallaron.`)
      } else {
        setError(null)
      }
      router.refresh()
    } catch {
      setError('No se pudo completar el bulk. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border,#e5e7eb)] bg-surface px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="text-sm">
          <strong>{selected.length}</strong> {selected.length === 1 ? 'orden seleccionada' : 'órdenes seleccionadas'}
        </p>
        <div className="flex items-center gap-2">
          {error ? <span className="text-xs text-red-700">{error}</span> : null}
          <button
            type="button"
            onClick={handleBulkConfirm}
            disabled={submitting}
            className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Confirmando…' : `✓ Confirmar pago (${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}
