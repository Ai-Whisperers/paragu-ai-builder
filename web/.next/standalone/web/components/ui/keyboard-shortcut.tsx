"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type KeyCombo = {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export interface KeyboardShortcutProps {
  shortcuts: Array<{
    combo: KeyCombo | string
    handler: () => void
    description?: string
    preventDefault?: boolean
  }>
  enabled?: boolean
}

export function KeyboardShortcut({ shortcuts, enabled = true }: KeyboardShortcutProps) {
  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ combo, handler, preventDefault = true }) => {
        const isMatch = checkKeyCombo(event, combo)
        
        if (isMatch) {
          if (preventDefault) {
            event.preventDefault()
          }
          handler()
        }
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts, enabled])

  return null
}

function checkKeyCombo(event: KeyboardEvent, combo: KeyCombo | string): boolean {
  if (typeof combo === "string") {
    return event.key.toLowerCase() === combo.toLowerCase()
  }

  const keyMatch = event.key.toLowerCase() === combo.key.toLowerCase()
  const ctrlMatch = combo.ctrl === undefined || event.ctrlKey === combo.ctrl
  const shiftMatch = combo.shift === undefined || event.shiftKey === combo.shift
  const altMatch = combo.alt === undefined || event.altKey === combo.alt
  const metaMatch = combo.meta === undefined || event.metaKey === combo.meta

  return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
}

// Hook for keyboard shortcuts
export function useKeyboardShortcut(
  combo: KeyCombo | string,
  handler: () => void,
  options: { enabled?: boolean; preventDefault?: boolean } = {}
) {
  const { enabled = true, preventDefault = true } = options

  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (checkKeyCombo(event, combo)) {
        if (preventDefault) {
          event.preventDefault()
        }
        handler()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [combo, handler, enabled, preventDefault])
}

// Display component for keyboard shortcuts
export interface KeyboardShortcutDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  shortcut: string
  size?: "sm" | "md" | "lg"
}

export function KeyboardShortcutDisplay({
  className,
  shortcut,
  size = "sm",
  ...props
}: KeyboardShortcutDisplayProps) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
    lg: "px-2.5 py-1 text-base",
  }

  return (
    <kbd
      className={cn(
        "inline-flex items-center gap-1 font-mono font-medium bg-[var(--surface-light)] text-[var(--text-muted)] rounded border border-[var(--border)]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {shortcut.split("+").map((key, index, arr) => (
        <React.Fragment key={index}>
          <span>{formatKey(key.trim())}</span>
          {index < arr.length - 1 && <span className="text-[var(--text-muted)] opacity-50">+</span>}
        </React.Fragment>
      ))}
    </kbd>
  )
}

function formatKey(key: string): string {
  const keyMap: Record<string, string> = {
    ctrl: "Ctrl",
    shift: "Shift",
    alt: "Alt",
    meta: "Cmd",
    command: "Cmd",
    cmd: "Cmd",
    enter: "Enter",
    escape: "Esc",
    esc: "Esc",
    delete: "Del",
    backspace: "Backspace",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
  }

  const normalized = key.toLowerCase()
  return keyMap[normalized] || key.charAt(0).toUpperCase() + key.slice(1)
}
