'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  businessId: string
  orderId: string
  alreadyIssued: boolean
  invoiceNumber?: string | null
  customerName: string
}

/**
 * Manual "Emitir factura" admin widget. Pre-SET/Timbrado: admin
 * types the values in, we stamp the DB fields, the shopper's /recibo
 * page flips from "recibo provisional" to "Factura". Once Batch L
 * ships SET integration the shape of this form stays the same — only
 * the write path changes.
 */
export function InvoiceIssueForm({
  businessId,
  orderId,
  alreadyIssued,
  invoiceNumber,
  customerName,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    invoiceNumber: '',
    legalName: customerName,
    ruc: '',
    concept: '',
    pdfUrl: '',
  })

  if (alreadyIssued) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
        <p className="font-semibold">✓ Factura emitida</p>
        <p className="text-xs">N° {invoiceNumber}</p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-xs font-semibold hover:bg-surface-light"
      >
        🧾 Emitir factura
      </button>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/commerce/${businessId}/orders/${orderId}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: form.invoiceNumber.trim(),
          legalName: form.legalName.trim(),
          ruc: form.ruc.trim() || undefined,
          concept: form.concept.trim() || undefined,
          pdfUrl: form.pdfUrl.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? 'failed')
      }
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'failed'
      setError(
        msg === 'already_invoiced'
          ? 'Esta orden ya tiene factura emitida.'
          : 'No pudimos emitir la factura. Verificá los datos y reintentá.',
      )
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4"
    >
      <h3 className="text-sm font-semibold">Emitir factura manualmente</h3>
      <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
        Completá con los datos de la factura timbrada que ya emitiste en tu sistema. El cliente verá
        estos datos en su /recibo.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs">
          Número de factura *
          <input
            required
            value={form.invoiceNumber}
            onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            placeholder="001-001-0000001"
          />
        </label>
        <label className="block text-xs">
          Razón social *
          <input
            required
            value={form.legalName}
            onChange={(e) => setForm({ ...form, legalName: e.target.value })}
            className="mt-1 block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          RUC
          <input
            value={form.ruc}
            onChange={(e) => setForm({ ...form, ruc: e.target.value })}
            className="mt-1 block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            placeholder="80012345-6"
          />
        </label>
        <label className="block text-xs">
          URL del PDF
          <input
            type="url"
            value={form.pdfUrl}
            onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </label>
      </div>
      <label className="block text-xs">
        Concepto
        <input
          value={form.concept}
          onChange={(e) => setForm({ ...form, concept: e.target.value })}
          className="mt-1 block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
          placeholder="Artículo de salud y bienestar personal"
        />
      </label>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-xs font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || !form.invoiceNumber.trim() || !form.legalName.trim()}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Emitir factura'}
        </button>
      </div>
    </form>
  )
}
