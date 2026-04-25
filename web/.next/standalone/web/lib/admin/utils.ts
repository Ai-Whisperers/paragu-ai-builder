export function ago(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const min = Math.round(ms / 60_000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const hr = Math.round(min / 60)
  if (hr < 24) return `hace ${hr} h`
  const day = Math.round(hr / 24)
  if (day === 1) return 'ayer'
  if (day < 30) return `hace ${day} d`
  const mo = Math.round(day / 30)
  return `hace ${mo} m`
}

export function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-PY', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-PY', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluquería',
  salon_belleza: 'Salón de Belleza',
  gimnasio: 'Gimnasio',
  spa: 'Spa',
  unas: 'Uñas',
  tatuajes: 'Tatuajes',
  barberia: 'Barbería',
  estetica: 'Estética',
  maquillaje: 'Maquillaje',
  depilacion: 'Depilación',
  pestanas: 'Pestañas y Cejas',
  restaurant: 'Restaurante',
  contador: 'Contador',
  relocation: 'Relocation',
  inmobiliaria: 'Inmobiliaria',
  consultoria: 'Consultoría',
  legal: 'Legal',
  inversiones: 'Inversiones',
  salud: 'Salud',
  educacion: 'Educación',
  meal_prep: 'Meal Prep',
  diseno_grafico: 'Diseño Gráfico',
}

export const INBOX_STATUS_ORDER = ['new', 'contacted', 'qualified', 'closed'] as const
export type InboxStatus = (typeof INBOX_STATUS_ORDER)[number]

export const INBOX_STATUS_LABELS: Record<InboxStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Calificado',
  closed: 'Cerrado',
}

export const INBOX_STATUS_COLORS: Record<InboxStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
}

export const CLOSE_REASON_LABELS: Record<string, string> = {
  won: 'Ganado',
  lost: 'Perdido',
  invalid: 'Inválido',
  duplicate: 'Duplicado',
  no_response: 'Sin respuesta',
  not_interested: 'No interesado',
}
