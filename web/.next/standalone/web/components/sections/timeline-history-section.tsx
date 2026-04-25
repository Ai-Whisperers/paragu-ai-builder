'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface TimelineHistoryProps {
  title?: string
  subtitle?: string
  milestones: Array<{ date: string; title: string; description?: string }>
}

export function TimelineHistorySection({ title = 'Nuestra historia', subtitle, milestones }: TimelineHistoryProps) {
  if (!milestones?.length) return null
  return (
    <section className="py-16 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-10">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative border-l-2 border-[var(--surface-light)] pl-6 space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="relative">
                <div
                  className="absolute -left-[33px] top-1 w-4 h-4 rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                  {m.date}
                </div>
                <div className="font-semibold text-[var(--text)] mt-1">{m.title}</div>
                {m.description && (
                  <p className="text-sm text-[var(--text-muted)] mt-1">{m.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
