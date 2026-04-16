import { cn } from '@/lib/utils'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4
  as?: 'h1' | 'h2' | 'h3' | 'h4'
}

const headingStyles = {
  1: 'text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight',
  2: 'text-3xl sm:text-4xl font-bold leading-tight',
  3: 'text-xl sm:text-2xl font-semibold',
  4: 'text-lg font-semibold',
}

export function Heading({ level = 2, as, className, children, ...props }: HeadingProps) {
  const Tag = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4')

  return (
    <Tag
      className={cn(
        headingStyles[level],
        'font-[var(--font-heading)] text-[var(--text)]',
        className
      )}
      style={{ textTransform: 'var(--heading-transform)' as React.CSSProperties['textTransform'] }}
      {...props}
    >
      {children}
    </Tag>
  )
}
