'use client'
import { Section } from '@/components/ui/section'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useEffect, useState } from 'react'

export interface CountdownTimerProps {
  title?: string
  subtitle?: string
  /** ISO 8601 target date. */
  targetDate: string
  expiredMessage?: string
  labels?: { days: string; hours: string; minutes: string; seconds: string }
  ctaText?: string
  ctaHref?: string
}

function diff(target: Date) {
  const ms = target.getTime() - Date.now()
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export function CountdownTimerSection({
  title,
  subtitle,
  targetDate,
  expiredMessage = 'Este evento ya comenzó.',
  labels = { days: 'dias', hours: 'horas', minutes: 'min', seconds: 'seg' },
  ctaText,
  ctaHref,
}: CountdownTimerProps) {
  const target = new Date(targetDate)
  const [remaining, setRemaining] = useState(() => diff(target))

  useEffect(() => {
    const t = setInterval(() => setRemaining(diff(target)), 1000)
    return () => clearInterval(t)
  }, [targetDate]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Section spacing="sm" background="surface">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {title && <Heading level={2}>{title}</Heading>}
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}

          {remaining ? (
            <div className="mt-6 flex items-center justify-center gap-4">
              {(['days', 'hours', 'minutes', 'seconds'] as const).map((k) => (
                <div
                  key={k}
                  className="bg-background rounded-lg px-4 py-3 min-w-[72px]"
                >
                  <div className="text-xl sm:text-3xl font-bold text-primary">
                    {String(remaining[k]).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {labels[k]}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-lg font-semibold text-foreground">{expiredMessage}</p>
          )}

          {ctaText && ctaHref && remaining && (
            <a
              href={ctaHref}
              className="inline-block mt-6 bg-primary text-[var(--primary-foreground)] px-6 py-2 rounded"
            >
              {ctaText}
            </a>
          )}
        </div>
      </Container>
    </Section>
  )
}
