import { cn } from '@/lib/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizes = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-[1400px]',
  xl: 'max-w-[1600px]',
  full: 'max-w-full',
}

export function Container({ size = 'lg', className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', sizes[size], className)} {...props}>
      {children}
    </div>
  )
}
