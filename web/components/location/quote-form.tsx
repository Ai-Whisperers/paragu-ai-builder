'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface QuoteFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'url' | 'select' | 'radio' | 'date' | 'textarea'
  required?: boolean
  options?: string[]
  placeholder?: string
  help?: string
}

interface QuoteFormProps {
  onSubmit: (data: Record<string, string>) => Promise<void>
  /** Legacy: list of service names for the service dropdown. */
  services?: string[]
  /**
   * Optional custom field list. When provided, overrides the default 5-field form.
   * Used for tenants with structured-intake requirements (e.g. Dayah LitWorks
   * needs genre, cover type, references, deadline BEFORE quoting per T&C).
   */
  fields?: QuoteFormField[]
  submitLabel?: string
  successTitle?: string
  successBody?: string
}

const DEFAULT_FIELDS: QuoteFormField[] = [
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Teléfono', type: 'tel' },
  { name: 'description', label: 'Describe tu proyecto o necesidad', type: 'textarea', required: true },
]

export default function QuoteForm({
  onSubmit,
  services = [],
  fields,
  submitLabel = 'Solicitar Presupuesto',
  successTitle = '¡Solicitud enviada!',
  successBody = 'Te contactaremos con tu presupuesto pronto.',
}: QuoteFormProps) {
  // If a structured `fields` array is supplied, use it. Otherwise fall back to
  // the legacy 4-field form plus an optional service dropdown for backwards
  // compat with existing tenants.
  const effectiveFields: QuoteFormField[] = fields
    ? fields
    : services.length > 0
    ? [
        ...DEFAULT_FIELDS.slice(0, 3),
        { name: 'service', label: 'Tipo de servicio', type: 'select', options: services },
        DEFAULT_FIELDS[3],
      ]
    : DEFAULT_FIELDS

  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(effectiveFields.map((f) => [f.name, '']))
  )
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    await onSubmit(formData)
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="bg-[var(--color-success-surface)] border border-[var(--color-success)] rounded-xl p-6 text-center">
        <svg
          className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-semibold text-[var(--color-success)]">{successTitle}</h3>
        <p className="text-[var(--color-success)] text-sm mt-2">{successBody}</p>
      </div>
    )
  }

  const renderField = (f: QuoteFormField) => {
    const commonCls =
      'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary'
    const inputProps = {
      name: f.name,
      required: f.required,
      value: formData[f.name] || '',
      onChange: handleChange,
      className: commonCls,
      placeholder: f.placeholder,
    }
    if (f.type === 'textarea') {
      return <textarea {...inputProps} rows={4} />
    }
    if (f.type === 'select') {
      return (
        <select {...inputProps}>
          <option value="">—</option>
          {(f.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }
    if (f.type === 'radio') {
      return (
        <div className="flex flex-wrap gap-4">
          {(f.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={f.name}
                value={opt}
                checked={formData[f.name] === opt}
                onChange={handleChange}
                required={f.required}
              />
              {opt}
            </label>
          ))}
        </div>
      )
    }
    return <input type={f.type} {...inputProps} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {effectiveFields.map((f) => (
        <div key={f.name}>
          <label className="block text-sm text-gray-700 mb-1">
            {f.label}
            {f.required && ' *'}
          </label>
          {renderField(f)}
          {f.help && <p className="mt-1 text-xs text-gray-500">{f.help}</p>}
        </div>
      ))}

      <Button
        type="submit"
        size="lg"
        isLoading={status === 'submitting'}
        loadingText="Enviando…"
        className="w-full bg-primary hover:opacity-90"
      >
        {submitLabel}
      </Button>
    </form>
  )
}
