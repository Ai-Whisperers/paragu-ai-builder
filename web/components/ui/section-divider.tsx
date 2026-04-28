import { cn } from '@/lib/utils'

interface SectionDividerProps {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn('mx-auto h-px max-w-[1440px] bg-gradient-to-r from-transparent via-border to-transparent opacity-50', className)} />
  )
}
