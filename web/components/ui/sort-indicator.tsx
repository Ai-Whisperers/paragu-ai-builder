"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

type SortDirection = "asc" | "desc" | null

const sortIndicatorVariants = cva(
  "inline-flex items-center gap-1 cursor-pointer select-none transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-secondary",
        muted: "text-muted-foreground hover:text-foreground",
      },
      active: {
        true: "font-medium",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
    },
  }
)

export interface SortIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onClick">,
    VariantProps<typeof sortIndicatorVariants> {
  direction: SortDirection
  onSort?: () => void
  label: string
}

export function SortIndicator({
  className,
  variant,
  direction,
  onSort,
  label,
  ...props
}: SortIndicatorProps) {
  return (
    <button
      onClick={onSort}
      className={cn(
        sortIndicatorVariants({ variant, active: direction !== null }),
        className
      )}
      aria-label={`Sort by ${label}${direction ? ` (${direction === "asc" ? "ascending" : "descending"})` : ""}`}
      aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
      {...props}
    >
      <span>{label}</span>
      <span className="inline-flex flex-col">
        <svg
          className={cn(
            "w-3 h-3 -mb-0.5",
            direction === "asc" ? "text-secondary" : "text-muted-foreground opacity-30"
          )}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 14l5-5 5 5z" />
        </svg>
        <svg
          className={cn(
            "w-3 h-3 -mt-0.5",
            direction === "desc" ? "text-secondary" : "text-muted-foreground opacity-30"
          )}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </span>
    </button>
  )
}

// Hook for managing sort state
export interface SortState<T> {
  column: keyof T | null
  direction: "asc" | "desc"
}

export function useSort<T>(initialColumn?: keyof T, initialDirection: "asc" | "desc" = "asc") {
  const [sort, setSort] = React.useState<SortState<T>>({
    column: initialColumn ?? null,
    direction: initialDirection,
  })

  const handleSort = React.useCallback((column: keyof T) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }))
  }, [])

  const sortedData = React.useCallback(
    (data: T[]) => {
      if (!sort.column) return data

      return [...data].sort((a, b) => {
        const aValue = a[sort.column!]
        const bValue = b[sort.column!]

        if (aValue < bValue) return sort.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sort.direction === "asc" ? 1 : -1
        return 0
      })
    },
    [sort]
  )

  return { sort, handleSort, sortedData }
}
