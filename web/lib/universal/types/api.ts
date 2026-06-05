// API Request/Response types - centralized

// Booking
export interface CreateBookingRequest {
  client_name: string
  phone: string
  service: string
  preferred_date?: string | null
  notes?: string | null
  source?: string
}

export interface BookingResponse {
  ok: boolean
  method?: "database"
  id?: string
}

// Contact
export interface ContactRequest {
  email: string
  name?: string | null
  message?: string | null
  source?: string
}

// Subscribe
export interface SubscribeRequest {
  email: string
  name?: string | null
  lang?: string
}

// Gift Card
export interface GiftCardPurchaseRequest {
  amount: number
  card_name?: string
  buyer_phone?: string
  recipient_phone?: string
  recipient_name?: string
  message?: string
}

// Admin responses
export interface BookingsListResponse {
  bookings: Booking[]
}

export interface AdminErrorResponse {
  error: string
}

export interface Booking {
  id: string
  client_name: string
  phone: string
  service: string
  preferred_date?: string | null
  notes?: string | null
  source?: string
  created_at?: string
  status?: string
}
