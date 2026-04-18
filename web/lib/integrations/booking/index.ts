import type { BookingAdapter } from './types'
import { calendlyAdapter } from './calendly'
import { calcomAdapter } from './calcom'

const ADAPTERS: Record<string, BookingAdapter> = {
  calendly: calendlyAdapter,
  'cal.com': calcomAdapter,
  calcom: calcomAdapter,
}

export function getBookingAdapter(name: string | undefined): BookingAdapter | null {
  if (!name) return null
  return ADAPTERS[name.toLowerCase()] || null
}

export type { BookingAdapter, BookingEmbed } from './types'
