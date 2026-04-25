'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  siteSlug: string
  orderId: string
}

/**
 * "Ya envié el comprobante" button on the /checkout/transfer/[id]
 * page. POSTs to the comprobante-sent endpoint which stamps
 * orders.comprobante_sent_at — purely a UX signal so the merchant
 * sees a "Comprobante enviado" badge on the order detail. The admin
 * still has to confirm the payment manually.
 */
export function ComprobanteSentButton({ siteSlug, orderId }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/storefront/${siteSlug}/orders/${orderId}/comprobante-sent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'update_failed')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'update_failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] px-4 py-2 text-sm font-medium hover:bg-[color:var(--surface-muted,#f3f4f6)] disabled:opacity-60"
      >
        {submitting ? 'Registrando…' : 'Ya envié el comprobante'}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-700">
          No pudimos registrar tu aviso. Intentá de nuevo o mandá el comprobante por WhatsApp.
        </p>
      ) : null}
    </div>
  )
}
