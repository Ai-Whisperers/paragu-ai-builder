'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wand2, ArrowRight, ArrowLeft, Check,
  Scissors, Sparkles, Dumbbell, Flower2, User, Hand,
  PenTool, Palette, Zap, Eye,
  Plus, Trash2, AlertCircle, Loader2,
} from 'lucide-react'
import { Container } from '@/components/ui/container'

/* ── Types ─────────────────────────────────────────────────────────── */

const TYPES = [
  { id: 'peluqueria', name: 'Peluqueria', icon: Scissors, desc: 'Cortes, color y peinados', color: '#b76e79' },
  { id: 'salon_belleza', name: 'Salon de Belleza', icon: Sparkles, desc: 'Servicios integrales de belleza', color: '#d4a574' },
  { id: 'gimnasio', name: 'Gimnasio / Fitness', icon: Dumbbell, desc: 'Entrenamiento y clases', color: '#2d6a4f' },
  { id: 'spa', name: 'Spa & Wellness', icon: Flower2, desc: 'Masajes y relajacion', color: '#7c9885' },
  { id: 'barberia', name: 'Barberia', icon: User, desc: 'Cortes y barba', color: '#8b6914' },
  { id: 'unas', name: 'Unas', icon: Hand, desc: 'Manicura y pedicura', color: '#c77dba' },
  { id: 'tatuajes', name: 'Tatuajes & Piercing', icon: PenTool, desc: 'Arte corporal', color: '#1a1a2e' },
  { id: 'estetica', name: 'Estetica / Facial', icon: Sparkles, desc: 'Tratamientos faciales y corporales', color: '#9b7cb8' },
  { id: 'maquillaje', name: 'Maquillaje', icon: Palette, desc: 'Maquillaje social y artistico', color: '#c44569' },
  { id: 'pestanas', name: 'Pestanas y Cejas', icon: Eye, desc: 'Extensiones y diseno', color: '#6c5ce7' },
  { id: 'depilacion', name: 'Depilacion', icon: Zap, desc: 'Laser y cera', color: '#e17055' },
] as const

const STEPS = [
  'Tipo de Negocio',
  'Datos del Negocio',
  'Contacto',
  'Servicios',
  'Equipo',
  'Revision',
]

interface ServiceEntry {
  name: string
  price: string
  duration: string
  description: string
  category: string
}

interface TeamEntry {
  name: string
  role: string
  bio: string
}

function emptyService(): ServiceEntry {
  return { name: '', price: '', duration: '', description: '', category: '' }
}

function emptyTeam(): TeamEntry {
  return { name: '', role: '', bio: '' }
}

