import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--secondary)] text-white shadow-button hover:shadow-card-hover hover:-translate-y-0.5',
        secondary:
          'border-2 border-[var(--secondary)] text-[var(--secondary)] bg-transparent hover:bg-[var(--secondary)] hover:text-white',
        ghost: 'text-[var(--text)] hover:bg-[var(--surface-light)]',
        link: 'text-[var(--secondary)] underline-offset-4 hover:underline',
        outline:
          'border-2 border-[var(--text-muted)] text-[var(--text)] bg-transparent hover:bg-[var(--surface-light)]',
        default:
          'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-light)]',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-md',
        md: 'h-11 px-6 text-base rounded-md',
        lg: 'h-13 px-8 text-lg rounded-lg',
        icon: 'h-10 w-10 p-2 rounded-md',
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
  /**
   * When true, renders an inline spinner, sets aria-busy, and disables the
   * button. Use this on form submits — one prop, no manual `disabled` or
   * text-swap boilerplate.
   */
  isLoading?: boolean
  /** Optional text to display next to the spinner while loading. */
  loadingText?: string
  /**
   * When true, merges props onto the child element instead of rendering a button.
   * Useful for integrating with Link components or other wrappers.
   */
  asChild?: boolean
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  isLoading,
  loadingText,
  disabled,
  asChild,
  ...props
}: ButtonProps) {
  const spinnerSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'

  const content = isLoading ? (
    <>
      <Spinner className={spinnerSize} />
      <span>{loadingText ?? children}</span>
    </>
  ) : (
    children
  )

  if (href && !isLoading) {
    return (
      <a href={href} className={cn(buttonVariants({ variant, size, className }))}>
        {children}
      </a>
    )
  }

  // Handle asChild - clone the child element and merge props
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(buttonVariants({ variant, size }), className, (children.props as {className?: string}).className),
      disabled: disabled || isLoading,
      'aria-busy': isLoading || undefined,
      ...props,
    } as Record<string, unknown>)
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {content}
    </button>
  )
}
