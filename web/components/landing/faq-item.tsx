'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Accordion-style FAQ row used on the marketing homepage. Controlled by
 * local state — each item opens/closes independently. Extracted from
 * app/page.tsx so landing composition stays focused.
 */
export function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string
  answer: string
  /**
   * Per BUG_HUNT_500 #327, the first FAQ row should default open so the
   * answer is visible without an extra click. Pass `defaultOpen` on the
   * first item only.
   */
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={`rounded-2xl border border-border bg-surface transition-all ${
        isOpen ? 'bg-surface-light' : ''
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <span className="font-bold text-foreground">{question}</span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown size={20} />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0 }}
      >
        <p className="px-6 pb-6 text-muted-foreground">{answer}</p>
      </div>
    </div>
  )
}
