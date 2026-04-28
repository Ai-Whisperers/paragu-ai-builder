"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const hoverCardVariants = cva(
  "group relative rounded-lg bg-background border border-border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg hover:-translate-y-1",
        subtle: "hover:shadow-md",
        lift: "hover:shadow-xl hover:-translate-y-2",
        glow: "hover:shadow-lg hover:shadow-[var(--secondary)]/20",
        scale: "hover:scale-[1.02]",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

export interface HoverCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof hoverCardVariants> {
  hoverContent?: React.ReactNode
  hoverDelay?: number
  showOverlay?: boolean
}

export function HoverCard({
  className,
  variant,
  padding,
  hoverContent,
  hoverDelay = 300,
  showOverlay = false,
  children,
  ...props
}: HoverCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true)
    }, hoverDelay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsHovered(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn(hoverCardVariants({ variant, padding }), className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      
      {hoverContent && isHovered && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg overflow-hidden">
          {showOverlay && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
          )}
          <div className="relative z-10 p-4">{hoverContent}</div>
        </div>
      )}
    </div>
  )
}

// Hover Card Image component
export interface HoverCardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: "video" | "square" | "wide" | "portrait"
  overlay?: React.ReactNode
  zoomOnHover?: boolean
}

export function HoverCardImage({
  className,
  aspectRatio = "video",
  overlay,
  zoomOnHover = false,
  alt = "",
  ...props
}: HoverCardImageProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
    portrait: "aspect-[3/4]",
  }

  return (
    <div className={cn("relative overflow-hidden rounded-t-lg", aspectClasses[aspectRatio])}>
      <img
        className={cn(
          "w-full h-full object-cover transition-transform duration-500",
          zoomOnHover && "group-hover:scale-110",
          className
        )}
        alt={alt}
        {...props}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          {overlay}
        </div>
      )}
    </div>
  )
}

// Hover Card Action component
export interface HoverCardActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function HoverCardAction({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: HoverCardActionProps) {
  const variantClasses = {
    default: "bg-surface-light text-foreground hover:bg-surface",
    primary: "bg-secondary text-white hover:bg-secondary/90",
    ghost: "bg-transparent text-foreground hover:bg-surface-light",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
