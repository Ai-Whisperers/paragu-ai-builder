import {
  Clock, Send, MessageCircle, DollarSign,
} from 'lucide-react'
import type { TagData } from '@/components/admin/lead-tags'

export interface Lead {
  id: string
  business_name: string
  slug: string
  business_type: string
  status: string
  priority_tier: string
  priority_score: number
  city: string
  neighborhood: string | null
  phone: string | null
  whatsapp: string | null
  instagram: string | null
  rating: number | null
  review_count: number | null
  has_website: boolean
  created_at: string
  last_contacted_at: string | null
  google_maps_url: string | null
  tags?: string[]
  isFavorite?: boolean
  assignedTo?: string | null
}

export interface Stats {
  total: number
  new: number
  contacted: number
  responded: number
  paying: number
  byType: Record<string, number>
  byCity: Record<string, number>
}

export interface FilterOptions {
  cities: string[]
  types: string[]
  statuses: string[]
  priorities: string[]
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface LeadFilters {
  status?: string
  type?: string
  city?: string
  priority?: string
  search?: string
  page?: string
}

export interface LeadsDashboardProps {
  leads: Lead[]
  stats: Stats
  filterOptions: FilterOptions
  currentFilters: LeadFilters
  pagination: Pagination
}

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-slate-100 text-slate-700',
  enriched: 'bg-[var(--color-info-surface)] text-[var(--color-info)]',
  demo_ready: 'bg-purple-100 text-purple-700',
  contacted: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)]',
  responded: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)]',
  meeting_scheduled: 'bg-pink-100 text-pink-700',
  onboarding: 'bg-cyan-100 text-cyan-700',
  paying: 'bg-[var(--color-success-surface)] text-[var(--color-success)]',
  churned: 'bg-[var(--color-error-surface)] text-[var(--color-error)]',
  disqualified: 'bg-gray-100 text-gray-700',
}

export const STATUS_ICONS: Record<string, React.ReactNode> = {
  new: <Clock className="w-3 h-3" />,
  contacted: <Send className="w-3 h-3" />,
  responded: <MessageCircle className="w-3 h-3" />,
  paying: <DollarSign className="w-3 h-3" />,
}

export const PRIORITY_COLORS: Record<string, string> = {
  A: 'bg-[var(--color-error-surface)] text-[var(--color-error)] border-[var(--color-error)]',
  B: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-[var(--color-warning)]',
  C: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-[var(--color-warning)]',
  D: 'bg-gray-100 text-gray-700 border-gray-200',
}

export const AVAILABLE_TAGS: TagData[] = [
  { id: '1', name: 'VIP', color: '#EF4444' },
  { id: '2', name: 'Prioridad', color: '#F59E0B' },
  { id: '3', name: 'Frio', color: '#3B82F6' },
  { id: '4', name: 'Caliente', color: '#EF4444' },
  { id: '5', name: 'Presupuesto', color: '#10B981' },
  { id: '6', name: 'Demo', color: '#8B5CF6' },
]

export function generateWhatsAppLink(lead: Lead): string | null {
  const phone = lead.whatsapp || lead.phone
  if (!phone) return null

  const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '595')
  const message = encodeURIComponent(
    `Hola ${lead.business_name}! Soy de Paragu-AI. Veo que no tienen sitio web aún. ` +
    `Podemos crearles uno profesional para atraer más clientes. ` +
    `¿Tienen 5 minutos para conversar?`
  )
  return `https://wa.me/${cleanPhone}?text=${message}`
}
