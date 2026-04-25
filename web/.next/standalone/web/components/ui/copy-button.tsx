"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { logger } from "@/lib/logger"

const copyButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-[var(--text-muted)] hover:text-[var(--secondary)]",
        primary: "bg-[var(--secondary)] text-white rounded-md hover:bg-[var(--secondary)]/90",
        ghost: "text-[var(--text)] hover:bg-[var(--surface-light)] rounded-md",
        outline: "border border-[var(--border)] text-[var(--text)] rounded-md hover:bg-[var(--surface-light)]",
      },
      size: {
        sm: "p-1.5 text-xs",
        md: "p-2 text-sm",
        lg: "p-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    VariantProps<typeof copyButtonVariants> {
  text: string
  onCopy?: () => void
  showIcon?: boolean
  successDuration?: number
  label?: string
  successLabel?: string
}

export function CopyButton({
  className,
  variant,
  size,
  text,
  onCopy,
  showIcon = true,
  successDuration = 2000,
  label = "Copy",
  successLabel = "Copied!",
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      
      setTimeout(() => {
        setCopied(false)
      }, successDuration)
    } catch (err) {
      logger.warn("Clipboard copy failed", { action: "copyButton.copy", error: err instanceof Error ? err.message : String(err) })
    }
  }

  const icon = copied ? (
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  ) : (
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
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  )

  return (
    <button
      onClick={handleCopy}
      className={cn(copyButtonVariants({ variant, size }), className)}
      aria-label={copied ? successLabel : label}
      {...props}
    >
      {showIcon && icon}
      {children || (copied ? successLabel : label)}
    </button>
  )
}

// Hook for copy functionality
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = React.useState<string | null>(null)

  const copy = React.useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      logger.debug("Clipboard API unavailable", { action: "copyButton.fallback" })
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      logger.warn("Copy fallback failed", { action: "copyButton.copyFallback", error: error instanceof Error ? error.message : String(error) })
      setCopiedText(null)
      return false
    }
  }, [])

  return { copiedText, copy }
}
