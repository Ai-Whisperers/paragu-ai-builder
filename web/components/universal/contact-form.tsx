'use client'

import { useState } from 'react'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'

interface ContactFormProps {
  /** Optional — forwarded alongside the lead for admin routing. */
  businessEmail?: string
  topics?: string[]
  showPhone?: boolean
  showSubject?: boolean
  successMessage?: string
  /** Site slug so the API can route the lead to the right integration set. */
  siteSlug?: string
  /** Locale — defaults to es, used for welcome email + CRM tag. */
  locale?: string
}

const FormSchema = z.object({
  name: z.string().min(2, 'Ingresá al menos 2 caracteres').max(200),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[\d\s+()-]{6,40}$/.test(v), 'Teléfono inválido'),
  subject: z.string().max(120).optional(),
  message: z.string().min(5, 'Escribí un mensaje más completo').max(2000),
})

type FieldErrors = Partial<Record<keyof z.infer<typeof FormSchema>, string>>

export default function ContactForm({
  businessEmail: _businessEmail,
  topics = [],
  showPhone = true,
  showSubject = true,
  successMessage = '¡Mensaje enviado! Te contactaremos pronto.',
  siteSlug,
  locale = 'es',
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleBlur = (name: keyof FieldErrors) => {
    const partial = FormSchema.pick({ [name]: true } as Record<string, true>).safeParse({
      [name]: formData[name],
    })
    if (!partial.success) {
      const issue = partial.error.issues[0]
      setFieldErrors((prev) => ({ ...prev, [name]: issue?.message || 'Valor inválido' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = FormSchema.safeParse(formData)
    if (!parsed.success) {
      const errs: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors
        if (!errs[key]) errs[key] = issue.message
      }
      setFieldErrors(errs)
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteSlug: siteSlug || 'unknown',
          locale,
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          objective: parsed.data.message,
          programInterest: parsed.data.subject,
          source: 'contact-form',
          referer: typeof window !== 'undefined' ? window.location.href : undefined,
          consent: { marketing: false, privacyPolicy: true },
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const msg =
          typeof body?.error === 'string'
            ? 'No pudimos enviar tu mensaje. Intenta de nuevo.'
            : 'Hubo un error inesperado. Intenta de nuevo.'
        setErrorMessage(msg)
        setStatus('error')
        logger.warn('Contact form POST non-2xx', {
          action: 'contactForm.submit',
          httpStatus: res.status,
        })
        return
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      logger.warn('Contact form submission failed', {
        action: 'contactForm.submit',
        error: err instanceof Error ? err.message : String(err),
      })
      setStatus('error')
      setErrorMessage('Hubo un error. Por favor intenta de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-[var(--color-success-surface)] border border-[var(--color-success)] rounded-xl p-6 text-center"
      >
        <svg
          className="w-12 h-12 text-[var(--color-success)] mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-[var(--color-success)] font-medium">{successMessage}</p>
        <Button
          variant="link"
          className="mt-4"
          onClick={() => setStatus('idle')}
        >
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  const inputCls =
    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors'
  const errorCls = 'border-[var(--color-error)]'
  const okCls = 'border-gray-300'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Envíanos un mensaje</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            className={`${inputCls} ${fieldErrors.name ? errorCls : okCls}`}
            placeholder="Tu nombre"
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className="mt-1 text-sm text-[var(--color-error)]">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
              className={`${inputCls} ${fieldErrors.email ? errorCls : okCls}`}
              placeholder="tu@email.com"
            />
            {fieldErrors.email && (
              <p id="contact-email-error" className="mt-1 text-sm text-[var(--color-error)]">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {showPhone && (
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                className={`${inputCls} ${fieldErrors.phone ? errorCls : okCls}`}
                placeholder="+595 9xx xxx xxx"
              />
              {fieldErrors.phone && (
                <p id="contact-phone-error" className="mt-1 text-sm text-[var(--color-error)]">
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          )}
        </div>

        {showSubject && topics.length > 0 && (
          <div>
            <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
              Asunto
            </label>
            <select
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`${inputCls} ${okCls}`}
            >
              <option value="">Selecciona un asunto</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            onBlur={() => handleBlur('message')}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
            className={`${inputCls} ${fieldErrors.message ? errorCls : okCls} resize-none`}
            placeholder="¿En qué podemos ayudarte?"
          />
          {fieldErrors.message && (
            <p id="contact-message-error" className="mt-1 text-sm text-[var(--color-error)]">
              {fieldErrors.message}
            </p>
          )}
        </div>

        {status === 'error' && errorMessage && (
          <div
            role="alert"
            className="text-[var(--color-error)] text-sm bg-[var(--color-error-surface)] border border-[var(--color-error)] rounded-lg p-3"
          >
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[var(--primary)] hover:opacity-90"
          size="lg"
          isLoading={status === 'submitting'}
          loadingText="Enviando…"
        >
          Enviar mensaje
        </Button>
      </div>
    </form>
  )
}
