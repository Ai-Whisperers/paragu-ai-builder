'use client'

import { useState } from 'react'
import { DEMO_PHONE } from '@/lib/constants'

interface Props {
  businessId: string
  subscriptionId: string
  planLabel: string
  defaultAmountCents: number
  defaultEmail: string
  defaultName: string
  defaultPhone: string
}

interface GeneratedLink {
  paymentUrl: string
  hashPedido: string
  orderNumber: string
  whatsAppUrl: string | null
}

export function SubscriptionLinkGenerator(props: Props) {
  const [generating, setGenerating] = useState(false)
  const [link, setLink] = useState<GeneratedLink | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGenerating(true)
    setError(null)
    setLink(null)
    const form = new FormData(event.currentTarget)

    const payload = {
      subscriptionId: props.subscriptionId,
      planLabel: String(form.get('planLabel') ?? props.planLabel),
      amountCents: parseInt(String(form.get('amountCents') ?? '0').replace(/[^0-9]/g, ''), 10) || 0,
      payerEmail: String(form.get('payerEmail') ?? ''),
      payerName: String(form.get('payerName') ?? ''),
      payerPhone: String(form.get('payerPhone') ?? '').trim() || undefined,
    }

    try {
      const res = await fetch(`/api/admin/billing/${props.businessId}/generate-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'generate_failed')
      setLink(data as GeneratedLink)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el link')
    } finally {
      setGenerating(false)
    }
  }

  async function copyLink() {
    if (!link) return
    await navigator.clipboard.writeText(link.paymentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] p-4">
      <p className="mb-3 text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Generar link de pago</p>

      <form onSubmit={generate} className="grid gap-3 sm:grid-cols-2">
        <input type="hidden" name="planLabel" defaultValue={props.planLabel} />

        <label className="block">
          <span className="mb-1 block text-xs text-[color:var(--text-muted,#6b7280)]">Monto (Gs)</span>
          <input
            name="amountCents"
            defaultValue={String(props.defaultAmountCents)}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-[color:var(--text-muted,#6b7280)]">Teléfono WhatsApp</span>
          <input
            name="payerPhone"
            defaultValue={props.defaultPhone}
            placeholder={DEMO_PHONE}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs text-[color:var(--text-muted,#6b7280)]">Nombre del pagador</span>
          <input
            name="payerName"
            defaultValue={props.defaultName}
            required
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs text-[color:var(--text-muted,#6b7280)]">Email del pagador</span>
          <input
            name="payerEmail"
            type="email"
            defaultValue={props.defaultEmail}
            required
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={generating}
            className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {generating ? 'Generando…' : 'Generar link de pago'}
          </button>
        </div>
      </form>

      {error ? (
        <p role="alert" className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">
          {error === 'paragu_ai_pagopar_not_configured'
            ? 'Falta configurar PARAGU_AI_PAGOPAR_PUBLIC_TOKEN / PRIVATE_TOKEN en /etc/paragu-ai/env.'
            : error}
        </p>
      ) : null}

      {link ? (
        <div className="mt-4 space-y-3 rounded bg-white p-4 text-sm">
          <div>
            <span className="block text-xs text-[color:var(--text-muted,#6b7280)]">Link de pago (copialo y mandalo al cliente)</span>
            <div className="mt-1 flex gap-2">
              <input
                readOnly
                value={link.paymentUrl}
                className="flex-1 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] px-3 py-2 font-mono text-xs"
              />
              <button
                type="button"
                onClick={copyLink}
                className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)]"
              >
                {copied ? 'Copiado ✓' : 'Copiar'}
              </button>
            </div>
          </div>

          {link.whatsAppUrl ? (
            <a
              href={link.whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#20b85a]"
            >
              Abrir chat de WhatsApp con el cliente
            </a>
          ) : null}

          <p className="text-xs text-[color:var(--text-muted,#9ca3af)]">
            Orden: <code>{link.orderNumber}</code> · Hash: <code>{link.hashPedido}</code>
          </p>
        </div>
      ) : null}
    </div>
  )
}
