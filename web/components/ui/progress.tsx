import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Progress bar primitive. Accepts `value` on 0–100 and renders a filled
 * track. Useful for nutrition %DV readouts, quota meters, etc. Purely
 * visual — callers handle aria-label / status text themselves.
 */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  indicatorClassName?: string
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress({ value = 0, max = 100, className, indicatorClassName, ...rest }, ref) {
    const clamped = Math.max(0, Math.min(max, value))
    const pct = max === 0 ? 0 : (clamped / max) * 100
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-[var(--surface-light)]',
          className,
        )}
        {...rest}
      >
        <div
          className={cn('h-full rounded-full bg-[var(--primary)] transition-all', indicatorClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
    )
  },
)
