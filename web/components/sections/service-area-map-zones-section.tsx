import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

/**
 * Service-area map with named zones. Avoids Google Maps API cost by rendering
 * a static embed; the real value is the zones list (pricing, transit time,
 * on-demand vs scheduled, etc.).
 */

export interface ServiceAreaMapZonesProps {
  title?: string
  subtitle?: string
  mapEmbedUrl?: string
  zones: Array<{
    name: string
    neighborhoods?: string[]
    price?: string
    etaMinutes?: number
    available?: boolean
    note?: string
  }>
}

export function ServiceAreaMapZonesSection({
  title = 'Zonas de cobertura',
  subtitle,
  mapEmbedUrl,
  zones,
}: ServiceAreaMapZonesProps) {
  return (
    <section className="py-14 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {mapEmbedUrl && (
            <div className="aspect-video md:aspect-square rounded-lg overflow-hidden bg-[var(--surface-light)]">
              <iframe
                src={mapEmbedUrl}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de zonas"
              />
            </div>
          )}
          <div className="space-y-3">
            {zones.map((z, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--surface-light)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[var(--text)]">{z.name}</div>
                    {z.neighborhoods && z.neighborhoods.length > 0 && (
                      <div className="text-xs text-[var(--text-muted)]">
                        {z.neighborhoods.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    {z.price && <div className="font-semibold text-[var(--primary)]">{z.price}</div>}
                    {z.etaMinutes !== undefined && (
                      <div className="text-xs text-[var(--text-muted)]">{z.etaMinutes} min</div>
                    )}
                  </div>
                </div>
                {z.note && <p className="mt-2 text-xs text-[var(--text-muted)]">{z.note}</p>}
                {z.available === false && (
                  <p className="mt-2 text-xs text-[var(--primary)]">Temporalmente no disponible</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
