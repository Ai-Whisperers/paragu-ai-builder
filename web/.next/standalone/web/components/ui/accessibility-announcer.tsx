"use client"

import * as React from "react"

// Messages to announce to screen readers
type AnnouncementPriority = "polite" | "assertive" | "off"

interface Announcement {
  id: string
  message: string
  priority: AnnouncementPriority
  clearAfter?: number
}

// Context for managing announcements
const AccessibilityContext = React.createContext<{
  announce: (message: string, priority?: AnnouncementPriority, clearAfter?: number) => void
  clearAnnouncements: () => void
}>({
  announce: () => {},
  clearAnnouncements: () => {},
})

// Provider component
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([])

  const announce = React.useCallback((
    message: string,
    priority: AnnouncementPriority = "polite",
    clearAfter?: number
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    const announcement: Announcement = { id, message, priority, clearAfter }
    
    setAnnouncements((prev) => [...prev, announcement])

    if (clearAfter) {
      setTimeout(() => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      }, clearAfter)
    }
  }, [])

  const clearAnnouncements = React.useCallback(() => {
    setAnnouncements([])
  }, [])

  return (
    <AccessibilityContext.Provider value={{ announce, clearAnnouncements }}>
      {children}
      <AccessibilityAnnouncer announcements={announcements} />
    </AccessibilityContext.Provider>
  )
}

// Hook for using announcements
export function useAccessibility() {
  const context = React.useContext(AccessibilityContext)
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider")
  }
  return context
}

// Announcer component (renders visually hidden live regions)
interface AccessibilityAnnouncerProps {
  announcements: Announcement[]
}

function AccessibilityAnnouncer({ announcements }: AccessibilityAnnouncerProps) {
  const politeAnnouncements = announcements.filter((a) => a.priority === "polite")
  const assertiveAnnouncements = announcements.filter((a) => a.priority === "assertive")

  return (
    <>
      {/* Polite announcements - will be read after current speech */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeAnnouncements.map((a) => (
          <div key={a.id}>{a.message}</div>
        ))}
      </div>

      {/* Assertive announcements - will interrupt current speech */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveAnnouncements.map((a) => (
          <div key={a.id}>{a.message}</div>
        ))}
      </div>
    </>
  )
}

// Standalone announcer component
export interface AccessibilityAnnouncerComponentProps {
  message?: string
  priority?: AnnouncementPriority
  clearAfter?: number
  onClear?: () => void
}

export function AccessibilityAnnouncerComponent({
  message,
  priority = "polite",
  clearAfter,
  onClear,
}: AccessibilityAnnouncerComponentProps) {
  const [announcements, setAnnouncements] = React.useState<string[]>([])

  React.useEffect(() => {
    if (message) {
      setAnnouncements((prev) => [...prev, message])
      
      if (clearAfter) {
        const timer = setTimeout(() => {
          setAnnouncements((prev) => prev.slice(1))
          onClear?.()
        }, clearAfter)
        return () => clearTimeout(timer)
      }
    }
  }, [message, clearAfter, onClear])

  if (announcements.length === 0) return null

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcements[announcements.length - 1]}
    </div>
  )
}

// Helper for announcing page changes
export function usePageAnnouncement() {
  const { announce } = useAccessibility()

  const announcePageChange = React.useCallback((
    pageName: string,
    additionalInfo?: string
  ) => {
    const message = additionalInfo
      ? `Navigated to ${pageName}. ${additionalInfo}`
      : `Navigated to ${pageName}`
    announce(message, "polite", 1000)
  }, [announce])

  const announceLoading = React.useCallback((message: string) => {
    announce(message, "assertive")
  }, [announce])

  const announceComplete = React.useCallback((message: string) => {
    announce(message, "polite", 1000)
  }, [announce])

  const announceError = React.useCallback((message: string) => {
    announce(message, "assertive", 5000)
  }, [announce])

  return {
    announcePageChange,
    announceLoading,
    announceComplete,
    announceError,
  }
}

// Utility for announcing form validation errors
export function useFormAnnouncements() {
  const { announce } = useAccessibility()

  const announceFieldError = React.useCallback((fieldName: string, error: string) => {
    announce(`${fieldName}: ${error}`, "assertive", 3000)
  }, [announce])

  const announceFormSuccess = React.useCallback((message?: string) => {
    announce(message || "Form submitted successfully", "polite", 2000)
  }, [announce])

  const announceFormErrors = React.useCallback((errorCount: number) => {
    announce(
      `Form has ${errorCount} error${errorCount === 1 ? "" : "s"}. Please review and correct.`,
      "assertive",
      5000
    )
  }, [announce])

  return {
    announceFieldError,
    announceFormSuccess,
    announceFormErrors,
  }
}
