import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-[var(--surface)] shadow-card',
        hover && 'transition-all duration-normal hover:shadow-card-hover hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-t-lg', className)}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-slow hover:scale-105"
        loading="lazy"
      />
    </div>
  )
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('text-lg font-semibold text-[var(--text)]', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('mt-1 text-sm text-[var(--text-muted)]', className)}>
      {children}
    </p>
  )
}
