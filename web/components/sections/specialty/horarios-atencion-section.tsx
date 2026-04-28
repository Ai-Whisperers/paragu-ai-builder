'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface HorariosAtencionSectionProps {
  title?: string
  hours?: Record<string, string>
  variant?: 'table' | 'list' | 'badge' | 'inline'
  showStatus?: boolean
  timezone?: string
  __locale?: string
}

const DAY_ORDER = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const DAY_KEYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const DAY_KEYS_ALT = ['Lunes a Viernes', 'Lunes - Viernes', 'Lunes-Viernes', 'Sábado', 'Sabado', 'Domingo']

function isOpenNow(hours: Record<string, string>): boolean {
  const now = new Date()
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const todayName = dayNames[now.getDay()]
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  for (const [key, val] of Object.entries(hours)) {
    if (val.toLowerCase() === 'cerrado') continue
    if (key.includes(todayName) || key.includes('Lunes a Viernes') && now.getDay() >= 1 && now.getDay() <= 5) {
      const match = val.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
      if (match) {
        const openMin = parseInt(match[1]) * 60 + parseInt(match[2])
        const closeMin = parseInt(match[3]) * 60 + parseInt(match[4])
        if (currentMinutes >= openMin && currentMinutes < closeMin) return true
      }
    }
  }
  return false
}

export function HorariosAtencionSection({
  title = 'Horarios de atención',
  hours = {},
  variant = 'table',
  showStatus = true,
}: HorariosAtencionSectionProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!Object.keys(hours).length) return null

  const open = mounted ? isOpenNow(hours) : null

  const rows: Array<{ day: string; time: string }> = []
  for (const key of DAY_KEYS) {
    if (hours[key]) rows.push({ day: key, time: hours[key] })
  }
  for (const key of DAY_KEYS_ALT) {
    if (!rows.find((r) => r.day === key) && hours[key]) rows.push({ day: key, time: hours[key] })
  }
  for (const [key, val] of Object.entries(hours)) {
    if (!rows.find((r) => r.day === key)) rows.push({ day: key, time: val })
  }

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        open ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
      }`}>
        {mounted && (open ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />)}
        {mounted ? (open ? 'Abierto ahora' : 'Cerrado ahora') : 'Cargando...'}
      </span>
    )
  }

  if (variant === 'inline') {
    const firstRow = rows[0]
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-primary" />
        <span>
          {showStatus && mounted && (
            <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${open ? 'bg-green-500' : 'bg-gray-300'}`} />
          )}
          {firstRow?.day} {firstRow?.time}
        </span>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mx-auto max-w-md">
            <Heading level={3} className="mb-4 text-center">{title}</Heading>
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.day} className="flex items-center justify-between border-b border-border pb-2 text-sm">
                  <span className="font-medium text-foreground">{row.day}</span>
                  <span className={row.time.toLowerCase() === 'cerrado' ? 'text-red-500' : 'text-muted-foreground'}>
                    {row.time}
                  </span>
                </div>
              ))}
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
          {showStatus && mounted && (
            <div className={`mb-4 flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium ${
              open ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
            }`}>
              {open ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {open ? 'Abierto ahora' : 'Cerrado ahora'}
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row) => (
                <tr key={row.day} className="border-b border-border">
                  <td className="py-2.5 font-medium text-foreground">{row.day}</td>
                  <td className={`py-2.5 text-right ${row.time.toLowerCase() === 'cerrado' ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {row.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  )
}
