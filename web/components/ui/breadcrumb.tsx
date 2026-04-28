"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const breadcrumbVariants = cva(
  "flex flex-wrap items-center gap-2 text-sm",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        muted: "text-muted-foreground opacity-70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  items: Array<{
    label: string
    href?: string
    icon?: React.ReactNode
  }>
  separator?: React.ReactNode
}

export function Breadcrumb({
  className,
  variant,
  items,
  separator,
  ...props
}: BreadcrumbProps) {
  const defaultSeparator = (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  )

  return (
    <nav aria-label="Breadcrumb" {...props}>
      <ol className={cn(breadcrumbVariants({ variant }), className)}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-muted-foreground opacity-50">
                {separator || defaultSeparator}
              </span>
            )}
            {item.href && index < items.length - 1 ? (
              <a
                href={item.href}
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            ) : (
              <span
                className={cn(
                  "flex items-center gap-1.5",
                  index === items.length - 1
                    ? "font-medium text-foreground"
                    : ""
                )}
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
