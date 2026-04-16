'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Save,
  Trash2,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Store,
  MapPin,
  Phone,
  Clock,
  Scissors,
  Users,
  MessageSquare,
} from 'lucide-react'

/* ── Types (mirrors BusinessData from compose.ts) ────────────── */

interface ServiceItem {
  name: string
  description?: string
  price?: string
  priceFrom?: string
  duration?: number
  category?: string
}

interface TeamMember {
  name: string
  role?: string
  bio?: string
}

interface Testimonial {
  quote: string
  author: string
  rating?: number
}

interface BusinessFormData {
  name: string
  slug: string
  type: string
  tagline?: string
  city: string
  neighborhood?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
  services?: ServiceItem[]
  team?: TeamMember[]
  testimonials?: Testimonial[]
}

const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluqueria',
  salon_belleza: 'Salon de Belleza',
  gimnasio: 'Gimnasio',
  spa: 'Spa',
  unas: 'Unas',
  tatuajes: 'Tatuajes',
  barberia: 'Barberia',
  estetica: 'Estetica',
  maquillaje: 'Maquillaje',
  depilacion: 'Depilacion',
  pestanas: 'Pestanas y Cejas',
}

const ALL_TYPES = Object.keys(TYPE_LABELS)

const DAY_LABELS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miercoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sabado',
  domingo: 'Domingo',
}

const DAY_KEYS = Object.keys(DAY_LABELS)

/* ── Accordion Section Wrapper ───────────────────────────────── */

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold text-foreground">
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {open && <div className="border-t border-border px-6 py-5">{children}</div>}
    </div>
  )
}

/* ── Form Field Helpers ──────────────────────────────────────── */

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      )}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'

const selectClass =
  'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'

/* ── Main Component ──────────────────────────────────────────── */

