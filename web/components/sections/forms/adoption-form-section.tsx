'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Heart, Send, Check } from 'lucide-react'

export interface AdoptionPet {
  name: string
  id: string
}

export interface AdoptionFormSectionProps {
  title?: string
  subtitle?: string
  pets?: AdoptionPet[]
  requirements?: string[]
  phone: string
  variant?: 'multi-step' | 'form'
  __locale?: string
}

export function AdoptionFormSection({
  title = 'Formulario de adopción',
  subtitle = 'Ayudanos a encontrar el hogar perfecto',
  pets = [],
  requirements = ['Ser mayor de edad', 'Tener patio cerrado', 'Capacidad económica para veterinaria', 'Fotos del hogar'],
  phone,
  variant = 'form',
}: AdoptionFormSectionProps) {
  const [step, setStep] = useState(1)
  const [petId, setPetId] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone2, setPhone2] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [hasYard, setHasYard] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const selectedPet = pets.find((p) => p.id === petId)

  const buildUrl = () => {
    const msg = `Hola! Quiero adoptar:%0A- Animal: ${selectedPet?.name || petId}%0A- Nombre: ${fullName}%0A- Teléfono: ${phone2}%0A- Email: ${email}%0A- Dirección: ${address}%0A- Patio cerrado: ${hasYard ? 'Sí' : 'No'}`
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`
  }

  const canSubmit = petId && fullName && phone2 && agreed

  if (variant === 'multi-step') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-lg">
            <div className="mb-6 text-center">
              <Heart className="mx-auto mb-2 h-8 w-8 text-primary" />
              <Heading level={2}>{title}</Heading>
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="mb-6 flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${s <= step ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground'}`}>{s}</div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
                <Heading level={3}>¿A quién querés adoptar?</Heading>
                <div className="space-y-2">
                  {pets.map((p) => (
                    <button key={p.id} onClick={() => setPetId(p.id)} className={`w-full rounded-lg border p-4 text-left ${petId === p.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{p.name}</span>
                        {petId === p.id && <Check className="h-4 w-4 text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} disabled={!petId} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50">Continuar</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
                <Heading level={3}>Tus datos</Heading>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
                <input type="tel" value={phone2} onChange={(e) => setPhone2(e.target.value)} placeholder="Teléfono" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="yard" checked={hasYard} onChange={(e) => setHasYard(e.target.checked)} />
                  <label htmlFor="yard" className="text-sm text-foreground">Tengo patio cerrado</label>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-border py-3 text-sm font-medium hover:bg-surface-light">Volver</button>
                  <button onClick={() => setStep(3)} className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:opacity-90">Continuar</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
                <Heading level={3}>Requisitos</Heading>
                <ul className="space-y-2">
                  {requirements.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 shrink-0 text-green-500" /> {r}</li>
                  ))}
                </ul>
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
                  <span className="text-sm text-muted-foreground">Acepto los requisitos y me comprometo a brindar un hogar responsable</span>
                </label>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 rounded-lg border border-border py-3 text-sm font-medium hover:bg-surface-light">Volver</button>
                  {canSubmit && (
                    <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700">
                      <Send className="h-4 w-4" /> Enviar solicitud
                    </a>
                  )}
                </div>
              </div>
            )}
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
            <Heart className="mx-auto mb-2 h-8 w-8 text-primary" />
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <select value={petId} onChange={(e) => setPetId(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"><option value="">¿A quién querés adoptar?</option>{pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            <input type="tel" value={phone2} onChange={(e) => setPhone2(e.target.value)} placeholder="Teléfono" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm" />
            {canSubmit && (
              <a href={buildUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">
                <Send className="h-4 w-4" /> Enviar solicitud por WhatsApp
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
