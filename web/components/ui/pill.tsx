import { cn } from '@/lib/utils'

interface PillProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
  count?: number
  /** Optional emoji/icon displayed before label */
  icon?: string
}

export function Pill({ active, onClick, children, className, count, icon }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]',
        active
          ? 'border-[color:var(--primary,#111)] bg-primary text-[color:var(--primary-foreground,#fff)]'
          : 'border-[color:var(--border,#e5e7eb)] bg-surface hover:bg-surface-light',
        className,
      )}
    >
      {icon ? <span aria-hidden="true" className="mr-1">{icon}</span> : null}
      {children}
      {typeof count === 'number' && count >= 2 ? (
        <span className="ml-1 opacity-70">({count})</span>
      ) : null}
    </button>
  )
}

/** Active filter chip with X button to remove */
export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full bg-surface-light py-1 pl-2.5 pr-1.5 text-xs transition-colors hover:bg-[color:var(--border,#e5e7eb)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]"
      aria-label={`Quitar filtro: ${label}`}
    >
      <span>{label}</span>
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6l12 12M6 18L18 6" />
      </svg>
    </button>
  )
}

/** Price display chip — used in quick filters */
export function PriceChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]',
        active
          ? 'border-[color:var(--secondary,#b8860b)] bg-[color:var(--secondary,#b8860b)] text-white'
          : 'border-[color:var(--border,#e5e7eb)] bg-surface hover:bg-surface-light',
      )}
    >
      {label}
    </button>
  )
}
