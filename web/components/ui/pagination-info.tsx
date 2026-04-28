"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PaginationInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  pageSize: number
  totalItems: number
  itemName?: string
  itemNamePlural?: string
  className?: string
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  itemName = "item",
  itemNamePlural = "items",
  className,
  ...props
}: PaginationInfoProps) {
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems)
  const endItem = Math.min(currentPage * pageSize, totalItems)

  if (totalItems === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)} {...props}>
        No {itemNamePlural} found
      </div>
    )
  }

  if (totalItems === 1) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)} {...props}>
        Showing 1 {itemName}
      </div>
    )
  }

  const name = endItem - startItem === 0 ? itemName : itemNamePlural

  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props}>
      Showing{" "}
      <span className="font-medium text-foreground">
        {startItem}-{endItem}
      </span>{" "}
      of{" "}
      <span className="font-medium text-foreground">
        {totalItems}
      </span>{" "}
      {itemNamePlural}
    </div>
  )
}

// Pagination controls component
export interface PaginationControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
  showFirstLast?: boolean
  className?: string
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
  className,
  ...props
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let start = currentPage - halfVisible
      let end = currentPage + halfVisible

      if (start < 1) {
        end += 1 - start
        start = 1
      }
      if (end > totalPages) {
        start -= end - totalPages
        end = totalPages
      }

      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push("...")
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <nav
      className={cn("flex items-center gap-1", className)}
      aria-label="Pagination"
      {...props}
    >
      {/* First Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-md text-sm transition-colors",
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-surface-light text-foreground"
          )}
          aria-label="Go to first page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-md text-sm transition-colors",
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-surface-light text-foreground"
        )}
        aria-label="Go to previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-2 text-muted-foreground">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                "min-w-[2rem] h-8 px-3 rounded-md text-sm font-medium transition-colors",
                currentPage === page
                  ? "bg-secondary text-white"
                  : "hover:bg-surface-light text-foreground"
              )}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-md text-sm transition-colors",
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-surface-light text-foreground"
        )}
        aria-label="Go to next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Last Page */}
      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-md text-sm transition-colors",
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-surface-light text-foreground"
          )}
          aria-label="Go to last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  )
}
