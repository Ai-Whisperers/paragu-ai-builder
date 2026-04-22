'use client'

import { useEffect, useState } from 'react'

interface Props {
  businessId: string
  orderId: string
  uploadedAt: string
}

/**
 * Renders a preview + "Ver comprobante" button on the admin order
 * detail page. Fetches a fresh 15-minute signed URL on mount; never
 * persists the URL in the DOM beyond the current session.
 */
export function ComprobanteViewer({ businessId, orderId, uploadedAt }: Props) {
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'ready'; url: string }
    | { kind: 'error'; message: string }
  >({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(`/api/admin/commerce/${businessId}/orders/${orderId}/comprobante-url`)
        if (!res.ok) throw new Error('sign_failed')
        const j = (await res.json()) as { url: string }
        if (!cancelled) setState({ kind: 'ready', url: j.url })
      } catch {
        if (!cancelled) setState({ kind: 'error', message: 'No se pudo cargar el comprobante.' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [businessId, orderId])

  const isImage = state.kind === 'ready' && !state.url.includes('.pdf?')

  return (
    <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
      <p className="text-xs font-semibold uppercase text-green-900">
        Comprobante subido — {new Date(uploadedAt).toLocaleString('es-PY')}
      </p>
      {state.kind === 'loading' ? (
        <p className="mt-2 text-xs text-green-800">Cargando vista previa…</p>
      ) : state.kind === 'error' ? (
        <p className="mt-2 text-xs text-red-700">{state.message}</p>
      ) : isImage ? (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.url}
            alt="Comprobante de transferencia"
            className="h-24 w-24 rounded border border-[color:var(--border,#e5e7eb)] object-cover"
          />
          <a
            href={state.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[color:var(--primary,#111)] underline"
          >
            Ver tamaño completo →
          </a>
        </div>
      ) : (
        <a
          href={state.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-[color:var(--primary,#111)] underline"
        >
          Abrir comprobante (PDF) →
        </a>
      )}
    </div>
  )
}
