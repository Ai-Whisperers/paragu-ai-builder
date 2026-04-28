'use client'

import { useEffect, useState } from 'react'
import { 
  MessageCircle, Phone, Mail, Star, 
  CheckCircle2, Clock, User, FileText,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Activity {
  id: string
  type: 'note' | 'call' | 'email' | 'whatsapp' | 'status_change' | 'meeting' | 'favorite'
  leadId: string
  leadName: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
  createdBy: string
}

interface ActivityFeedProps {
  leadId?: string // If provided, shows only activities for that lead
  limit?: number
  className?: string
}

const ACTIVITY_ICONS: Record<Activity['type'], React.ReactNode> = {
  note: <FileText className="w-4 h-4" />,
  call: <Phone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
  status_change: <CheckCircle2 className="w-4 h-4" />,
  meeting: <Clock className="w-4 h-4" />,
  favorite: <Star className="w-4 h-4" />
}

const ACTIVITY_COLORS: Record<Activity['type'], string> = {
  note: 'bg-[var(--color-info-surface)] text-[var(--color-info)]',
  call: 'bg-[var(--color-success-surface)] text-[var(--color-success)]',
  email: 'bg-[var(--color-info-surface)] text-primary',
  whatsapp: 'bg-emerald-100 text-emerald-600',
  status_change: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)]',
  meeting: 'bg-pink-100 text-pink-600',
  favorite: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)]'
}

const ACTIVITY_LABELS: Record<Activity['type'], string> = {
  note: 'Nota',
  call: 'Llamada',
  email: 'Email',
  whatsapp: 'WhatsApp',
  status_change: 'Cambio de Estado',
  meeting: 'Reunión',
  favorite: 'Favorito'
}

// Generate mock activities for demo
function generateMockActivities(leadId?: string): Activity[] {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'whatsapp',
      leadId: 'lead-1',
      leadName: 'Peluquería Bella',
      description: 'Mensaje enviado via WhatsApp',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      createdBy: 'Admin'
    },
    {
      id: '2',
      type: 'note',
      leadId: 'lead-2',
      leadName: 'Gimnasio FitCenter',
      description: 'Agregada nota: "Interesado en plan premium"',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      createdBy: 'Admin'
    },
    {
      id: '3',
      type: 'status_change',
      leadId: 'lead-3',
      leadName: 'Spa Relax',
      description: 'Estado cambiado a "Contactado"',
      metadata: { from: 'new', to: 'contacted' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      createdBy: 'Admin'
    },
    {
      id: '4',
      type: 'call',
      leadId: 'lead-1',
      leadName: 'Peluquería Bella',
      description: 'Llamada realizada - no contestó',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      createdBy: 'Admin'
    },
    {
      id: '5',
      type: 'favorite',
      leadId: 'lead-4',
      leadName: 'Barbería Don Juan',
      description: 'Marcado como favorito',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      createdBy: 'Admin'
    },
    {
      id: '6',
      type: 'meeting',
      leadId: 'lead-2',
      leadName: 'Gimnasio FitCenter',
      description: 'Reunión programada para mañana 10:00',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      createdBy: 'Admin'
    },
    {
      id: '7',
      type: 'email',
      leadId: 'lead-5',
      leadName: 'Estética Divina',
      description: 'Email enviado con propuesta',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      createdBy: 'Admin'
    }
  ]
  
  if (leadId) {
    return activities.filter(a => a.leadId === leadId)
  }
  
  return activities
}

function formatActivityTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 1) return 'Justo ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  
  return date.toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'short'
  })
}

export function ActivityFeed({ leadId, limit = 10, className }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Simulated API load kickoff; sets loading=true then resolves via setTimeout.
    setIsLoading(true)
    setTimeout(() => {
      const mockActivities = generateMockActivities(leadId)
      setActivities(mockActivities)
      setIsLoading(false)
    }, 500)
  }, [leadId])
  
  const displayActivities = expanded 
    ? activities 
    : activities.slice(0, limit)
  
  const hasMore = activities.length > limit
  
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Cargando actividad...</span>
        </div>
      </div>
    )
  }
  
  if (activities.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">No hay actividad reciente</p>
      </div>
    )
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-3">
        {displayActivities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              ACTIVITY_COLORS[activity.type]
            )}>
              {ACTIVITY_ICONS[activity.type]}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-gray-900">
                  {activity.leadName}
                </span>
                <span className="text-xs text-gray-400">
                  {ACTIVITY_LABELS[activity.type]}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <User className="w-3 h-3" />
                <span>{activity.createdBy}</span>
                <span>•</span>
                <span>{formatActivityTime(activity.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-sm text-[var(--color-info)] hover:text-[var(--color-info)] 
                     hover:bg-[var(--color-info-surface)] rounded-lg transition-colors"
        >
          {expanded 
            ? 'Mostrar menos' 
            : `Ver ${activities.length - limit} más`
          }
        </button>
      )}
    </div>
  )
}

// Compact version for use in small spaces
export function ActivityFeedCompact({ leadId, limit = 3 }: { leadId?: string; limit?: number }) {
  const [activities, setActivities] = useState<Activity[]>([])
  
  useEffect(() => {
    const mockActivities = generateMockActivities(leadId)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Loading mock data post-mount when leadId/limit changes.
    setActivities(mockActivities.slice(0, limit))
  }, [leadId, limit])
  
  if (activities.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic">Sin actividad reciente</p>
    )
  }
  
  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-2 text-sm">
          <div className={cn(
            "w-5 h-5 rounded-full flex items-center justify-center",
            ACTIVITY_COLORS[activity.type]
          )}>
            {ACTIVITY_ICONS[activity.type]}
          </div>
          <span className="text-gray-600 truncate">{activity.description}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatActivityTime(activity.createdAt)}
          </span>
        </div>
      ))}
    </div>
  )
}
