'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Filter, Phone, MessageCircle, ExternalLink, 
  Star, MapPin, Building2, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, DollarSign, MoreHorizontal,
  Send, Eye, Smartphone, Download, Heart, Tag,
  CheckSquare, Square, Loader2, FileText, Plus,
  Trash2, X, ChevronUp, Command
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Toast, ToastContainer, useToast } from '@/components/ui/toast'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { FocusRing } from '@/components/ui/focus-ring'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import { ActivityFeed, ActivityFeedCompact } from '@/components/admin/activity-feed'
import { LeadTags, TagData } from '@/components/admin/lead-tags'
import { QuickFilters, QuickFilterType, FilterBar, QUICK_FILTERS } from '@/components/admin/quick-filters'

// Types matching database schema
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
  tags?: string[]
  isFavorite?: boolean
  assignedTo?: string | null
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

const STATUS_ICONS: Record<string, React.ReactNode> = {
  new: <Clock className="w-3 h-3" />,
  contacted: <Send className="w-3 h-3" />,
  responded: <MessageCircle className="w-3 h-3" />,
  paying: <DollarSign className="w-3 h-3" />,
}

const PRIORITY_COLORS: Record<string, string> = {
  A: 'bg-[var(--color-error-surface)] text-[var(--color-error)] border-[var(--color-error)]',
  B: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-[var(--color-warning)]',
  C: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-[var(--color-warning)]',
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

// Available tags
const AVAILABLE_TAGS: TagData[] = [
  { id: '1', name: 'VIP', color: '#EF4444' },
  { id: '2', name: 'Prioridad', color: '#F59E0B' },
  { id: '3', name: 'Frio', color: '#3B82F6' },
  { id: '4', name: 'Caliente', color: '#EF4444' },
  { id: '5', name: 'Presupuesto', color: '#10B981' },
  { id: '6', name: 'Demo', color: '#8B5CF6' },
]

export function LeadsDashboardClient({ 
  leads: initialLeads, 
  stats, 
  filterOptions, 
  currentFilters,
  pagination 
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toasts, addToast, removeToast } = useToast()
  
  // State
  const [search, setSearch] = useState(currentFilters.search || '')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [quickFilters, setQuickFilters] = useState<QuickFilterType[]>([])
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [isCmdKOpen, setIsCmdKOpen] = useState(false)
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: 'danger' | 'warning' | 'info'
  } | null>(null)
  
  // Notes state
  const [notes, setNotes] = useState<Array<{
    id: string
    content: string
    type: string
    createdAt: string
  }>>([])
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCmdKOpen(true)
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }
      
      // Escape to close dialogs and sheets
      if (e.key === 'Escape') {
        setConfirmDialog(null)
        setIsCmdKOpen(false)
      }
      
      // Cmd/Ctrl + A to select all visible leads
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && !e.shiftKey) {
        e.preventDefault()
        const visibleLeadIds = leads.map(l => l.id)
        setSelectedLeads(new Set(visibleLeadIds))
        addToast({
          variant: 'info',
          title: 'Todos seleccionados',
          description: `${visibleLeadIds.length} leads seleccionados`,
          duration: 2000
        })
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [leads, addToast])

  // Filter leads based on quick filters
  const filteredLeads = useMemo(() => {
    let result = [...leads]
    
    for (const filterId of quickFilters) {
      switch (filterId) {
        case 'has_phone':
          result = result.filter(l => l.phone)
          break
        case 'has_whatsapp':
          result = result.filter(l => l.whatsapp)
          break
        case 'no_website':
          result = result.filter(l => !l.has_website)
          break
        case 'high_priority':
          result = result.filter(l => l.priority_tier === 'A' || l.priority_tier === 'B')
          break
        case 'recent': {
          // eslint-disable-next-line react-hooks/purity -- Date.now() in useMemo is semantically fine — "recent" means current-time-relative, and memo deps drive recomputation.
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
          result = result.filter(l => new Date(l.created_at).getTime() >= weekAgo)
          break
        }
        case 'favorites':
          result = result.filter(l => l.isFavorite)
          break
        case 'responded':
          result = result.filter(l => l.status === 'responded')
          break
        case 'pending_contact':
          result = result.filter(l => l.status === 'new' || l.status === 'enriched')
          break
      }
    }
    
    return result
  }, [leads, quickFilters])

  const updateFilter = (key: string, value: string | undefined) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/admin/leads?${params.toString()}`)
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search || undefined)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/admin/leads?${params.toString()}`)
    setTimeout(() => setIsLoading(false), 300)
  }

  const toggleLeadSelection = (leadId: string) => {
    const newSelected = new Set(selectedLeads)
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId)
    } else {
      newSelected.add(leadId)
    }
    setSelectedLeads(newSelected)
  }

  const toggleAllSelection = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.id)))
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'ID', 'Business Name', 'Type', 'Status', 'Priority', 
      'City', 'Phone', 'WhatsApp', 'Email', 'Rating', 'Created At'
    ]
    
    const rows = filteredLeads.map(lead => [
      lead.id,
      lead.business_name,
      TYPE_LABELS[lead.business_type] || lead.business_type,
      lead.status,
      lead.priority_tier,
      lead.city,
      lead.phone || '',
      lead.whatsapp || '',
      '', // email not in schema
      lead.rating || '',
      new Date(lead.created_at).toLocaleDateString()
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    addToast({
      variant: 'success',
      title: 'Exportación completada',
      description: `${filteredLeads.length} leads exportados a CSV`,
    })
  }

  // Bulk update status
  const bulkUpdateStatus = async (newStatus: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Actualizar estado',
      description: `¿Estás seguro de cambiar el estado de ${selectedLeads.size} leads a "${newStatus}"?`,
      variant: 'warning',
      onConfirm: async () => {
        setIsLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Update local state
        setLeads(prev => prev.map(lead => 
          selectedLeads.has(lead.id) 
            ? { ...lead, status: newStatus }
            : lead
        ))
        
        setSelectedLeads(new Set())
        setConfirmDialog(null)
        setIsLoading(false)
        
        addToast({
          variant: 'success',
          title: 'Actualización completada',
          description: `${selectedLeads.size} leads actualizados a "${newStatus}"`,
        })
      }
    })
  }

  // Toggle favorite
  const toggleFavorite = async (leadId: string) => {
    setLeads(prev => prev.map(lead =>
      lead.id === leadId 
        ? { ...lead, isFavorite: !lead.isFavorite }
        : lead
    ))
    
    const lead = leads.find(l => l.id === leadId)
    const isFavorite = !lead?.isFavorite
    
    addToast({
      variant: 'success',
      title: isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos',
      duration: 2000
    })
  }

  // Add note
  const addNote = async () => {
    if (!newNote.trim() || !selectedLead) return
    
    setIsAddingNote(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const note = {
      id: `note-${Date.now()}`,
      content: newNote.trim(),
      type: 'general',
      createdAt: new Date().toISOString()
    }
    
    setNotes(prev => [note, ...prev])
    setNewNote('')
    setIsAddingNote(false)
    
    addToast({
      variant: 'success',
      title: 'Nota agregada',
      duration: 2000
    })
  }

  // Add tag to lead
  const addTagToLead = (leadId: string, tag: string) => {
    setLeads(prev => prev.map(lead =>
      lead.id === leadId 
        ? { ...lead, tags: [...(lead.tags || []), tag] }
        : lead
    ))
    
    addToast({
      variant: 'success',
      title: `Etiqueta "${tag}" agregada`,
      duration: 2000
    })
  }

  // Remove tag from lead
  const removeTagFromLead = (leadId: string, tag: string) => {
    setLeads(prev => prev.map(lead =>
      lead.id === leadId 
        ? { ...lead, tags: (lead.tags || []).filter(t => t !== tag) }
        : lead
    ))
  }

  // Toggle quick filter
  const toggleQuickFilter = (filterId: QuickFilterType) => {
    setQuickFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    )
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
    <div className={cn(
      "min-h-screen p-6 transition-colors",
      "bg-gray-50"
    )}>
      {/* Toast Container */}
      <ToastContainer position="bottom-right">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast.props} />
        ))}
      </ToastContainer>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <Dialog open={confirmDialog.isOpen} onOpenChange={() => setConfirmDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{confirmDialog.title}</DialogTitle>
              <DialogDescription>{confirmDialog.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setConfirmDialog(null)}>
                Cancelar
              </Button>
              <Button 
                variant={confirmDialog.variant === 'danger' ? 'primary' : 'primary'}
                onClick={confirmDialog.onConfirm}
                className={confirmDialog.variant === 'danger' ? 'bg-[var(--color-error)] hover:opacity-90' : ''}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cmd+K Search Modal */}
      <Dialog open={isCmdKOpen} onOpenChange={setIsCmdKOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="w-5 h-5" />
              Búsqueda rápida
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Buscar leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e)
                  setIsCmdKOpen(false)
                }
              }}
            />
            <div className="text-sm text-gray-500">
              <p>Presiona Enter para buscar</p>
              <p className="mt-1">Atajos: <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> para cerrar</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Lead Management
            </h1>
          </div>
          <p className="text-gray-600">
            Gestiona prospectos, envía demos y realiza seguimiento de conversiones
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="secondary">Volver al Admin</Button>
          </Link>
        </div>
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
          color="bg-[var(--color-warning-surface)]"
          icon={<Send className="w-4 h-4" />}

        />
        <StatCard 
          label="Respondieron" 
          value={stats.responded} 
          color="bg-[var(--color-warning-surface)]"
          icon={<MessageCircle className="w-4 h-4" />}

        />
        <StatCard 
          label="Pagando" 
          value={stats.paying} 
          color="bg-[var(--color-success-surface)]"
          icon={<DollarSign className="w-4 h-4" />}

        />
        <StatCard 
          label="Conversion" 
          value={stats.total > 0 ? `${((stats.paying / stats.total) * 100).toFixed(1)}%` : '0%'}
          color="bg-emerald-100"
          icon={<CheckCircle2 className="w-4 h-4" />}

        />
      </div>

      {/* Quick Filters */}
      <div className={cn(
        "rounded-lg shadow-sm border p-4 mb-4",
        "bg-white border-gray-200"
      )}>
        <QuickFilters
          selectedFilters={quickFilters}
          onFilterToggle={toggleQuickFilter}
          onClearFilters={() => setQuickFilters([])}
          layout="horizontal"
        />
      </div>

      {/* Active Filters Bar */}
      {quickFilters.length > 0 && (
        <FilterBar
          selectedFilters={quickFilters}
          onRemoveFilter={toggleQuickFilter}
          onClearAll={() => setQuickFilters([])}
          totalResults={filteredLeads.length}
          className="mb-4"
        />
      )}

      {/* Bulk Actions Bar */}
      {selectedLeads.size > 0 && (
        <div className={cn(
          "rounded-lg shadow-sm border p-3 mb-4 flex items-center justify-between",
          "bg-[var(--color-info-surface)] border-blue-200"
        )}>
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-sm font-medium",
              "text-[var(--color-info)]"
            )}>
              {selectedLeads.size} leads seleccionados
            </span>
            <div className="flex gap-2">
              <Select onValueChange={bulkUpdateStatus}>
                <SelectTrigger className="w-[140px] h-8 text-sm">
                  <SelectValue placeholder="Cambiar estado" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.statuses.map(s => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  selectedLeads.forEach(id => {
                    const lead = leads.find(l => l.id === id)
                    if (lead) toggleFavorite(id)
                  })
                }}
              >
                <Heart className="w-4 h-4 mr-1" />
                Favorito
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setSelectedLeads(new Set())}
              >
                <X className="w-4 h-4 mr-1" />
                Deseleccionar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Actions */}
      <div className={cn(
        "rounded-lg shadow-sm border p-4 mb-6",
        "bg-white border-gray-200"
      )}>
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
                placeholder="Buscar por nombre... (Cmd+K)"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
          
          <Button
            variant="secondary"
            onClick={exportToCSV}
            disabled={filteredLeads.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className={cn(
        "rounded-lg shadow-sm border overflow-hidden",
        "bg-white border-gray-200"
      )}>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Cargando leads...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <EmptyState
            title="No se encontraron leads"
            description="Intenta ajustar los filtros o la búsqueda"
            icon={<Search className="w-12 h-12 text-gray-300" />}
            action={
              <Button onClick={() => {
                setSearch('')
                setQuickFilters([])
                router.push('/admin/leads')
              }}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={cn(
                  "border-b",
                  "bg-gray-50 border-gray-200"
                )}>
                  <tr>
                    <th className="py-3 px-2 text-center w-10">
                      <button 
                        onClick={toggleAllSelection}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      >
                        {selectedLeads.size === filteredLeads.length && filteredLeads.length > 0 ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      "text-gray-700"
                    )}>Negocio</th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      "text-gray-700"
                    )}>Tipo</th>
                    <th className={cn(
                      "text-left py-3 px-4 font-medium",
                      "text-gray-700"
                    )}>Ubicación</th>
                    <th className={cn(
                      "text-center py-3 px-4 font-medium",
                      "text-gray-700"
                    )}>Score</th>
                    <th className={cn(
                      "text-center py-3 px-4 font-medium",
                      "text-gray-700"
                    )}>Estado</th>
                    <th className={cn(
                      "text-center py-3 px-4 font-medium",
                      "text-gray-700"
                    )}>Contacto</th>
                    <th className={cn(
                      "text-right py-3 px-4 font-medium",
                      "text-gray-700"
                    )}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                        selectedLeads.has(lead.id) && "bg-[var(--color-info-surface)] dark:bg-blue-900/20"
                      )}
                    >
                      <td className="py-3 px-2 text-center">
                        <button 
                          onClick={() => toggleLeadSelection(lead.id)}
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        >
                          {selectedLeads.has(lead.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {lead.business_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={cn(
                              "font-medium",
                              "text-gray-900"
                            )}>
                              {lead.business_name}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge 
                                className={cn("text-xs", PRIORITY_COLORS[lead.priority_tier])}
                              >
                                {lead.priority_tier}
                              </Badge>
                              {lead.has_website === false && (
                                <Badge className="text-xs bg-[var(--color-error-surface)] text-[var(--color-error)]">
                                  Sin web
                                </Badge>
                              )}
                              {lead.rating && (
                                <span className="flex items-center gap-1 text-xs text-amber-600">
                                  <Star className="w-3 h-3 fill-current" />
                                  {lead.rating} ({lead.review_count})
                                </span>
                              )}
                              {lead.isFavorite && (
                                <Heart className="w-3 h-3 text-[var(--color-error)] fill-current" />
                              )}
                            </div>
                            {lead.tags && lead.tags.length > 0 && (
                              <div className="mt-1">
                                <LeadTags tags={lead.tags} availableTags={AVAILABLE_TAGS} size="sm" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={"text-gray-700"}>
                          {TYPE_LABELS[lead.business_type] || lead.business_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className={cn(
                          "flex items-center gap-1",
                          "text-gray-600"
                        )}>
                          <MapPin className="w-3 h-3" />
                          {lead.city}
                          {lead.neighborhood && (
                            <span className={"text-gray-400"}>• {lead.neighborhood}</span>
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
                              className="text-[var(--color-success)] hover:text-[var(--color-success)] focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          {lead.phone && (
                            <a 
                              href={`tel:${lead.phone}`}
                              className="text-blue-600 hover:text-[var(--color-info)] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
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
                              className="text-pink-600 hover:text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded"
                              title="Instagram"
                            >
                              <Smartphone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleFavorite(lead.id)}
                            className={cn(
                              "p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500",
                              lead.isFavorite 
                                ? "text-[var(--color-error)] hover:bg-[var(--color-error-surface)]" 
                                : "text-gray-400 hover:text-[var(--color-error)] hover:bg-gray-100"
                            )}
                            title={lead.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          >
                            <Heart className={cn("w-4 h-4", lead.isFavorite && "fill-current")} />
                          </button>
                          
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedLead(lead)
                                  // Load mock notes for the lead
                                  setNotes([
                                    {
                                      id: '1',
                                      content: 'Llamada inicial realizada, interesado en demo',
                                      type: 'call',
                                      createdAt: new Date(Date.now() - 86400000).toISOString()
                                    }
                                  ])
                                }}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                              <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                  {lead.business_name}
                                  <Badge className={PRIORITY_COLORS[lead.priority_tier]}>
                                    {lead.priority_tier}
                                  </Badge>
                                </SheetTitle>
                              </SheetHeader>
                              <LeadDetailPanel 
                                lead={lead} 
                                notes={notes}
                                newNote={newNote}
                                setNewNote={setNewNote}
                                onAddNote={addNote}
                                isAddingNote={isAddingNote}
                                availableTags={AVAILABLE_TAGS}
                                onAddTag={(tag) => addTagToLead(lead.id, tag)}
                                onRemoveTag={(tag) => removeTagFromLead(lead.id, tag)}
                                onToggleFavorite={() => toggleFavorite(lead.id)}
                              />
                            </SheetContent>
                          </Sheet>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className={cn(
              "flex items-center justify-between px-4 py-3 border-t",
              "bg-gray-50 border-gray-200"
            )}>
              <div className={cn(
                "text-sm",
                "text-gray-600"
              )}>
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} leads
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className={cn(
                  "text-sm",
                  "text-gray-600"
                )}>
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
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
    <div className={cn('rounded-lg p-4 border', color)}>
      <div className="flex items-center gap-2 mb-1 text-gray-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

interface LeadDetailPanelProps {
  lead: Lead
  notes: Array<{ id: string; content: string; type: string; createdAt: string }>
  newNote: string
  setNewNote: (value: string) => void
  onAddNote: () => void
  isAddingNote: boolean
  availableTags: TagData[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onToggleFavorite: () => void
}

function LeadDetailPanel({ 
  lead, 
  notes,
  newNote,
  setNewNote,
  onAddNote,
  isAddingNote,
  availableTags,
  onAddTag,
  onRemoveTag,
  onToggleFavorite
}: LeadDetailPanelProps) {
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
        <Button className="flex-1 focus:ring-2 focus:ring-blue-500" disabled>
          <Eye className="w-4 h-4 mr-2" />
          Generar Preview
        </Button>
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full bg-[var(--color-success)] hover:opacity-90 focus:ring-2 focus:ring-[var(--color-success)]">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </a>
        )}
        <Button 
          variant="secondary" 
          onClick={onToggleFavorite}
          className={cn(
            "focus:ring-2 focus:ring-red-500",
            lead.isFavorite && "border-[var(--color-error)] bg-[var(--color-error-surface)]"
          )}
        >
          <Heart className={cn("w-4 h-4", lead.isFavorite && "fill-red-500 text-[var(--color-error)]")} />
        </Button>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Etiquetas</h3>
        </div>
        <LeadTags 
          tags={lead.tags || []}
          availableTags={availableTags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          editable
        />
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
              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
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
                className="text-[var(--color-success)] hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
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
                className="text-pink-600 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 rounded flex items-center gap-1"
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
                className="text-blue-600 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Ver <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Notes Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Notas</h3>
        
        {/* Add Note */}
        <div className="space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Agregar una nota..."
            className="w-full px-3 py-2 border rounded-lg text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                onAddNote()
              }
            }}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Cmd+Enter para guardar</span>
            <Button 
              size="sm" 
              onClick={onAddNote}
              disabled={!newNote.trim() || isAddingNote}
            >
              {isAddingNote ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Agregar Nota
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No hay notas aún
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-3 bg-[var(--color-warning-surface)] rounded-lg border border-[var(--color-warning)]">
                <p className="text-sm text-gray-700">{note.content}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(note.createdAt).toLocaleDateString('es-PY', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))
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
                <span className="text-[var(--color-success)]">Sí</span>
              ) : (
                <span className="text-[var(--color-error)]">No (oportunidad!)</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Feed */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Actividad Reciente</h3>
        <ActivityFeedCompact leadId={lead.id} limit={3} />
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
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] mt-1.5" />
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
