'use client'

export function FieldInput({
  name,
  label,
  hint,
  type = 'text',
  defaultValue = '',
  placeholder,
  maxLength,
  required,
}: {
  name: string
  label: string
  hint?: string
  type?: string
  defaultValue?: string
  placeholder?: string
  maxLength?: number
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
      />
      {hint ? <span className="mt-1 block text-xs text-[color:var(--text-muted,#9ca3af)]">{hint}</span> : null}
    </label>
  )
}

export function FieldTextarea({
  name,
  label,
  hint,
  defaultValue = '',
  rows = 4,
  maxLength,
  required,
}: {
  name: string
  label: string
  hint?: string
  defaultValue?: string
  rows?: number
  maxLength?: number
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        maxLength={maxLength}
        required={required}
        className="block w-full rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm"
      />
      {hint ? <span className="mt-1 block text-xs text-[color:var(--text-muted,#9ca3af)]">{hint}</span> : null}
    </label>
  )
}

export function SaveButton({
  saving,
  feedback,
  label = 'Guardar',
}: {
  saving: boolean
  feedback: { kind: 'ok' | 'error'; message: string } | null
  label?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saving ? 'Guardando…' : label}
      </button>
      {feedback ? (
        <span
          role={feedback.kind === 'error' ? 'alert' : 'status'}
          className={`text-xs ${feedback.kind === 'error' ? 'text-red-700' : 'text-green-700'}`}
        >
          {feedback.kind === 'ok' ? '✓ ' : ''}
          {feedback.message}
        </span>
      ) : null}
    </div>
  )
}