function generateSlug(name: string, city: string): string {
  return `${name}-${city}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const INPUT =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors'

/* ── Component ─────────────────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Step 1
  const [type, setType] = useState('')

  // Step 2
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [address, setAddress] = useState('')

  // Step 3
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')

  // Step 4
  const [services, setServices] = useState<ServiceEntry[]>([emptyService()])

  // Step 5
  const [team, setTeam] = useState<TeamEntry[]>([])

  function canNext(): boolean {
    switch (step) {
      case 0: return type !== ''
      case 1: return name.trim() !== '' && city.trim() !== ''
      case 2: return phone.trim() !== ''
      case 3: return services.some((s) => s.name.trim() !== '')
      case 4: return true // Team is optional
      case 5: return true
      default: return false
    }
  }

  function addService() {
    setServices((s) => [...s, emptyService()])
  }

  function removeService(i: number) {
    setServices((s) => s.filter((_, idx) => idx !== i))
  }

  function updateService(i: number, field: keyof ServiceEntry, value: string) {
    setServices((s) => s.map((svc, idx) => (idx === i ? { ...svc, [field]: value } : svc)))
  }

  function addTeamMember() {
    setTeam((t) => [...t, emptyTeam()])
  }

  function removeTeamMember(i: number) {
    setTeam((t) => t.filter((_, idx) => idx !== i))
  }

  function updateTeam(i: number, field: keyof TeamEntry, value: string) {
    setTeam((t) => t.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')

    const slug = generateSlug(name, city)
    const payload = {
      name: name.trim(),
      slug,
      type,
      tagline: tagline.trim() || undefined,
      city: city.trim(),
      neighborhood: neighborhood.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim() || undefined,
      instagram: instagram.trim() || undefined,
      facebook: facebook.trim() || undefined,
      services: services
        .filter((s) => s.name.trim())
        .map((s) => ({
          name: s.name.trim(),
          price: s.price.trim() || undefined,
          duration: s.duration ? Number(s.duration) : undefined,
          description: s.description.trim() || undefined,
          category: s.category.trim() || undefined,
        })),
      team: team
        .filter((m) => m.name.trim())
        .map((m) => ({
          name: m.name.trim(),
          role: m.role.trim() || undefined,
          bio: m.bio.trim() || undefined,
        })),
    }

    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear el negocio')
      }

      router.push(`/${slug}`)
    } catch (err) {
      console.error('[Onboarding] Submit error:', err)
      setError(err instanceof Error ? err.message : 'Error al crear el negocio')
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Nav */}
      <nav className="border-b border-[var(--border)] bg-[var(--background)]">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Wand2 size={20} />
              </div>
              <span className="text-lg font-bold text-[var(--text)]">
                Paragu<span className="text-[var(--primary)]">AI</span>
              </span>
            </a>
            <span className="text-sm text-[var(--text-muted)]">
              Paso {step + 1} de {STEPS.length}
            </span>
          </div>
        </Container>
      </nav>

      <main className="min-h-screen bg-[var(--background)] py-8 md:py-12">
        <Container size="md">
          {/* Progress */}
          <div className="mb-10">
            <div className="mb-3 flex justify-between text-xs font-medium text-[var(--text-muted)]">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className={i <= step ? 'text-[var(--primary)]' : ''}
                >
                  <span className="hidden sm:inline">{s}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </span>
              ))}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-light)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-[var(--text)]">{STEPS[step]}</h2>

            {/* Step 0: Business Type */}
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TYPES.map((t) => {
                  const Icon = t.icon
                  const selected = type === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-normal ${
                        selected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-card'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/40'
                      }`}
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${t.color}15`, color: t.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{t.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{t.desc}</p>
                      </div>
                      {selected && (
                        <Check size={18} className="ml-auto flex-shrink-0 text-[var(--primary)]" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text)]">
                    Nombre del Negocio *
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Salon Maria" className={INPUT} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text)]">Eslogan</label>
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Ej: Tu mejor look comienza aqui" className={INPUT} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--text)]">Ciudad *</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ej: Asuncion" className={INPUT} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--text)]">Barrio</label>
                    <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Ej: Villa Morra" className={INPUT} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text)]">Direccion</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej: Av. Mcal. Lopez 3245" className={INPUT} />
                </div>
                {name && city && (
                  <p className="text-xs text-[var(--text-muted)]">
                    Tu URL sera: <span className="font-medium text-[var(--primary)]">paragu.ai/{generateSlug(name, city)}</span>
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Contact */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text)]">Telefono *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+595 981 234 567" className={INPUT} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text)]">WhatsApp</label>
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Igual al telefono si esta vacio" className={INPUT} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--text)]">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@minegocio.com.py" className={INPUT} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--text)]">Instagram</label>
                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@minegocio" className={INPUT} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--text)]">Facebook</label>
                    <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="minegocio.py" className={INPUT} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-muted)]">
                  Agrega los servicios que ofrece tu negocio con precios y duracion.
                </p>
                {services.map((svc, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--text)]">Servicio {i + 1}</span>
                      {services.length > 1 && (
                        <button type="button" onClick={() => removeService(i)} className="text-[var(--text-muted)] hover:text-[var(--destructive)]">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input type="text" value={svc.name} onChange={(e) => updateService(i, 'name', e.target.value)} placeholder="Nombre del servicio *" className={INPUT} />
                      <div className="grid gap-3 sm:grid-cols-3">
                        <input type="text" value={svc.price} onChange={(e) => updateService(i, 'price', e.target.value)} placeholder="Precio (Gs.)" className={INPUT} />
                        <input type="number" value={svc.duration} onChange={(e) => updateService(i, 'duration', e.target.value)} placeholder="Duracion (min)" className={INPUT} />
                        <input type="text" value={svc.category} onChange={(e) => updateService(i, 'category', e.target.value)} placeholder="Categoria" className={INPUT} />
                      </div>
                      <input type="text" value={svc.description} onChange={(e) => updateService(i, 'description', e.target.value)} placeholder="Descripcion breve" className={INPUT} />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addService}
                  className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  <Plus size={16} /> Agregar Servicio
                </button>
              </div>
            )}

            {/* Step 4: Team */}
            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--text-muted)]">
                  Opcional — agrega los profesionales de tu equipo.
                </p>
                {team.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center">
                    <p className="mb-3 text-sm text-[var(--text-muted)]">No tenes miembros de equipo aun</p>
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]"
                    >
                      <Plus size={16} /> Agregar Miembro
                    </button>
                  </div>
                )}
                {team.map((m, i) => (
                  <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--text)]">Miembro {i + 1}</span>
                      <button type="button" onClick={() => removeTeamMember(i)} className="text-[var(--text-muted)] hover:text-[var(--destructive)]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input type="text" value={m.name} onChange={(e) => updateTeam(i, 'name', e.target.value)} placeholder="Nombre *" className={INPUT} />
                      <input type="text" value={m.role} onChange={(e) => updateTeam(i, 'role', e.target.value)} placeholder="Rol (Ej: Estilista Senior)" className={INPUT} />
                      <textarea value={m.bio} onChange={(e) => updateTeam(i, 'bio', e.target.value)} placeholder="Breve bio" rows={2} className={INPUT + ' resize-none'} />
                    </div>
                  </div>
                ))}
                {team.length > 0 && (
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <Plus size={16} /> Agregar Miembro
                  </button>
                )}
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-[var(--destructive)]/10 p-4 text-sm text-[var(--destructive)]">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                    <h4 className="mb-2 text-sm font-semibold text-[var(--text)]">Negocio</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Nombre</dt><dd className="font-medium text-[var(--text)]">{name}</dd></div>
                      <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Tipo</dt><dd className="font-medium text-[var(--text)]">{TYPES.find((t) => t.id === type)?.name}</dd></div>
                      <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Ciudad</dt><dd className="font-medium text-[var(--text)]">{city}</dd></div>
                      {neighborhood && <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Barrio</dt><dd className="font-medium text-[var(--text)]">{neighborhood}</dd></div>}
                      {tagline && <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Eslogan</dt><dd className="font-medium text-[var(--text)]">{tagline}</dd></div>}
                    </dl>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                    <h4 className="mb-2 text-sm font-semibold text-[var(--text)]">Contacto</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Telefono</dt><dd className="font-medium text-[var(--text)]">{phone}</dd></div>
                      {email && <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Email</dt><dd className="font-medium text-[var(--text)]">{email}</dd></div>}
                      {instagram && <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Instagram</dt><dd className="font-medium text-[var(--text)]">{instagram}</dd></div>}
                    </dl>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <h4 className="mb-2 text-sm font-semibold text-[var(--text)]">
                    {services.filter((s) => s.name.trim()).length} Servicio(s)
                  </h4>
                  <div className="space-y-1">
                    {services.filter((s) => s.name.trim()).map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text)]">{s.name}</span>
                        <span className="text-[var(--text-muted)]">{s.price || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {team.filter((m) => m.name.trim()).length > 0 && (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                    <h4 className="mb-2 text-sm font-semibold text-[var(--text)]">
                      {team.filter((m) => m.name.trim()).length} Miembro(s) del Equipo
                    </h4>
                    <div className="space-y-1">
                      {team.filter((m) => m.name.trim()).map((m, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-[var(--text)]">{m.name}</span>
                          {m.role && <span className="text-[var(--text-muted)]"> — {m.role}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-[var(--text-muted)]">
                  URL: <span className="font-medium text-[var(--primary)]">paragu.ai/{generateSlug(name, city)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-all hover:bg-[var(--surface-light)] disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft size={16} /> Anterior
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover disabled:pointer-events-none disabled:opacity-50"
              >
                Siguiente <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Generando...</>
                ) : (
                  <><Wand2 size={16} /> Generar Mi Sitio Web</>
                )}
              </button>
            )}
          </div>
        </Container>
      </main>
    </>
  )
}
