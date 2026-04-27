'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface GoogleMapsSectionProps {
  title?: string
  subtitle?: string
  address?: string
  city?: string
  query?: string
  zoom?: number
  height?: number
}

export function GoogleMapsSection({
  title,
  subtitle,
  address,
  city,
  query,
  zoom = 15,
  height = 400,
}: GoogleMapsSectionProps) {
  const searchQuery = query || `${address || ''} ${city || ''} Asunción Paraguay`.trim()
  const encodedQuery = encodeURIComponent(searchQuery)
  const mapUrl = `https://www.google.com/maps?q=${encodedQuery}&z=${zoom}&output=embed`
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`

  return (
    <section className="bg-[var(--background)] py-12 sm:py-16">
      <Container>
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && <p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>}
          </div>
        )}
        <div className="rounded-lg overflow-hidden shadow-card" style={{ height }}>
          <iframe
            src={mapUrl}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title || 'Ubicación'}
          />
        </div>
        {address && (
          <div className="mt-4 text-center">
            <p className="text-[var(--text-muted)]">{address}{city ? `, ${city}` : ''}</p>
            <a
              href={dirUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-[var(--primary)] hover:underline"
            >
              Abrir en Google Maps →
            </a>
          </div>
        )}
      </Container>
    </section>
  )
}
