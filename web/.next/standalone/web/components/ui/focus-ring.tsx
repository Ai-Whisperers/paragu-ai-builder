"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const focusRingVariants = cva(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "focus-visible:ring-[var(--secondary)]",
        primary: "focus-visible:ring-[var(--primary)]",
        error: "focus-visible:ring-red-500",
        success: "focus-visible:ring-green-500",
      },
      offset: {
        default: "focus-visible:ring-offset-2",
        none: "focus-visible:ring-offset-0",
        sm: "focus-visible:ring-offset-1",
        lg: "focus-visible:ring-offset-4",
      },
      width: {
        default: "focus-visible:ring-2",
        sm: "focus-visible:ring-1",
        lg: "focus-visible:ring-4",
      },
    },
    defaultVariants: {
      variant: "default",
      offset: "default",
      width: "default",
    },
  }
)

export interface FocusRingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof focusRingVariants> {
  asChild?: boolean
}

export function FocusRing({
  className,
  variant,
  offset,
  width,
  children,
  ...props
}: FocusRingProps) {
  return (
    <div className={cn(focusRingVariants({ variant, offset, width }), className)} {...props}>
      {children}
    </div>
  )
}

// Focus ring style constants for use in other components
export const focusRingStyles = {
  default: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2",
  primary: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
  error: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
  success: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2",
  input: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-0",
  button: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2",
}

// Utility to combine focus ring with other classes
export function withFocusRing(
  baseClasses: string,
  variant: keyof typeof focusRingStyles = "default"
): string {
  return cn(baseClasses, focusRingStyles[variant])
}
