'use client'

import { Heading } from '@/components/ui/heading'

import QuoteFormComponent, { type QuoteFormField } from '@/components/location/quote-form'

interface QuoteFormSectionProps {
  title?: string
  subtitle?: string
  services?: string[]
  whatsappPhone?: string
  /** Structured-intake fields: overrides the default 4-field form. */
  fields?: QuoteFormField[]
  submitLabel?: string
  successTitle?: string
  successBody?: string
}

export function QuoteFormSection({
  title = 'Solicita un Presupuesto',
  subtitle,
  services = [],
  whatsappPhone,
  fields,
  submitLabel,
  successTitle,
  successBody,
}: QuoteFormSectionProps) {
  const handleSubmit = async (data: Record<string, string>) => {
    if (whatsappPhone) {
      // Build the WhatsApp message from whatever fields were submitted so
      // structured-intake forms (e.g. Dayah with genre/type/deadline/references)
      // send all their fields through, not just the legacy 4.
      const lines = Object.entries(data)
        .filter(([, v]) => v && String(v).trim())
        .map(([k, v]) => `*${k}:* ${v}`)
      const message = `Hola! Solicito presupuesto:\n\n${lines.join('\n')}`
      window.open(
        `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
        '_blank',
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return (
    <section id="presupuesto" className="bg-[var(--surface)] py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center mb-8">
          <Heading level={2} className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </Heading>
          {subtitle && (
            <p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="bg-[var(--background)] rounded-xl p-6 border border-[var(--border)]">
          <QuoteFormComponent
            onSubmit={handleSubmit}
            services={services}
            fields={fields}
            submitLabel={submitLabel}
            successTitle={successTitle}
            successBody={successBody}
          />
        </div>
      </div>
    </section>
  )
}