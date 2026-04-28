'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  siteSlug: string
  locale: string
}

export function OrderLookupForm({ siteSlug, locale }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const form = new FormData(event.currentTarget)
    const payload = {
      email: String(form.get('email') ?? '').trim(),
      orderNumber: String(form.get('orderNumber') ?? '').trim(),
    }
    try {
      const res = await fetch(`/api/storefront/${siteSlug}/orders/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.status === 404) {
        setError('No encontramos esa combinación. Revisá el email y el número de orden.')
        setSubmitting(false)
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'lookup_failed')
        setSubmitting(false)
        return
      }
      const data = await res.json()
      router.push(`/s/${locale}/${siteSlug}/orden/${data.orderId}`)
    } catch {
      setError('Error de red. Probá de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-6">
      <div>
        <label htmlFor="lookup-email" className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
          Email <span aria-hidden="true" className="text-red-600">*</span>
          <span className="sr-only">(obligatorio)</span>
        </label>
        <input
          id="lookup-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vos@ejemplo.com"
          className="block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="lookup-order" className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
          Número de orden <span aria-hidden="true" className="text-red-600">*</span>
          <span className="sr-only">(obligatorio)</span>
        </label>
        <input
          id="lookup-order"
          name="orderNumber"
          required
          placeholder="ej: BIZ01-260421-0007"
          className="block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm font-mono focus:border-[color:var(--primary,#111)] focus:outline-none"
        />
        <p className="mt-1 text-xs text-[color:var(--text-muted,#6b7280)]">
          Lo encontrás en el email de confirmación que te enviamos.
        </p>
      </div>

      {error ? (
        <p role="alert" className="flex items-start gap-1 rounded bg-red-50 p-2 text-sm text-red-700">
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] disabled:opacity-50"
      >
        {submitting ? 'Buscando…' : 'Buscar mi orden'}
      </button>
    </form>
  )
}
