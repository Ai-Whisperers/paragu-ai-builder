import { cn } from '@/lib/utils'

interface Props {
  /** Average rating, 0–5. Renders 5 stars, partially filled via width trick. */
  rating: number
  /** Review count to render next to the stars ("(12)"). Hidden when undefined or 0. */
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASS: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function ReviewStars({ rating, count, size = 'sm', className }: Props) {
  const clamped = Math.max(0, Math.min(5, rating))
  const fullPct = (clamped / 5) * 100
  return (
    <div className={cn('inline-flex items-center gap-1', SIZE_CLASS[size], className)} aria-label={`${clamped.toFixed(1)} de 5`}>
      <span className="relative inline-block leading-none" aria-hidden="true">
        <span className="text-[color:var(--border,#e5e7eb)]">★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden text-amber-500"
          style={{ width: `${fullPct}%` }}
        >
          ★★★★★
        </span>
      </span>
      {typeof count === 'number' && count > 0 ? (
        <span className="text-[color:var(--text-muted,#6b7280)]">({count})</span>
      ) : null}
    </div>
  )
}
