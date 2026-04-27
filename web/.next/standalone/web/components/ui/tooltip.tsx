"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  delay?: number
  disabled?: boolean
}

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 200,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const updatePosition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    
    let x = 0
    let y = 0

    switch (side) {
      case "top":
        y = rect.top - 8
        x = rect.left + rect.width / 2
        break
      case "bottom":
        y = rect.bottom + 8
        x = rect.left + rect.width / 2
        break
      case "left":
        y = rect.top + rect.height / 2
        x = rect.left - 8
        break
      case "right":
        y = rect.top + rect.height / 2
        x = rect.right + 8
        break
    }

    setPosition({ x, y })
  }

  React.useEffect(() => {
    if (isVisible) {
      updatePosition()
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isVisible])

  const getTooltipClasses = () => {
    const baseClasses = "fixed z-50 px-3 py-2 text-sm bg-[var(--text)] text-white rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200"
    
    switch (side) {
      case "top":
        return cn(baseClasses, "-translate-x-1/2 -translate-y-full", align === "start" && "-translate-x-0", align === "end" && "-translate-x-full")
      case "bottom":
        return cn(baseClasses, "-translate-x-1/2 translate-y-0", align === "start" && "-translate-x-0", align === "end" && "-translate-x-full")
      case "left":
        return cn(baseClasses, "-translate-x-full -translate-y-1/2", align === "start" && "-translate-y-0", align === "end" && "-translate-y-full")
      case "right":
        return cn(baseClasses, "translate-x-0 -translate-y-1/2", align === "start" && "-translate-y-0", align === "end" && "-translate-y-full")
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={getTooltipClasses()}
          style={{
            left: position.x,
            top: position.y,
            opacity: isVisible ? 1 : 0,
          }}
          role="tooltip"
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-[var(--text)] rotate-45",
              side === "top" && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
              side === "bottom" && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
              side === "left" && "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
              side === "right" && "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </>
  )
}
