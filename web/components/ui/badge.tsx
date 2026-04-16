import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-[var(--secondary)] text-white',
        outline: 'border border-[var(--secondary)] text-[var(--secondary)]',
        muted: 'bg-[var(--surface-light)] text-[var(--text-muted)]',
        success: 'bg-[var(--success)] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
