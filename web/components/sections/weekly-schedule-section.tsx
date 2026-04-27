'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Clock, Users, Flame, ChevronLeft, ChevronRight } from 'lucide-react'

interface Class {
  id: string
  name: string
  description?: string
  instructor_name: string
  day_of_week: number
  start_time: string
  duration_minutes: number
  intensity_level: 'low' | 'medium' | 'high'
  max_capacity: number
  current_bookings: number
}

interface WeeklyScheduleProps {
  classes: Class[]
  onBookClass?: (classId: string, date: string) => void
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const INTENSITY_COLORS = {
  low: 'bg-green-100 text-[var(--success)] border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-[var(--primary)] border-red-200',
}
const INTENSITY_LABELS = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

// Helper to get start of week (Monday)
function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

// Helper to add days
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Helper to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-PY', { day: 'numeric' })
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString('es-PY', { month: 'long', year: 'numeric' })
}

function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function WeeklySchedule({ classes, onBookClass }: WeeklyScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  
  const weekStart = getStartOfWeek(currentWeek)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  
  const getClassesForDay = (dayIndex: number) => {
    return classes
      .filter(c => c.day_of_week === dayIndex)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }
  
  const formatTime = (time: string) => {
    return time.slice(0, 5)
  }
  
  return (
    <Container className="py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Heading level={2} className="text-3xl font-bold">Horario de Clases</Heading>
          <p className="text-[var(--muted-foreground)] mt-1">
            Reserva tu lugar en nuestras clases grupales
          </p>
        </div>
        
        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium min-w-[200px] text-center capitalize">
            {formatMonth(weekStart)}
          </span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Schedule grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, dayIndex) => {
          const dayClasses = getClassesForDay(dayIndex)
          const today = isToday(day)
          
          return (
            <div key={dayIndex} className="min-h-[200px]">
              {/* Day header */}
              <div className={cn(
                "text-center py-3 rounded-t-lg",
                today ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)]"
              )}>
                <div className="text-xs uppercase font-medium">{DAYS[dayIndex]}</div>
                <div className="text-xl font-bold">{formatDate(day)}</div>
              </div>
              
              {/* Classes */}
              <div className="space-y-2 mt-2">
                {dayClasses.length === 0 ? (
                  <div className="text-center py-8 text-sm text-[var(--muted-foreground)]">
                    Sin clases
                  </div>
                ) : (
                  dayClasses.map((cls) => {
                    const isFull = cls.current_bookings >= cls.max_capacity
                    const availabilityPercent = (cls.current_bookings / cls.max_capacity) * 100
                    
                    return (
                      <Card 
                        key={cls.id}
                        className={cn(
                          "cursor-pointer hover:shadow-md transition-shadow",
                          isFull && "opacity-60"
                        )}
                        onClick={() => !isFull && setSelectedClass(cls)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm">{cls.name}</span>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", INTENSITY_COLORS[cls.intensity_level])}
                            >
                              <Flame className="w-3 h-3 mr-1" />
                              {INTENSITY_LABELS[cls.intensity_level]}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-[var(--muted-foreground)] mb-2">
                            {formatTime(cls.start_time)} · {cls.duration_minutes} min
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--muted-foreground)]">
                              {cls.instructor_name}
                            </span>
                            
                            {/* Capacity indicator */}
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-[var(--muted-foreground)]" />
                              <span className={cn(
                                "text-xs",
                                availabilityPercent >= 90 ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                              )}>
                                {cls.current_bookings}/{cls.max_capacity}
                              </span>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-2 h-1 bg-[var(--muted)] rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all",
                                availabilityPercent >= 90 ? "bg-[var(--primary)]" : "bg-[var(--primary)]"
                              )}
                              style={{ width: `${availabilityPercent}%` }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
