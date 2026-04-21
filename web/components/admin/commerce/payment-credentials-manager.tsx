'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CredentialPublicView } from '@/lib/commerce/payment-credentials'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'

interface Props {
  businessId: string
  initialCredentials: CredentialPublicView[]
}

interface ProviderTemplate {
  provider: PaymentProvider
  label: string
  fields: Array<{ key: string; label: string; placeholder?: string; type?: 'text' | 'password' }>
  publicConfigKeys?: Array<{ key: string; label: string; default?: string }>
  helpUrl?: string
}

const TEMPLATES: ProviderTemplate[] = [
  {
    provider: 'pagopar',
    label: 'Pagopar (Paraguay)',
    fields: [
      { key: 'public_token', label: 'Public Token', placeholder: 'p_xxx...' },
      { key: 'private_token', label: 'Private Token', placeholder: 's_xxx...', type: 'password' },
    ],
    publicConfigKeys: [{ key: 'environment', label: 'Entorno', default: 'sandbox' }],
    helpUrl: 'https://soporte.pagopar.com/portal/es/kb/articles/api-integracion-medios-pagos',
  },
  {
    provider: 'bancard',
    label: 'Bancard VPOS 2.0 (Phase 3 — direct cards)',
    fields: [
      { key: 'public_key', label: 'Public Key', placeholder: 'PK_xxx...' },
      { key: 'private_key', label: 'Private Key', placeholder: 'SK_xxx...', type: 'password' },
    ],
    publicConfigKeys: [{ key: 'environment', label: 'Entorno', default: 'sandbox' }],
  },
  {
    provider: 'dlocal',
    label: 'dLocal (LATAM cross-border)',
    fields: [
      { key: 'x_login', label: 'X-Login', placeholder: 'login_xxx' },
      { key: 'x_trans_key', label: 'X-Trans-Key', placeholder: 'key_xxx', type: 'password' },
      { key: 'secret_key', label: 'Secret Key (HMAC)', placeholder: 'secret_xxx', type: 'password' },
    ],
    publicConfigKeys: [{ key: 'country', label: 'País (ISO-2)', default: 'PY' }],
  },
]

export function PaymentCredentialsManager({ businessId, initialCredentials }: Props) {
  const router = useRouter()
  const [credentials, setCredentials] = useState(initialCredentials)
  const [openProvider, setOpenProvider] = useState<PaymentProvider | null>(null)

  const installed = new Set(credentials.map((c) => c.provider))

  const refresh = async () => {
    const res = await fetch(`/api/admin/commerce/${businessId}/payment-credentials`)
    const data = await res.json()
    setCredentials(data.credentials ?? [])
    router.refresh()
  }

  const handleSave = async (template: ProviderTemplate, secrets: Record<string, string>, publicConfig: Record<string, string>) => {
    const res = await fetch(`/api/admin/commerce/${businessId}/payment-credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: template.provider,
        secrets,
        publicConfig,
        status: 'active',
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? 'save_failed')
    }
    await refresh()
    setOpenProvider(null)
  }

  const handleDelete = async (provider: PaymentProvider) => {
    if (!confirm(`Quitar credenciales de ${provider}? Tu tienda dejará de poder cobrar con este proveedor.`)) return
    await fetch(`/api/admin/commerce/${businessId}/payment-credentials`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    })
    await refresh()
  }

  return (
    <div className="space-y-4">
      {credentials.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-6 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
          Aún no conectaste ningún proveedor de pagos. Empezá con Pagopar.
        </div>
      ) : (
        credentials.map((cred) => (
          <div key={cred.id} className="flex items-center justify-between rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4">
            <div>
              <p className="font-medium">{TEMPLATES.find((t) => t.provider === cred.provider)?.label ?? cred.provider}</p>
              <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
                {Object.entries(cred.secretPreviews)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' · ')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpenProvider(cred.provider)}
                className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-sm hover:bg-[color:var(--surface-muted,#f3f4f6)]"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cred.provider)}
                className="rounded border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
              >
                Quitar
              </button>
            </div>
          </div>
        ))
      )}

      <div>
        <h2 className="mb-2 mt-8 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Conectar otro proveedor</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {TEMPLATES.filter((t) => !installed.has(t.provider)).map((t) => (
            <button
              key={t.provider}
              type="button"
              onClick={() => setOpenProvider(t.provider)}
              className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4 text-left hover:bg-[color:var(--surface-muted,#f3f4f6)]"
            >
              <p className="font-medium">+ {t.label}</p>
            </button>
          ))}
        </div>
      </div>

      {openProvider && (
        <CredentialFormModal
          template={TEMPLATES.find((t) => t.provider === openProvider)!}
          existing={credentials.find((c) => c.provider === openProvider) ?? null}
          onSave={handleSave}
          onClose={() => setOpenProvider(null)}
        />
      )}
    </div>
  )
}

function CredentialFormModal({
  template,
  existing,
  onSave,
  onClose,
}: {
  template: ProviderTemplate
  existing: CredentialPublicView | null
  onSave: (template: ProviderTemplate, secrets: Record<string, string>, publicConfig: Record<string, string>) => Promise<void>
  onClose: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = new FormData(event.currentTarget)
    const secrets: Record<string, string> = {}
    for (const f of template.fields) {
      const v = String(form.get(f.key) ?? '').trim()
      if (v) secrets[f.key] = v
    }
    if (Object.keys(secrets).length === 0) {
      setError('Completá al menos un campo')
      setSubmitting(false)
      return
    }
    const publicConfig: Record<string, string> = {}
    for (const f of template.publicConfigKeys ?? []) {
      const v = String(form.get(`pc_${f.key}`) ?? '').trim()
      if (v) publicConfig[f.key] = v
    }
    try {
      await onSave(template, secrets, publicConfig)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'save_failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-[color:var(--surface,#fff)] p-6 shadow-xl"
      >
        <h3 className="mb-1 text-lg font-semibold">{template.label}</h3>
        {existing ? (
          <p className="mb-4 rounded bg-yellow-50 p-2 text-xs text-yellow-800">
            Estás reemplazando las credenciales actuales. Los valores existentes no se muestran por seguridad — pegá las nuevas claves completas.
          </p>
        ) : null}
        {template.helpUrl ? (
          <p className="mb-4 text-xs text-[color:var(--text-muted,#6b7280)]">
            <a href={template.helpUrl} target="_blank" rel="noreferrer" className="underline">
              ¿Dónde encuentro estas claves?
            </a>
          </p>
        ) : null}

        <div className="space-y-3">
          {template.fields.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">{f.label}</span>
              <input
                name={f.key}
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                autoComplete="off"
                className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm font-mono"
              />
            </label>
          ))}
          {template.publicConfigKeys?.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">{f.label}</span>
              <input
                name={`pc_${f.key}`}
                defaultValue={f.default}
                className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
              />
            </label>
          ))}
        </div>

        {error ? <p role="alert" className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-2 text-sm hover:bg-[color:var(--surface-muted,#f3f4f6)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}
