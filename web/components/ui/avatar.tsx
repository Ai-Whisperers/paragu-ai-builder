"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--surface-light)] text-[var(--text)]",
  {
    variants: {
      size: {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
}

export function Avatar({ 
  className, 
  size, 
  src, 
  alt = "", 
  fallback,
  children,
  ...props 
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)
  
  const getFallback = () => {
    if (fallback) return fallback
    if (alt) {
      return alt
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return "?"
  }

  return (
    <div
      className={cn(avatarVariants({ size }), className)}
      role="img"
      aria-label={alt}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-medium">{getFallback()}</span>
      )}
      {children}
    </div>
  )
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <div 
      className={cn(
        "flex h-full w-full items-center justify-center bg-[var(--surface-light)] font-medium text-[var(--text)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function AvatarGroup({ 
  className, 
  children,
  max = 3,
  ...props 
}: { 
  className?: string
  children: React.ReactNode
  max?: number
}) {
  const childrenArray = React.Children.toArray(children)
  const visibleChildren = childrenArray.slice(0, max)
  const remainingCount = childrenArray.length - max

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleChildren}
      {remainingCount > 0 && (
        <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface)] border-2 border-[var(--background)] text-xs font-medium text-[var(--text)]">
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
