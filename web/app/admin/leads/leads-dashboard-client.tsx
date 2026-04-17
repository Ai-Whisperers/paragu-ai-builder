'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Filter, Phone, MessageCircle, ExternalLink, 
  Star, MapPin, Building2, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Clock, DollarSign, MoreHorizontal,
  Send, Eye, FileText, Smartphone, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface Lead {
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
}

interface Stats {
  total: number
  new: number
  contacted: number
  responded: number
  paying: number
  byType: Record<string, number>
  byCity: Record<string, number>
}

interface FilterOptions {
  cities: string[]
  types: string[]
  statuses: string[]
  priorities: string[]
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface Props {
  leads: Lead[]
  stats: Stats
  filterOptions: FilterOptions
  currentFilters: {
    status?: string
    type?: string
    city?: string
    priority?: string
    search?: string
    page?: string
  }
  pagination: Pagination
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-slate-100 text-slate-700',
  enriched: 'bg-blue-100 text-blue-700',
  demo_ready: 'bg-purple-100 text-purple-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  responded: 'bg-orange-100 text-orange-700',
  meeting_scheduled: 'bg-pink-100 text-pink-700',
  onboarding: 'bg-cyan-100 text-cyan-700',
  paying: 'bg-green-100 text-green-700',
  churned: 'bg-red-100 text-red-700',
  disqualified: 'bg-gray-100 text-gray-700',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  new: <Clock className="w-3 h-3" />,
  contacted: <Send className="w-3 h-3" />,
  responded: <MessageCircle className="w-3 h-3" />,
  paying: <DollarSign className="w-3 h-3" />,
}

const PRIORITY_COLORS: Record<string, string> = {
  A: 'bg-red-100 text-red-700 border-red-200',
  B: 'bg-orange-100 text-orange-700 border-orange-200',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  D: 'bg-gray-100 text-gray-700 border-gray-200',
}

const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluquería',
  salon_belleza: 'Salón Belleza',
  gimnasio: 'Gimnasio',
  spa: 'Spa',
  unas: 'Uñas',
  tatuajes: 'Tatuajes',
  barberia: 'Barbería',
  estetica: 'Estética',
  maquillaje: 'Maquillaje',
  depilacion: 'Depilación',
  pestanas: 'Pestañas',
  diseno_grafico: 'Diseño Gráfico',
  relocation: 'Reubicación',
  inmobiliaria: 'Inmobiliaria',
  legal: 'Legal',
  consultoria: 'Consultoría',
  educacion: 'Educación',
  salud: 'Salud',
  inversiones: 'Inversiones',
  meal_prep: 'Meal Prep',
}

