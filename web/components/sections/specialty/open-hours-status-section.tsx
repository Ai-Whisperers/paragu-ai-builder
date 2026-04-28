'use client'

import { Container } from '@/components/ui/container'
import { useEffect, useState } from 'react'

/**
 * Open-now status — computes real-time open/closed state from an hours map.
 *
 * Hours format: keys like "Lunes", "Martes", ... with value "HH:MM - HH:MM"
 * or "Cerrado". For multi-range days use comma-separated: "12:00 - 15:00, 19:00 - 23:00".
 */

const DAY_KEYS = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

function parseRanges(value: string | undefined): Array<[number, number]> {
  if (!value || /cerrado/i.test(value)) return []
  return value.split(',').map((chunk) => {
    const m = chunk.trim().match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
    if (!m) return [0, 0] as [number, number]
    return [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])]
  })
}

function isOpen(hours: Record<string, string>, now: Date): boolean {
  const dayName = DAY_KEYS[now.getDay()]
  const value = hours[dayName] || hours[Object.keys(hours).find((k) => k.includes(dayName)) || ''] || ''
  const minutes = now.getHours() * 60 + now.getMinutes()
  return parseRanges(value).some(([a, b]) => minutes >= a && minutes <= b)
}

export interface OpenHoursStatusProps {
  hours: Record<string, string>
  openLabel?: string
  closedLabel?: string
  showHours?: boolean
}

export function OpenHoursStatusSection({
  hours,
  openLabel = 'Abierto ahora',
  closedLabel = 'Cerrado',
  showHours = true,
}: OpenHoursStatusProps) {
  const safeHours = hours || {}
  const [open, setOpen] = useState<boolean | null>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Deferring Date computation to post-mount avoids SSR/client hydration mismatch.
    setOpen(isOpen(safeHours, new Date()))
  }, [safeHours])

  if (open === null) return null
  return (
    <section className="py-4 bg-surface">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              backgroundColor: open ? '#DEF7EC' : '#FEE2E2',
              color: open ? '#03543F' : '#991B1B',
            }}
          >
            <span>●</span>
            <span>{open ? openLabel : closedLabel}</span>
          </span>
          {showHours && (
            <div className="text-muted-foreground">
              {Object.entries(safeHours).map(([day, range], i) => (
                <span key={i} className="mr-3">
                  <strong>{day}:</strong> {range}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
