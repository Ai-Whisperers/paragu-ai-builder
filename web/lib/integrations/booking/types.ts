export interface BookingEmbed {
  provider: string
  html: string
  fallbackUrl: string
}

export interface BookingAdapter {
  name: string
  buildEmbed(url: string, opts?: { locale?: string; prefill?: Record<string, string> }): BookingEmbed
}
