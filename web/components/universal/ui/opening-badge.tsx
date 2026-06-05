/**
 * ANNOTATION: OpeningBadge
 * 
 * What it is: A real-time "Open" / "Closed" badge that computes current status by comparing the current time against your configured business hours schedule.
 * 
 * Why your business needs it: Tells visitors at a glance whether your business is currently open, reducing uncertainty and preventing frustration from after-hours contact attempts.
 * 
 * What AI populates from your data: ParaguAI reads your weekly business hours schedule from configuration and computes open/closed status automatically.
 * 
 * Your input: Your daily opening and closing times for each day of the week.
 * 
 * Plan availability: All plans
 */
"use client"
import { useEffect, useState } from "react"

interface HoursConfig {
  open: number   // hour (0-23)
  close: number  // hour (0-23)
  closedDays: number[]  // 0=Sun, 1=Mon, ... 6=Sat
}

const DEFAULT_CONFIG: HoursConfig = {
  open: 9,
  close: 19,
  closedDays: [0, 1], // Sunday, Monday
}

function isOpen(config: HoursConfig = DEFAULT_CONFIG): boolean {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()

  if (config.closedDays.includes(day)) return false
  return hour >= config.open && hour < config.close
}

function getNextOpen(config: HoursConfig = DEFAULT_CONFIG): string {
  const now = new Date()
  const day = now.getDay()

  // Find next open day
  for (let i = 1; i <= 7; i++) {
    const checkDay = (day + i) % 7
    if (!config.closedDays.includes(checkDay)) {
      const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
      return `Abre ${dayNames[checkDay]} a las ${config.open}:00`
    }
  }
  return "Consultá por WhatsApp"
}

export function OpeningBadge() {
  const [open, setOpen] = useState<boolean | null>(null)
  const [nextOpen, setNextOpen] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMounted(true)
      const result = isOpen()
      setOpen(result)
      setNextOpen(getNextOpen())
    }, 0)
    const interval = setInterval(() => {
      const r = isOpen()
      setOpen(r)
      setNextOpen(getNextOpen())
    }, 60000)
    return () => {
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, [])

  if (!mounted) return null

  const colorClass = open ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
  const dotClass = open ? "bg-green-500 animate-pulse" : "bg-red-500"

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold leading-tight ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {open ? "Abierto" : "Cerrado"}
      {!open && nextOpen && (
        <span className="font-normal opacity-80 ml-0.5 hidden lg:inline">· {nextOpen}</span>
      )}
    </span>
  )
}