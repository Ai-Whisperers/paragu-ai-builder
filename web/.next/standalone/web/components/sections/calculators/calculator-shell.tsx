'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface CalculatorField {
  key: string
  label: string
  type?: 'number' | 'select' | 'text'
  defaultValue?: number | string
  min?: number
  max?: number
  step?: number
  options?: Array<{ value: string; label: string }>
}

export interface CalculatorResultRow {
  label: string
  value: string
  highlighted?: boolean
  muted?: boolean
}

export interface CalculatorShellProps {
  eyebrow?: string
  title: string
  subtitle?: string
  fields: CalculatorField[]
  compute: (values: Record<string, number | string>) => CalculatorResultRow[]
  disclaimer?: string
  ctaLabel?: string
  ctaHref?: string
  whatsapp?: string
  whatsappMessage?: string
  resultHeading?: string
  className?: string
}

export function CalculatorShell({
  eyebrow,
  title,
  subtitle,
  fields,
  compute,
  disclaimer,
  ctaLabel,
  ctaHref = '#contacto',
  whatsapp,
  whatsappMessage,
  resultHeading,
  className,
}: CalculatorShellProps) {
  const initial = Object.fromEntries(
    fields.map((f) => [f.key, f.defaultValue ?? (f.type === 'number' ? 0 : '')]),
  )
  const [values, setValues] = useState<Record<string, number | string>>(initial)

  const results = useMemo(() => compute(values), [values, compute])

  const updateValue = (key: string, raw: string) => {
    const field = fields.find((f) => f.key === key)
    const val = field?.type === 'number' ? (raw === '' ? 0 : Number(raw)) : raw
    setValues((v) => ({ ...v, [key]: val }))
  }

  return (
    <section className={`bg-[var(--surface)] py-16 sm:py-20 ${className ?? ''}`}>
      <Container>
        <AnimatedSectionHeader>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary)] mb-2">
              {eyebrow}
            </p>
          )}
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  {f.label}
                </label>
                {f.type === 'select' && f.options ? (
                  <select
                    value={String(values[f.key] ?? '')}
                    onChange={(e) => updateValue(f.key, e.target.value)}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                  >
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || 'number'}
                    value={values[f.key] ?? ''}
                    onChange={(e) => updateValue(f.key, e.target.value)}
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div className="mt-8 space-y-2 rounded-lg bg-[var(--surface-light)] p-6">
              {resultHeading && (
                <p className="text-sm font-semibold text-[var(--text-muted)] mb-3">
                  {resultHeading}
                </p>
              )}
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex justify-between text-sm ${
                    r.highlighted
                      ? 'text-lg font-bold text-[var(--primary)]'
                      : r.muted
                        ? 'text-[var(--text-muted)]'
                        : ''
                  }`}
                >
                  <span>{r.label}</span>
                  <span>{r.value}</span>
                </div>
              ))}
            </div>
          )}

          {disclaimer && (
            <p className="mt-4 text-xs text-[var(--text-muted)] italic">{disclaimer}</p>
          )}

          {(ctaLabel || whatsapp) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {ctaLabel && (
                <Button href={ctaHref} size="lg">
                  {ctaLabel}
                </Button>
              )}
              {whatsapp && (
                <Button
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage || '')}`}
                  variant="outline"
                  size="lg"
                >
                  Consultar por WhatsApp
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
