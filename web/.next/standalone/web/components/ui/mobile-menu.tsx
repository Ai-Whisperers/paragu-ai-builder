"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const mobileMenuVariants = cva(
  "fixed inset-0 z-50 bg-[var(--background)] transition-transform duration-300 ease-in-out",
  {
    variants: {
      position: {
        left: "left-0 right-auto w-3/4 max-w-sm",
        right: "right-0 left-auto w-3/4 max-w-sm",
        top: "top-0 bottom-auto h-auto",
        bottom: "bottom-0 top-auto h-auto",
      },
      state: {
        open: "translate-x-0",
        closed: "",
      },
    },
    defaultVariants: {
      position: "right",
    },
  }
)

export interface MobileMenuProps extends VariantProps<typeof mobileMenuVariants> {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: "left" | "right" | "top" | "bottom"
}

export function MobileMenu({
  isOpen,
  onClose,
  children,
  position = "right",
}: MobileMenuProps) {
  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const getClosedTransform = () => {
    switch (position) {
      case "left":
        return "-translate-x-full"
      case "right":
        return "translate-x-full"
      case "top":
        return "-translate-y-full"
      case "bottom":
        return "translate-y-full"
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Menu */}
      <div
        className={cn(
          mobileMenuVariants({ position }),
          isOpen ? "translate-x-0 translate-y-0" : getClosedTransform()
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <span className="font-semibold text-[var(--text)]">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-[var(--surface-light)] transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5 text-[var(--text)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

// Hamburger Button component
export interface HamburgerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean
}

export function HamburgerButton({ className, isOpen, ...props }: HamburgerButtonProps) {
  return (
    <button
      className={cn(
        "p-2 rounded-md hover:bg-[var(--surface-light)] transition-colors lg:hidden",
        className
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      {...props}
    >
      <div className="w-6 h-5 relative flex flex-col justify-between">
        <span
          className={cn(
            "w-full h-0.5 bg-[var(--text)] transition-all duration-300 origin-center",
            isOpen && "rotate-45 translate-y-2"
          )}
        />
        <span
          className={cn(
            "w-full h-0.5 bg-[var(--text)] transition-all duration-300",
            isOpen && "opacity-0"
          )}
        />
        <span
          className={cn(
            "w-full h-0.5 bg-[var(--text)] transition-all duration-300 origin-center",
            isOpen && "-rotate-45 -translate-y-2"
          )}
        />
      </div>
    </button>
  )
}
