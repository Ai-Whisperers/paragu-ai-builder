import { cn } from '@/lib/utils'

interface CalcFieldProps {
  label: string
  children: React.ReactNode
  hint?: string
  className?: string
}

export function CalcLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('mb-2 block text-sm font-medium text-foreground', className)}>
      {children}
    </span>
  )
}

export function CalcInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}

export function CalcSelect({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-foreground focus:border-secondary focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
