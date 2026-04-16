import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--secondary)] text-white shadow-button hover:shadow-card-hover hover:-translate-y-0.5',
        secondary:
          'border-2 border-[var(--secondary)] text-[var(--secondary)] bg-transparent hover:bg-[var(--secondary)] hover:text-white',
        ghost: 'text-[var(--text)] hover:bg-[var(--surface-light)]',
        link: 'text-[var(--secondary)] underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-md',
        md: 'h-11 px-6 text-base rounded-md',
        lg: 'h-13 px-8 text-lg rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
}

export function Button({ className, variant, size, href, children, ...props }: ButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </button>
  )
}
