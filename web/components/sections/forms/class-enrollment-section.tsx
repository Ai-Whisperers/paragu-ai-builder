'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Send } from 'lucide-react'

export interface CourseOption {
  id: string
  name: string
}

export interface ClassEnrollmentSectionProps {
  title?: string
  subtitle?: string
  courses?: CourseOption[]
  phone: string
  variant?: 'form' | 'compact'
  __locale?: string
}

export function ClassEnrollmentSection({
  title = 'Inscribite en un curso',
  subtitle = 'Completá el formulario y te contactamos',
  courses = [],
  phone,
  variant = 'form',
}: ClassEnrollmentSectionProps) {
  const [courseId, setCourseId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone2, setPhone2] = useState('')

  const selectedCourse = courses.find((c) => c.id === courseId)
  const isValid = courseId && name

  const buildUrl = () => {
    const msg = `Hola! Quiero inscribirme:%0A- Curso: ${selectedCourse?.name || courseId}%0A- Nombre: ${name}%0A- Email: ${email}%0A- Teléfono: ${phone2}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

  if (variant === 'compact') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-sm">
            <Heading level={3} className="mb-4">{title}</Heading>
            <div className="space-y-3">
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="">Seleccioná un curso</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              {isValid && (
                <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                  <Send className="h-4 w-4" /> Inscribirme por WhatsApp
                </a>
              )}
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Curso</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none">
                <option value="">Seleccioná un curso</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
              <input type="tel" value={phone2} onChange={(e) => setPhone2(e.target.value)} placeholder="+595 981 000 000" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-secondary focus:outline-none" />
            </div>
            {isValid && (
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Enviar inscripción
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
