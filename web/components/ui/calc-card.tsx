import { cn } from '@/lib/utils'

interface CalcCardProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const maxW: Record<string, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
}

export function CalcCard({ size = 'md', className, children }: CalcCardProps) {
  return (
    <div
      className={cn(
        'font-heading mx-auto mt-12 max-w-4xl rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10',
        maxW[size] !== 'max-w-4xl' && maxW[size],
        className,
      )}
    >
      {children}
    </div>
  )
}