export default function EditForm({
  business,
}: {
  business: BusinessFormData
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  /* ── Form State ───────────────────────────────────────────── */
  const [name, setName] = useState(business.name)
  const [type, setType] = useState(business.type)
  const [tagline, setTagline] = useState(business.tagline ?? '')
  const [city, setCity] = useState(business.city)
  const [neighborhood, setNeighborhood] = useState(
    business.neighborhood ?? ''
  )
  const [address, setAddress] = useState(business.address ?? '')
  const [phone, setPhone] = useState(business.phone ?? '')
  const [email, setEmail] = useState(business.email ?? '')
  const [whatsapp, setWhatsapp] = useState(business.whatsapp ?? '')
  const [instagram, setInstagram] = useState(business.instagram ?? '')
  const [facebook, setFacebook] = useState(business.facebook ?? '')
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    business.googleMapsUrl ?? ''
  )

  /* Hours — initialize with existing data or empty record */
  const [hours, setHours] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const day of DAY_KEYS) {
      initial[day] = business.hours?.[day] ?? ''
    }
    return initial
  })

  /* Services */
  const [services, setServices] = useState<ServiceItem[]>(
    business.services ?? []
  )

  /* Team */
  const [team, setTeam] = useState<TeamMember[]>(business.team ?? [])

  /* Testimonials */
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    business.testimonials ?? []
  )

  /* ── Handlers ─────────────────────────────────────────────── */

  function updateService(index: number, patch: Partial<ServiceItem>) {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    )
  }

  function removeService(index: number) {
    setServices((prev) => prev.filter((_, i) => i !== index))
  }

  function addService() {
    setServices((prev) => [...prev, { name: '' }])
  }

  function updateTeam(index: number, patch: Partial<TeamMember>) {
    setTeam((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...patch } : m))
    )
  }

  function removeTeam(index: number) {
    setTeam((prev) => prev.filter((_, i) => i !== index))
  }

  function addTeam() {
    setTeam((prev) => [...prev, { name: '' }])
  }

  function updateTestimonial(index: number, patch: Partial<Testimonial>) {
    setTestimonials((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t))
    )
  }

  function removeTestimonial(index: number) {
    setTestimonials((prev) => prev.filter((_, i) => i !== index))
  }

  function addTestimonial() {
    setTestimonials((prev) => [...prev, { quote: '', author: '' }])
  }

  /* ── Save ─────────────────────────────────────────────────── */

  async function handleSave() {
    setSaving(true)
    setSaveMessage(null)

    const payload: BusinessFormData = {
      name,
      slug: business.slug,
      type,
      tagline: tagline || undefined,
      city,
      neighborhood: neighborhood || undefined,
      address: address || undefined,
      phone: phone || undefined,
      email: email || undefined,
      whatsapp: whatsapp || undefined,
      instagram: instagram || undefined,
      facebook: facebook || undefined,
      googleMapsUrl: googleMapsUrl || undefined,
      hours: Object.fromEntries(
        Object.entries(hours).filter(([, v]) => v.trim() !== '')
      ),
      services: services.filter((s) => s.name.trim() !== ''),
      team: team.filter((m) => m.name.trim() !== ''),
      testimonials: testimonials.filter(
        (t) => t.quote.trim() !== '' && t.author.trim() !== ''
      ),
    }

    try {
      const res = await fetch(`/api/businesses/${business.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSaveMessage({ type: 'success', text: 'Cambios guardados correctamente.' })
      } else {
        const body = await res.json().catch(() => ({}))
        console.error('[EditForm] Save failed:', res.status, body)
        setSaveMessage({
          type: 'error',
          text: body.error ?? 'Error al guardar. Intenta de nuevo.',
        })
      }
    } catch (err) {
      console.error('[EditForm] Save error:', err)
      setSaveMessage({
        type: 'error',
        text: 'Error de red. Verifica tu conexion.',
      })
    } finally {
      setSaving(false)
    }
  }

  /* ── Delete ───────────────────────────────────────────────── */

  async function handleDelete() {
    const confirmed = window.confirm(
      `Estas seguro de que quieres eliminar "${name}"? Esta accion no se puede deshacer.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/businesses/${business.slug}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        console.error('[EditForm] Delete failed:', res.status)
        setSaveMessage({
          type: 'error',
          text: 'Error al eliminar. Intenta de nuevo.',
        })
      }
    } catch (err) {
      console.error('[EditForm] Delete error:', err)
      setSaveMessage({
        type: 'error',
        text: 'Error de red al eliminar.',
      })
    } finally {
      setDeleting(false)
    }
  }

  /* ── Render ───────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Editar: {business.name}
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Cancelar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-button transition-colors hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Save/Error Message */}
      {saveMessage && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            saveMessage.type === 'success'
              ? 'border-[var(--success)]/30 bg-[var(--success)]/10 text-success'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* ── Informacion General ─────────────────────────────── */}
      <Section title="Informacion General" icon={Store} defaultOpen>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre del Negocio">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Ej: Studio Maria"
            />
          </Field>

          <Field label="Tipo de Negocio">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={selectClass}
            >
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Tagline" hint="Frase corta que describe tu negocio">
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className={inputClass}
                placeholder="Ej: Tu belleza, nuestra pasion"
              />
            </Field>
          </div>

          <Field label="Slug" hint="Identificador en la URL (no editable)">
            <input
              type="text"
              value={business.slug}
              disabled
              className={`${inputClass} cursor-not-allowed opacity-60`}
            />
          </Field>
        </div>
      </Section>

      {/* ── Ubicacion ───────────────────────────────────────── */}
      <Section title="Ubicacion" icon={MapPin}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ciudad">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
              placeholder="Ej: Asuncion"
            />
          </Field>

          <Field label="Barrio">
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className={inputClass}
              placeholder="Ej: Villa Morra"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Direccion">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                placeholder="Ej: Av. Mcal. Lopez 1234"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Google Maps URL">
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className={inputClass}
                placeholder="https://maps.google.com/..."
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── Contacto ────────────────────────────────────────── */}
      <Section title="Contacto" icon={Phone}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefono">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="Ej: +595 21 123456"
            />
          </Field>

          <Field label="WhatsApp">
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={inputClass}
              placeholder="Ej: +595981123456"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="contacto@negocio.com"
            />
          </Field>

          <Field label="Instagram">
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className={inputClass}
              placeholder="@negocio"
            />
          </Field>

          <Field label="Facebook">
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className={inputClass}
              placeholder="https://facebook.com/negocio"
            />
          </Field>
        </div>
      </Section>

      {/* ── Horarios ────────────────────────────────────────── */}
      <Section title="Horarios" icon={Clock}>
        <div className="grid gap-4 sm:grid-cols-2">
          {DAY_KEYS.map((day) => (
            <Field key={day} label={DAY_LABELS[day]}>
              <input
                type="text"
                value={hours[day] ?? ''}
                onChange={(e) =>
                  setHours((prev) => ({ ...prev, [day]: e.target.value }))
                }
                className={inputClass}
                placeholder="Ej: 08:00 - 18:00"
              />
            </Field>
          ))}
        </div>
      </Section>

      {/* ── Servicios ───────────────────────────────────────── */}
      <Section title={`Servicios (${services.length})`} icon={Scissors}>
        <div className="space-y-4">
          {services.map((svc, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-surface-light p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Servicio {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre">
                  <input
                    type="text"
                    value={svc.name}
                    onChange={(e) =>
                      updateService(i, { name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ej: Corte de cabello"
                  />
                </Field>
                <Field label="Precio">
                  <input
                    type="text"
                    value={svc.price ?? ''}
                    onChange={(e) =>
                      updateService(i, { price: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ej: 50.000 Gs."
                  />
                </Field>
                <Field label="Precio Desde">
                  <input
                    type="text"
                    value={svc.priceFrom ?? ''}
                    onChange={(e) =>
                      updateService(i, { priceFrom: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ej: 30.000 Gs."
                  />
                </Field>
                <Field label="Duracion (min)">
                  <input
                    type="number"
                    value={svc.duration ?? ''}
                    onChange={(e) =>
                      updateService(i, {
                        duration: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    className={inputClass}
                    placeholder="Ej: 45"
                  />
                </Field>
                <Field label="Categoria">
                  <input
                    type="text"
                    value={svc.category ?? ''}
                    onChange={(e) =>
                      updateService(i, { category: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ej: Cortes"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Descripcion">
                    <textarea
                      value={svc.description ?? ''}
                      onChange={(e) =>
                        updateService(i, { description: e.target.value })
                      }
                      rows={2}
                      className={inputClass}
                      placeholder="Breve descripcion del servicio..."
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addService}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar Servicio
          </button>
        </div>
      </Section>

      {/* ── Equipo ──────────────────────────────────────────── */}
      <Section title={`Equipo (${team.length})`} icon={Users}>
        <div className="space-y-4">
          {team.map((member, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-surface-light p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Miembro {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeTeam(i)}
                  className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      updateTeam(i, { name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ej: Maria Lopez"
                  />
                </Field>
                <Field label="Rol">
                  <input
                    type="text"
                    value={member.role ?? ''}
                    onChange={(e) =>
                      updateTeam(i, { role: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ej: Estilista Senior"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Bio">
                    <textarea
                      value={member.bio ?? ''}
                      onChange={(e) =>
                        updateTeam(i, { bio: e.target.value })
                      }
                      rows={2}
                      className={inputClass}
                      placeholder="Breve biografia..."
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTeam}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar Miembro
          </button>
        </div>
      </Section>

      {/* ── Testimonios ─────────────────────────────────────── */}
      <Section
        title={`Testimonios (${testimonials.length})`}
        icon={MessageSquare}
      >
        <div className="space-y-4">
          {testimonials.map((test, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-surface-light p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Testimonio {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeTestimonial(i)}
                  className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Autor">
                  <input
                    type="text"
                    value={test.author}
                    onChange={(e) =>
                      updateTestimonial(i, { author: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Ej: Ana Garcia"
                  />
                </Field>
                <Field label="Calificacion (1-5)">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={test.rating ?? ''}
                    onChange={(e) =>
                      updateTestimonial(i, {
                        rating: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    className={inputClass}
                    placeholder="5"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Comentario">
                    <textarea
                      value={test.quote}
                      onChange={(e) =>
                        updateTestimonial(i, { quote: e.target.value })
                      }
                      rows={3}
                      className={inputClass}
                      placeholder="Lo que dijo el cliente..."
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTestimonial}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar Testimonio
          </button>
        </div>
      </Section>

      {/* ── Bottom Action Bar ───────────────────────────────── */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-6 py-4 shadow-card">
        <Link
          href="/admin"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Volver al Panel
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-button transition-colors hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
