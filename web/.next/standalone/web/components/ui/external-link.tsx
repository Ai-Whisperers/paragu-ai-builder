"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  showIcon?: boolean
  openInNewTab?: boolean
}

export function ExternalLink({
  className,
  children,
  showIcon = true,
  openInNewTab = true,
  ...props
}: ExternalLinkProps) {
  const newTabProps = openInNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {}

  return (
    <a
      className={cn(
        "inline-flex items-center gap-1.5 text-[var(--secondary)] hover:text-[var(--secondary)]/80 hover:underline transition-colors",
        className
      )}
      {...newTabProps}
      {...props}
    >
      {children}
      {showIcon && (
        <svg
          className="w-3.5 h-3.5 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  )
}