export function LeadsDashboardClient({ 
  leads, 
  stats, 
  filterOptions, 
  currentFilters,
  pagination 
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentFilters.search || '')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // Reset to first page
    router.push(`/admin/leads?${params.toString()}`)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search || undefined)
  }
  
  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/admin/leads?${params.toString()}`)
  }
  
  const generateWhatsAppLink = (lead: Lead) => {
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
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline">Volver al Admin</Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-600">
          Gestiona prospectos, envía demos y realiza seguimiento de conversiones
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <StatCard 
          label="Total Leads" 
          value={stats.total} 
          icon={<Building2 className="w-4 h-4" />}
        />
        <StatCard 
          label="Nuevos" 
          value={stats.new} 
          color="bg-slate-100"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard 
          label="Contactados" 
          value={stats.contacted} 
          color="bg-yellow-100"
          icon={<Send className="w-4 h-4" />}
        />
        <StatCard 
          label="Respondieron" 
          value={stats.responded} 
          color="bg-orange-100"
          icon={<MessageCircle className="w-4 h-4" />}
        />
        <StatCard 
          label="Pagando" 
          value={stats.paying} 
          color="bg-green-100"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard 
          label="Conversion" 
          value={stats.total > 0 ? `${((stats.paying / stats.total) * 100).toFixed(1)}%` : '0%'}
          color="bg-emerald-100"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Filtrar:</span>
          </div>
          
          <Select 
            value={currentFilters.status || 'all'} 
            onValueChange={(v) => updateFilter('status', v === 'all' ? undefined : v)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {filterOptions.statuses.map(s => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={currentFilters.type || 'all'} 
            onValueChange={(v) => updateFilter('type', v === 'all' ? undefined : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {filterOptions.types.map(t => (
                <SelectItem key={t} value={t}>
                  {TYPE_LABELS[t] || t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={currentFilters.city || 'all'} 
            onValueChange={(v) => updateFilter('city', v === 'all' ? undefined : v)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {filterOptions.cities.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={currentFilters.priority || 'all'} 
            onValueChange={(v) => updateFilter('priority', v === 'all' ? undefined : v)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {filterOptions.priorities.map(p => (
                <SelectItem key={p} value={p}>
                  Prioridad {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Negocio</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Ubicación</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Score</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Contacto</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No se encontraron leads con los filtros seleccionados
                  </td>
                </tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {lead.business_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.business_name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${PRIORITY_COLORS[lead.priority_tier]}`}
                          >
                            {lead.priority_tier}
                          </Badge>
                          {lead.has_website === false && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                              Sin web
                            </Badge>
                          )}
                          {lead.rating && (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <Star className="w-3 h-3 fill-current" />
                              {lead.rating} ({lead.review_count})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700">
                      {TYPE_LABELS[lead.business_type] || lead.business_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {lead.city}
                      {lead.neighborhood && (
                        <span className="text-gray-400">• {lead.neighborhood}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1">
                      <div 
                        className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden"
                        title={`Score: ${lead.priority_score}`}
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${lead.priority_score}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 ml-1">{lead.priority_score}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={`${STATUS_COLORS[lead.status]} capitalize`}>
                      <span className="flex items-center gap-1">
                        {STATUS_ICONS[lead.status]}
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {lead.whatsapp && (
                        <a 
                          href={generateWhatsAppLink(lead) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                      {lead.phone && (
                        <a 
                          href={`tel:${lead.phone}`}
                          className="text-blue-600 hover:text-blue-700"
                          title="Llamar"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      {lead.instagram && (
                        <a 
                          href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700"
                          title="Instagram"
                        >
                          <Smartphone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            {lead.business_name}
                            <Badge className={PRIORITY_COLORS[lead.priority_tier]}>
                              {lead.priority_tier}
                            </Badge>
                          </SheetTitle>
                        </SheetHeader>
                        <LeadDetailPanel lead={lead} />
                      </SheetContent>
                    </Sheet>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} leads
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color = 'bg-white', icon }: { 
  label: string
  value: number | string
  color?: string
  icon: React.ReactNode
}) {
  return (
    <div className={`${color} rounded-lg p-4 border`}>
      <div className="flex items-center gap-2 text-gray-600 mb-1">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

function LeadDetailPanel({ lead }: { lead: Lead }) {
  const waLink = (() => {
    const phone = lead.whatsapp || lead.phone
    if (!phone) return null
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '595')
    const message = encodeURIComponent(
      `Hola ${lead.business_name}! Soy de Paragu-AI. Veo que no tienen sitio web aún. Podemos crearles uno profesional para atraer más clientes. ¿Tienen 5 minutos para conversar?`
    )
    return `https://wa.me/${cleanPhone}?text=${message}`
  })()
  
  return (
    <div className="mt-6 space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" disabled>
          <Eye className="w-4 h-4 mr-2" />
          Generar Preview
        </Button>
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </a>
        )}
      </div>
      
      {/* Info Grid */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Información de Contacto</h3>
        
        <div className="grid gap-3 text-sm">
          {lead.phone && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>Teléfono</span>
              </div>
              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                {lead.phone}
              </a>
            </div>
          )}
          
          {lead.whatsapp && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </div>
              <a 
                href={waLink || '#'} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {lead.whatsapp}
              </a>
            </div>
          )}
          
          {lead.instagram && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <Smartphone className="w-4 h-4" />
                <span>Instagram</span>
              </div>
              <a 
                href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                @{lead.instagram.replace('@', '')}
              </a>
            </div>
          )}
          
          {lead.google_maps_url && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Google Maps</span>
              </div>
              <a 
                href={lead.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Ver <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Metadata */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Detalles</h3>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Ciudad</div>
            <div className="font-medium">{lead.city}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Barrio</div>
            <div className="font-medium">{lead.neighborhood || '—'}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Tipo</div>
            <div className="font-medium">
              {TYPE_LABELS[lead.business_type] || lead.business_type}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Score</div>
            <div className="font-medium">{lead.priority_score}/100</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Rating</div>
            <div className="font-medium">
              {lead.rating ? `${lead.rating} ⭐ (${lead.review_count})` : '—'}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-gray-500 mb-1">Tiene Web</div>
            <div className="font-medium">
              {lead.has_website ? (
                <span className="text-green-600">Sí</span>
              ) : (
                <span className="text-red-600">No (oportunidad!)</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Línea de Tiempo</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            <div>
              <div className="font-medium">Lead importado</div>
              <div className="text-gray-500">
                {new Date(lead.created_at).toLocaleDateString('es-PY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          {lead.last_contacted_at && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
              <div>
                <div className="font-medium">Último contacto</div>
                <div className="text-gray-500">
                  {new Date(lead.last_contacted_at).toLocaleDateString('es-PY', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
