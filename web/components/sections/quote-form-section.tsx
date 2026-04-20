'use client'

import { Heading } from '@/components/ui/heading'

import QuoteFormComponent from '@/components/location/quote-form'

interface QuoteFormSectionProps {
  title?: string
  subtitle?: string
  services?: string[]
  whatsappPhone?: string
}

export function QuoteFormSection({
  title = 'Solicita un Presupuesto',
  subtitle,
  services = [],
  whatsappPhone
}: QuoteFormSectionProps) {
  const handleSubmit = async (data: unknown) => {
    if (whatsappPhone) {
      const formData = data as { name: string; phone: string; description: string; service?: string }
      const message = `Hola! Solicito presupuesto:\n\n*Nombre:* ${formData.name}\n*Teléfono:* ${formData.phone || 'No proporcionado'}\n*Servicio:* ${formData.service || 'General'}\n*Descripción:* ${formData.description}`
      window.open(`https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }
    await new Promise(resolve => setTimeout(resolve, 500))
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
          />
        </div>
      </div>
    </section>
  )
}