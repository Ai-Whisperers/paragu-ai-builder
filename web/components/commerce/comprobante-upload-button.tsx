'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  siteSlug: string
  orderId: string
  alreadyUploaded: boolean
}

/**
 * Upload-a-comprobante-image widget on /checkout/transfer/[id].
 * Completely optional — the WhatsApp deep link remains the primary path.
 * Benefits: admin gets an audit trail, customer doesn't have to swap
 * to another app if they'd rather drop a screenshot here.
 *
 * Accepts: JPG / PNG / WebP / PDF, up to 5MB. The backing Supabase
 * bucket enforces the same limits.
 */
export function ComprobanteUploadButton({ siteSlug, orderId, alreadyUploaded }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [state, setState] = useState<
    | { kind: 'idle' }
    | { kind: 'uploading'; name: string }
    | { kind: 'error'; message: string }
    | { kind: 'done'; name: string }
  >({ kind: 'idle' })

  async function handleFile(file: File) {
    setState({ kind: 'uploading', name: file.name })
    const body = new FormData()
    body.append('file', file)
    try {
      const res = await fetch(`/api/storefront/${siteSlug}/orders/${orderId}/comprobante-upload`, {
        method: 'POST',
        body,
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(j.error ?? 'upload_failed')
      }
      setState({ kind: 'done', name: file.name })
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'upload_failed'
      setState({
        kind: 'error',
        message:
          msg === 'file_too_large'
            ? 'Archivo muy grande (máx 5 MB).'
            : msg === 'unsupported_mime'
              ? 'Solo JPG, PNG, WebP o PDF.'
              : 'No pudimos subir el archivo. Intentá de nuevo.',
      })
    }
  }

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void handleFile(f)
          e.target.value = '' // allow re-selecting same file after error
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={state.kind === 'uploading'}
        className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-light disabled:opacity-60"
      >
        <span aria-hidden="true">📎</span>
        {state.kind === 'uploading'
          ? `Subiendo ${state.name}…`
          : state.kind === 'done'
            ? '✓ Comprobante subido — subir otro'
            : alreadyUploaded
              ? 'Subir otro comprobante'
              : 'O subí el comprobante acá'}
      </button>
      <p className="mt-1 text-xs text-[color:var(--text-muted,#6b7280)]">
        JPG, PNG, WebP o PDF — máx 5 MB.
      </p>
      {state.kind === 'error' ? (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {state.message}
        </p>
      ) : null}
    </div>
  )
}
