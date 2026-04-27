export interface BookingService {
  name: string
  duration: number
  price?: number
}

export interface BookingSlot {
  start: string
  end: string
  available: boolean
}
