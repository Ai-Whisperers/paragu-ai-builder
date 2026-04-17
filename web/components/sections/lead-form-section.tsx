'use client'

import { useRef, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export type LeadFormVariant = 'standard' | 'compact'

export interface LeadFormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'select' | 'textarea'
  required?: boolean
  options?: string[]
  placeholder?: string
}

export interface LeadFormSectionProps {
  variant?: LeadFormVariant
  title: string
  subtitle?: string
  submitLabel?: string
  successMessage?: string
  errorMessage?: string
  privacyLabel?: string
  privacyHref?: string
  marketingLabel?: string
  fields?: LeadFormField[]
  __siteSlug?: string
  __locale?: string
}

const DEFAULT_FIELDS: LeadFormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'country', label: 'Country of residence', type: 'text' },
  {
    name: 'programInterest',
    label: 'Program of interest',
    type: 'select',
    options: ['Base', 'Business', 'Investor', 'Land purchase', 'Not sure yet'],
  },
  { name: 'objective', label: 'What is your main objective?', type: 'textarea' },
]

export function LeadFormSection({
  variant = 'standard',
  title,
  subtitle,
  submitLabel = 'Send',
  successMessage = 'Thanks — we will be in touch within one business day.',
  errorMessage = 'Something went wrong. Please try again or email us directly.',
  privacyLabel = 'I agree to the privacy policy',
  privacyHref = '#',
  marketingLabel = 'I agree to receive relevant emails',
  fields = DEFAULT_FIELDS,
  __siteSlug,
  __locale,
}: LeadFormSectionProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')
  // eslint-disable-next-line react-hooks/purity
  const startedAtRef = useRef(Date.now())

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    if (!__siteSlug || !__locale) {
      setStatus('error')
      setErrorText('Site misconfigured (missing context)')
      return
    }
    setStatus('sending')
    const form = new FormData(evt.currentTarget)
    if (form.get('honey')) {
      setStatus('success')
      return
    }
    const startedAt = Number(form.get('startedAt') || 0)
    if (Date.now() - startedAt < 2000) {
      setStatus('error')
      setErrorText('Please slow down and retry')
      return
    }
    const payload: Record<string, unknown> = {
      siteSlug: __siteSlug,
      locale: __locale,
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: form.get('phone') ? String(form.get('phone')) : undefined,
      country: form.get('country') ? String(form.get('country')) : undefined,
      programInterest: form.get('programInterest')
        ? String(form.get('programInterest'))
        : undefined,
      objective: form.get('objective') ? String(form.get('objective')) : undefined,
      source: 'lead-form',
      referer: typeof window !== 'undefined' ? window.location.href : undefined,
      consent: {
        privacyPolicy: form.get('privacy') === 'on',
        marketing: form.get('marketing') === 'on',
      },
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}))
        setErrorText(detail.error || errorMessage)
        setStatus('error')
        return
      }
      setStatus('success')
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : errorMessage)
      setStatus('error')
    }
  }

  const compact = variant === 'compact'

  return (
    <section id="lead" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {status === 'success' ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-[var(--secondary)]/30 bg-[var(--surface-light)] p-8 text-center">
            <p className="text-lg font-medium text-[var(--primary)]">{successMessage}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={
              'mx-auto mt-10 grid gap-4 rounded-lg bg-[var(--surface-light)] p-6 sm:p-8 ' +
              (compact ? 'max-w-xl' : 'max-w-2xl sm:grid-cols-2')
            }
          >
            <input type="hidden" name="startedAt" value={startedAtRef.current} />
            <input
              type="text"
              name="honey"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {fields.map((f) => (
              <label
                key={f.name}
                className={
                  'flex flex-col gap-1 text-sm text-[var(--text)] ' +
                  (f.type === 'textarea' || compact ? 'sm:col-span-2' : '')
                }
              >
                <span>
                  {f.label}
                  {f.required && <span className="text-[var(--error)]">*</span>}
                </span>
                {f.type === 'textarea' ? (
                  <textarea
                    name={f.name}
                    required={f.required}
                    rows={4}
                    placeholder={f.placeholder}
                    className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  />
                ) : f.type === 'select' ? (
                  <select
                    name={f.name}
                    required={f.required}
                    className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  >
                    <option value="">—</option>
                    {f.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || 'text'}
                    name={f.name}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                  />
                )}
              </label>
            ))}

            <label className="flex items-start gap-2 text-sm text-[var(--text)] sm:col-span-2">
              <input type="checkbox" name="privacy" required className="mt-1" />
              <span>
                {privacyLabel}{' '}
                <a href={privacyHref} className="underline">
                  ↗
                </a>
              </span>
            </label>

            <label className="flex items-start gap-2 text-sm text-[var(--text)] sm:col-span-2">
              <input type="checkbox" name="marketing" className="mt-1" />
              <span>{marketingLabel}</span>
            </label>

            <div className="sm:col-span-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto"
              >
                {status === 'sending' ? '…' : submitLabel}
              </Button>
            </div>

            {status === 'error' && (
              <p className="text-sm text-[var(--error)] sm:col-span-2">{errorText || errorMessage}</p>
            )}
          </form>
        )}
      </Container>
    </section>
  )
}
