interface Props {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, hint, required, children }: Props) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[color:var(--text,#111)]">
        {label}
        {required ? <span aria-hidden="true" className="ml-0.5 text-red-500">*</span> : null}
      </span>
      {children}
      {hint && !error ? (
        <p className="text-[11px] text-[color:var(--text-muted,#6b7280)]">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs text-red-500" role="alert">{error}</p>
      ) : null}
    </label>
  )
}
