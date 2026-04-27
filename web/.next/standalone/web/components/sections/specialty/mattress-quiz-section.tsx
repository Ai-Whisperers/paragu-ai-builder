'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackQuizStart, trackQuizComplete } from '@/lib/analytics/tenant-events'

/**
 * Mattress recommendation quiz. Domain-specific product finder — maps
 * 5-6 user answers to a scored top-3 recommendation from the tenant's
 * catalog. Designed for Superspuma but the scoring rules live in the
 * content block so any mattress tenant can plug in their own rubric.
 *
 * Content shape:
 *   steps: [{ id, question, options: [{ value, label, scores: { <productId>: <n> } }] }]
 *   products: [{ id, name, description, priceFromLabel, ctaHref }]
 *
 * Each answer contributes points to each product via its `scores` map.
 * After the last step we sort products by total points and show the
 * top 3. Missing scores default to 0 — flexible enough that adding a
 * new product only means adding a score key to the relevant options.
 */

export interface QuizOption {
  value: string
  label: string
  /** Score contribution per candidate product. Missing = 0. */
  scores?: Record<string, number>
}

export interface QuizStep {
  id: string
  question: string
  helperText?: string
  options: QuizOption[]
}

export interface QuizProduct {
  id: string
  name: string
  description?: string
  priceFromLabel?: string
  ctaHref: string
  ctaLabel?: string
  badge?: string
}

export interface MattressQuizSectionProps {
  eyebrow?: string
  title: string
  subtitle?: string
  steps: QuizStep[]
  products: QuizProduct[]
  resultHeading?: string
  resultSubheading?: string
  /** How many top results to show (default 3). */
  topK?: number
  /** Override labels for navigation controls. */
  labels?: {
    next?: string
    back?: string
    restart?: string
    submit?: string
    step?: string
    of?: string
  }
}

const DEFAULT_LABELS = {
  next: 'Siguiente',
  back: 'Atrás',
  restart: 'Empezar de nuevo',
  submit: 'Ver mi recomendación',
  step: 'Paso',
  of: 'de',
}

export function MattressQuizSection({
  eyebrow,
  title,
  subtitle,
  steps = [],
  products = [],
  resultHeading,
  resultSubheading,
  topK = 3,
  labels: labelsProp,
}: MattressQuizSectionProps) {
  const labels = { ...DEFAULT_LABELS, ...(labelsProp ?? {}) }
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const startedRef = useRef(false)
  const completedRef = useRef(false)

  if (steps.length === 0 || products.length === 0) return null

  const current = steps[idx]
  const selected = answers[current.id]
  const isLast = idx === steps.length - 1

  const ranking = useMemo(() => {
    if (!done) return []
    const scores: Record<string, number> = {}
    for (const step of steps) {
      const answer = answers[step.id]
      if (!answer) continue
      const chosen = step.options.find((o) => o.value === answer)
      if (!chosen?.scores) continue
      for (const [productId, delta] of Object.entries(chosen.scores)) {
        scores[productId] = (scores[productId] ?? 0) + delta
      }
    }
    return products
      .map((p) => ({ product: p, score: scores[p.id] ?? 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }, [done, answers, steps, products, topK])

  function pick(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
    // First answer counts as funnel entry — dedupe via ref so restart
    // doesn't double-count unless the user actually restarts and picks again.
    if (!startedRef.current) {
      startedRef.current = true
      trackQuizStart({})
    }
  }

  function next() {
    if (isLast) {
      setDone(true)
    } else {
      setIdx(idx + 1)
    }
  }

  // Emit quiz_complete once when the results view is reached, with the
  // top-K recommendation slugs. Guarded by a ref so we don't re-fire
  // when the user tweaks `back → change answer → next → done` repeatedly.
  useEffect(() => {
    if (!done || completedRef.current) return
    completedRef.current = true
    trackQuizComplete({ recommended: ranking.map((r) => r.product.id) })
  }, [done, ranking])

  function back() {
    if (idx === 0) return
    setIdx(idx - 1)
  }

  function restart() {
    setAnswers({})
    setIdx(0)
    setDone(false)
    startedRef.current = false
    completedRef.current = false
  }

  return (
    <section id="quiz" className="bg-[var(--background)] py-16 sm:py-20 lg:py-24">
      <Container className="max-w-3xl">
        <AnimatedSectionHeader className="mb-10 text-center">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>
              {eyebrow}
            </p>
          )}
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--text-light)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {!done ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-lg">
            {/* Progress */}
            <div className="mb-6 flex items-center justify-between text-sm" style={{ color: 'var(--text-light)' }}>
              <span>
                {labels.step} {idx + 1} {labels.of} {steps.length}
              </span>
              <div className="h-1 w-1/2 overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${((idx + 1) / steps.length) * 100}%`,
                    backgroundColor: 'var(--primary)',
                  }}
                />
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {current.question}
              </legend>
              {current.helperText && (
                <p className="mb-6 text-sm" style={{ color: 'var(--text-light)' }}>
                  {current.helperText}
                </p>
              )}
              <div className="mt-6 grid gap-3">
                {current.options.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors',
                      selected === opt.value
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                        : 'border-[var(--border)] hover:border-[var(--primary)]/40',
                    )}
                  >
                    <input
                      type="radio"
                      name={current.id}
                      value={opt.value}
                      checked={selected === opt.value}
                      onChange={() => pick(opt.value)}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    <span style={{ color: 'var(--text)' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={back}
                disabled={idx === 0}
                className="min-h-[44px]"
              >
                <ChevronLeft size={16} /> {labels.back}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={next}
                disabled={!selected}
                className="min-h-[44px]"
              >
                {isLast ? labels.submit : labels.next}
                {!isLast && <ChevronRight size={16} />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-lg">
            {resultHeading && (
              <Heading level={3} className="mb-2 text-center">
                {resultHeading}
              </Heading>
            )}
            {resultSubheading && (
              <p className="mb-8 text-center text-[var(--text-light)]">{resultSubheading}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              {ranking.map((entry, i) => (
                <article
                  key={entry.product.id}
                  className={cn(
                    'rounded-xl border p-5 transition-transform',
                    i === 0
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 md:scale-105'
                      : 'border-[var(--border)]',
                  )}
                >
                  {i === 0 && (
                    <span className="mb-3 inline-block rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
                      Mejor match
                    </span>
                  )}
                  {entry.product.badge && i !== 0 && (
                    <span className="mb-3 inline-block rounded-full bg-[var(--secondary)]/10 px-3 py-1 text-xs font-medium" style={{ color: 'var(--secondary)' }}>
                      {entry.product.badge}
                    </span>
                  )}
                  <h4 className="mb-2 text-xl font-bold" style={{ color: 'var(--text)' }}>
                    {entry.product.name}
                  </h4>
                  {entry.product.priceFromLabel && (
                    <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                      {entry.product.priceFromLabel}
                    </p>
                  )}
                  {entry.product.description && (
                    <p className="mb-5 text-sm" style={{ color: 'var(--text-light)' }}>
                      {entry.product.description}
                    </p>
                  )}
                  <Button
                    variant={i === 0 ? 'primary' : 'outline'}
                    size="sm"
                    href={entry.product.ctaHref}
                    className="min-h-[44px] w-full"
                  >
                    <Check size={16} /> {entry.product.ctaLabel ?? 'Consultar'}
                  </Button>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="ghost" size="sm" onClick={restart} className="min-h-[44px]">
                <RotateCcw size={16} /> {labels.restart}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
