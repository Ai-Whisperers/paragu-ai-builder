'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { MapPin, Phone, Mail, Clock, Send, Calendar } from 'lucide-react'

export interface ContactFormSectionProps {
  title: string
  subtitle?: string
  businessName: string
  address?: string
  neighborhood?: string
  city: string
  phone?: string
  email?: string
  whatsapp?: string
  calendarUrl?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
  programOptions?: string[]
}

interface FormData {
  name: string
  email: string
  phone: string
  country: string
  program: string
  objective: string
  source: string
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  country: '',
  program: '',
  objective: '',
  source: '',
}

const COUNTRIES = [
  'Paises Bajos', 'Alemania', 'Austria', 'Suiza',
  'Belgica', 'Suecia', 'Dinamarca', 'Noruega',
  'Finlandia', 'Francia', 'Reino Unido', 'Estados Unidos',
  'Espana', 'Otro',
]

export function ContactFormSection({
  title,
  subtitle,
  businessName,
  address,
  neighborhood,
  city,
  phone,
  email,
  whatsapp,
  calendarUrl,
  googleMapsUrl,
  hours,
  programOptions = ['Paraguay Business', 'Paraguay Investor Program', 'No estoy seguro'],
}: ContactFormSectionProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, businessName }),
      })

      if (res.ok) {
        setStatus('success')
        setForm(INITIAL_FORM)
      } else {
        console.error('[ContactForm] Submit failed:', res.status)
        setStatus('error')
      }
    } catch (error) {
      console.error('[ContactForm] Submit error:', error)
      setStatus('error')
    }
  }

  const inputClasses =
    'w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2'

  return (
    <section id="contacto" className="py-16 sm:py-20" style={{ backgroundColor: 'var(--surface)' }}>
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2} className="mb-2 text-center" style={{ color: 'var(--primary)' }}>
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto mb-12 max-w-xl text-center text-lg" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Contact Info */}
          <AnimateOnScroll>
            <div className="space-y-6">
              {address && (
                <div className="flex gap-3">
                  <MapPin size={20} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--text)' }}>Direccion</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                      {address}
                      {neighborhood && <>, {neighborhood}</>}
                      {city && <>, {city}</>}
                    </p>
                  </div>
                </div>
              )}

              {(phone || whatsapp) && (
                <div className="flex gap-3">
                  <Phone size={20} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--text)' }}>Telefono</h3>
                    {phone && (
                      <a href={`tel:${phone}`} className="block hover:underline" style={{ color: 'var(--secondary)' }}>
                        {phone}
                      </a>
                    )}
                    {whatsapp && (
                      <Button
                        variant="primary"
                        size="sm"
                        href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                        className="mt-2"
                      >
                        Escribir por WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {email && (
                <div className="flex gap-3">
                  <Mail size={20} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--text)' }}>Email</h3>
                    <a href={`mailto:${email}`} className="hover:underline" style={{ color: 'var(--secondary)' }}>
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {calendarUrl && (
                <div className="flex gap-3">
                  <Calendar size={20} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <h3 className="mb-1 text-lg font-semibold" style={{ color: 'var(--text)' }}>Agendar Consulta</h3>
                    <Button variant="secondary" size="sm" href={calendarUrl}>
                      Reservar horario
                    </Button>
                  </div>
                </div>
              )}

              {hours && Object.keys(hours).length > 0 && (
                <div className="flex gap-3">
                  <Clock size={20} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>Horarios</h3>
                    <dl className="space-y-1">
                      {Object.entries(hours).map(([day, time]) => (
                        <div key={day} className="flex justify-between gap-4 text-sm">
                          <dt style={{ color: 'var(--text)' }}>{day}</dt>
                          <dd style={{ color: 'var(--text-muted)' }}>{time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </AnimateOnScroll>

          {/* Right: Form */}
          <AnimateOnScroll stagger={1}>
            <div
              className="rounded-xl p-8"
              style={{ backgroundColor: 'var(--surface-light)', border: '1px solid var(--border)' }}
            >
              {status === 'success' ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
                  >
                    <Send size={28} />
                  </div>
                  <h3
                    className="mb-2 text-2xl font-bold"
                    style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    Mensaje enviado
                  </h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    Gracias por su interes. Nos pondremos en contacto dentro de 24-48 horas habiles.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-6"
                    onClick={() => setStatus('idle')}
                  >
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="cf-name" className="mb-1 block text-sm font-medium" style={{ color: 'var(--text)' }}>
                      Nombre completo <span style={{ color: 'var(--error, #dc2626)' }}>*</span>
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      required
                      aria-required="true"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClasses}
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                      placeholder="Juan Rodriguez"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="cf-email" className="mb-1 block text-sm font-medium" style={{ color: 'var(--text)' }}>
                      Email <span style={{ color: 'var(--error, #dc2626)' }}>*</span>
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      required
                      aria-required="true"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClasses}
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                      placeholder="juan@email.com"
                    />
                  </div>

                  {/* Phone + Country row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="cf-phone" className="mb-1 block text-sm font-medium" style={{ color: 'var(--text)' }}>
                        Telefono
                      </label>
                      <input
                        id="cf-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClasses}
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                        placeholder="+31 6 12345678"
                      />
                    </div>
                    <div>
                      <label htmlFor="cf-country" className="mb-1 block text-sm font-medium" style={{ color: 'var(--text)' }}>
                        Pais de residencia <span style={{ color: 'var(--error, #dc2626)' }}>*</span>
                      </label>
                      <select
                        id="cf-country"
                        name="country"
                        required
                        aria-required="true"
                        value={form.country}
                        onChange={handleChange}
                        className={inputClasses}
                        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                      >
                        <option value="">Seleccione...</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Program Interest */}
                  <div>
                    <label htmlFor="cf-program" className="mb-1 block text-sm font-medium" style={{ color: 'var(--text)' }}>
                      Programa de interes <span style={{ color: 'var(--error, #dc2626)' }}>*</span>
                    </label>
                    <select
                      id="cf-program"
                      name="program"
                      required
                      aria-required="true"
                      value={form.program}
                      onChange={handleChange}
                      className={inputClasses}
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                    >
                      <option value="">Seleccione...</option>
                      {programOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Objective */}
                  <div>
                    <label htmlFor="cf-objective" className="mb-1 block text-sm font-medium" style={{ color: 'var(--text)' }}>
                      Objetivo principal
                    </label>
                    <textarea
                      id="cf-objective"
                      name="objective"
                      rows={3}
                      value={form.objective}
                      onChange={handleChange}
                      className={inputClasses + ' resize-none'}
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                      placeholder="Cuentenos brevemente su situacion y objetivos..."
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <label htmlFor="cf-source" className="mb-1 block text-sm font-medium" style={{ color: 'var(--text)' }}>
                      Como nos conocio?
                    </label>
                    <select
                      id="cf-source"
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                      className={inputClasses}
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                    >
                      <option value="">Seleccione...</option>
                      <option value="web">Busqueda web</option>
                      <option value="social">Redes sociales</option>
                      <option value="referido">Referido</option>
                      <option value="youtube">YouTube</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {/* Error message */}
                  {status === 'error' && (
                    <p className="text-sm" style={{ color: 'var(--error, #dc2626)' }}>
                      Hubo un error al enviar el formulario. Intente nuevamente o contactenos directamente.
                    </p>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Enviando...' : 'Agendar Consulta Gratuita'}
                  </Button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  )
}
