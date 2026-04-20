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
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all ${
        isOpen ? 'bg-[var(--surface-light)]' : ''
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <span className="font-bold text-[var(--text)]">{question}</span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown size={20} />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '200px' : '0', opacity: isOpen ? 1 : 0 }}
      >
        <p className="px-6 pb-6 text-[var(--text-muted)]">{answer}</p>
      </div>
    </div>
  )
}
