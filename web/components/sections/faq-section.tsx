'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface FAQItem {
  q: string
  a: string
}

export interface FAQSectionProps {
  title: string
  items: FAQItem[]
}

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[var(--surface-light)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[var(--secondary)]"
      >
        <span className="pr-4 font-medium text-[var(--text)]">{item.q}</span>
        <span
          className="flex-shrink-0 text-[var(--text-muted)] transition-transform duration-normal"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-normal"
        style={{
          maxHeight: isOpen ? '500px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="pb-5 text-[var(--text-muted)]">{item.a}</p>
      </div>
    </div>
  )
}

export function FAQSection({ title, items }: FAQSectionProps) {
  return (
    <section className="bg-[var(--surface)] py-16 sm:py-20">
      <Container size="md">
        <div className="mb-12 text-center">
          <Heading level={2}>{title}</Heading>
        </div>

        <div className="mx-auto max-w-3xl">
          {items.map((item, index) => (
            <FAQAccordion key={index} item={item} />
          ))}
        </div>
      </Container>
    </section>
  )
}
