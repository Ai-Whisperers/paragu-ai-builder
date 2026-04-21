'use client'

import { useState } from 'react'
import {
  PARAGU_AI_BANK_ALIAS,
  PARAGU_AI_COMPROBANTE_WHATSAPP,
  buildSaasOutreachMessage,
  buildSaasOutreachWhatsAppUrl,
} from '@/lib/billing/paragu-ai-bank'

interface Props {
  businessName: string
  planLabel: string
  defaultAmountCents: number
  tenantWhatsapp: string | null
}

export function BankTransferInstructions(props: Props) {
  const [amountCents, setAmountCents] = useState(String(props.defaultAmountCents))
  const [customPlan, setCustomPlan] = useState(props.planLabel)
  const [copied, setCopied] = useState<'alias' | 'whatsapp' | 'message' | null>(null)

  const parsedAmount = parseInt(amountCents.replace(/[^0-9]/g, ''), 10) || 0

  const messageBody = buildSaasOutreachMessage({
    businessName: props.businessName,
    planLabel: customPlan,
    amountCents: parsedAmount,
  })

  const waUrl = props.tenantWhatsapp
    ? buildSaasOutreachWhatsAppUrl(props.tenantWhatsapp, {
        businessName: props.businessName,
        planLabel: customPlan,
        amountCents: parsedAmount,
      })
    : null

  async function copy(which: 'alias' | 'whatsapp' | 'message', value: string) {
    await navigator.clipboard.writeText(value)
    setCopied(which)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="mt-4 space-y-4 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] p-4">
      <header>
        <p className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Cobrar al cliente</p>
        <h3 className="mt-1 text-base font-semibold">Transferencia bancaria + comprobante por WhatsApp</h3>
        <p className="mt-1 text-xs text-[color:var(--text-muted,#6b7280)]">
          El cliente transfiere al alias, te manda el comprobante por WhatsApp, y vos activás la suscripción manualmente. Para automatizar con Pagopar: mirá la opción avanzada abajo.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-[color:var(--text-muted,#6b7280)]">Plan (texto para el mensaje)</span>
          <input
            value={customPlan}
            onChange={(e) => setCustomPlan(e.target.value)}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[color:var(--text-muted,#6b7280)]">Monto (Gs)</span>
          <input
            value={amountCents}
            onChange={(e) => setAmountCents(e.target.value)}
            className="block w-full rounded border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm font-mono"
          />
        </label>
      </div>

      <section className="grid gap-2 rounded bg-white p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[color:var(--text-muted,#6b7280)]">Alias de transferencia</p>
            <p className="font-mono">{PARAGU_AI_BANK_ALIAS}</p>
          </div>
          <button
            type="button"
            onClick={() => copy('alias', PARAGU_AI_BANK_ALIAS)}
            className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)]"
          >
            {copied === 'alias' ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--border,#e5e7eb)] pt-2">
          <div>
            <p className="text-xs text-[color:var(--text-muted,#6b7280)]">WhatsApp para el comprobante</p>
            <p className="font-mono">{PARAGU_AI_COMPROBANTE_WHATSAPP}</p>
          </div>
          <button
            type="button"
            onClick={() => copy('whatsapp', PARAGU_AI_COMPROBANTE_WHATSAPP)}
            className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)]"
          >
            {copied === 'whatsapp' ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Mensaje para enviar</p>
          <button
            type="button"
            onClick={() => copy('message', messageBody)}
            className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)]"
          >
            {copied === 'message' ? 'Copiado ✓' : 'Copiar mensaje'}
          </button>
        </div>
        <textarea
          readOnly
          value={messageBody}
          rows={14}
          className="block w-full rounded border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 font-mono text-xs leading-relaxed"
        />
      </section>

      <div className="flex flex-wrap gap-3">
        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#20b85a]"
          >
            Abrir WhatsApp con el cliente
          </a>
        ) : (
          <p className="text-xs text-[color:var(--text-muted,#9ca3af)]">
            El negocio no tiene WhatsApp cargado — copiá el mensaje y enviálo manualmente.
          </p>
        )}
      </div>
    </div>
  )
}
