'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { cleanPhone } from '@/lib/format'
import { Card, CardContent, CardImage } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { useEffect, useMemo, useState } from 'react'

export interface PropertyListing {
  id: string
  title: string
  type: 'venta' | 'alquiler' | 'temporal'
  propertyType: string
  price: string
  priceCurrency?: string
  neighborhood?: string
  city?: string
  bedrooms?: number
  bathrooms?: number
  area?: string
  imageUrl?: string
  description?: string
  features?: string[]
  featured?: boolean
  whatsappMessage?: string
}

export interface PropertyListingsSectionProps {
  title: string
  subtitle?: string
  /** Static listings. Ignored when `fetchFromApi` is set. */
  properties?: PropertyListing[]
  whatsappPhone?: string
  showFilters?: boolean
  /** Locale-aware transaction type labels. Falls back to TRANSACTION_LABELS. */
  transactionLabels?: Record<string, string>
  /**
   * When present, the section fetches /api/properties?siteSlug=... on mount
   * and renders the returned rows instead of static `properties`. Use for
   * tenants backed by the Supabase `properties` table (Nexa Propiedades).
   */
  fetchFromApi?: {
    siteSlug: string
    apiBase?: string
  }
}

interface ApiPropertyRow {
  id: string
  title: string
  transaction: 'venta' | 'alquiler' | 'temporal'
  property_type: string
  price: number
  price_currency: string
  neighborhood?: string | null
  city?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  area_m2?: number | null
  description?: string | null
  features?: unknown
  images?: unknown
  featured?: boolean
  whatsapp_message?: string | null
}

function apiRowToListing(row: ApiPropertyRow): PropertyListing {
  const images = Array.isArray(row.images) ? (row.images as string[]) : []
  return {
    id: row.id,
    title: row.title,
    type: row.transaction,
    propertyType: row.property_type,
    price: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: row.price_currency || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(row.price)),
    priceCurrency: row.price_currency,
    neighborhood: row.neighborhood ?? undefined,
    city: row.city ?? undefined,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    area: row.area_m2 ? `${row.area_m2} m²` : undefined,
    imageUrl: images[0],
    description: row.description ?? undefined,
    features: Array.isArray(row.features) ? (row.features as string[]) : undefined,
    featured: row.featured ?? false,
    whatsappMessage: row.whatsapp_message ?? undefined,
  }
}

const TRANSACTION_LABELS: Record<PropertyListing['type'], string> = {
  venta: 'En Venta',
  alquiler: 'En Alquiler',
  temporal: 'Alquiler Temporal',
}

function buildWhatsAppUrl(phone: string, property: PropertyListing, transactionLabels: Record<string, string>): string {
  const cleaned = cleanPhone(phone)
  const message =
    property.whatsappMessage ??
    `Hola, me interesa la propiedad "${property.title}" (${transactionLabels[property.type]}). Quisiera mas informacion.`
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}

export function PropertyListingsSection({
  title,
  subtitle,
  properties: staticProperties,
  whatsappPhone,
  showFilters = true,
  fetchFromApi,
  transactionLabels: transactionLabelsProp,
}: PropertyListingsSectionProps) {
  const labels = transactionLabelsProp ?? TRANSACTION_LABELS
  const [transactionFilter, setTransactionFilter] = useState<string>('all')
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all')
  const [apiProperties, setApiProperties] = useState<PropertyListing[] | null>(
    fetchFromApi ? null : null,
  )
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (!fetchFromApi) return
    const base = fetchFromApi.apiBase || ''
    const url = `${base}/api/properties?siteSlug=${encodeURIComponent(fetchFromApi.siteSlug)}&pageSize=50`
    let cancelled = false
    fetch(url)
      .then((r) => r.json())
      .then((json: { data?: ApiPropertyRow[]; note?: string }) => {
        if (cancelled) return
        setApiProperties((json.data || []).map(apiRowToListing))
        if (json.note) setApiError(json.note)
      })
      .catch((e: Error) => {
        if (cancelled) return
        setApiError(e.message)
        setApiProperties([])
      })
    return () => {
      cancelled = true
    }
  }, [fetchFromApi])

  const properties: PropertyListing[] = fetchFromApi
    ? apiProperties ?? []
    : staticProperties ?? []
  const isLoading = fetchFromApi && apiProperties === null

  const propertyTypes = useMemo(() => {
    const seen = new Set<string>()
    for (const p of properties) seen.add(p.propertyType)
    return Array.from(seen)
  }, [properties])

  const visible = useMemo(
    () =>
      properties.filter(
        (p) =>
          (transactionFilter === 'all' || p.type === transactionFilter) &&
          (propertyTypeFilter === 'all' || p.propertyType === propertyTypeFilter),
      ),
    [properties, transactionFilter, propertyTypeFilter],
  )

  return (
    <section className="py-16 bg-[var(--background)]">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
        </AnimatedSectionHeader>

        {showFilters && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <select
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[var(--surface-light)] bg-[var(--surface)] text-[var(--text)]"
            >
              <option value="all">Todas las operaciones</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="temporal">Temporal</option>
            </select>
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[var(--surface-light)] bg-[var(--surface)] text-[var(--text)]"
            >
              <option value="all">Todos los tipos</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((property) => (
            <Card key={property.id} className="overflow-hidden h-full flex flex-col">
              {property.imageUrl && (
                <div className="relative">
                  <CardImage src={property.imageUrl} alt={property.title} />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge>{labels[property.type]}</Badge>
                    {property.featured && <Badge variant="secondary">Destacada</Badge>}
                  </div>
                </div>
              )}
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    {property.propertyType}
                  </span>
                  <Heading level={3} className="font-semibold text-lg text-[var(--text)] mt-1">{property.title}</Heading>
                  {(property.neighborhood || property.city) && (
                    <p className="text-sm text-[var(--text-muted)]">
                      {[property.neighborhood, property.city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-[var(--text-muted)] mb-3">
                  {property.bedrooms !== undefined && <span>{property.bedrooms} dorm.</span>}
                  {property.bathrooms !== undefined && <span>{property.bathrooms} baños</span>}
                  {property.area && <span>{property.area}</span>}
                </div>

                {property.description && (
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">
                    {property.description}
                  </p>
                )}

                <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-[var(--surface-light)]">
                  <span className="font-bold text-[var(--primary)]">{property.price}</span>
                  {whatsappPhone && (
                    <Button asChild size="sm">
                      <a href={buildWhatsAppUrl(whatsappPhone, property, labels)} target="_blank" rel="noopener noreferrer">
                        Consultar
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading && (
          <p className="text-center text-[var(--text-muted)] py-8">Cargando propiedades…</p>
        )}
        {!isLoading && visible.length === 0 && (
          <p className="text-center text-[var(--text-muted)] py-8">
            {apiError
              ? 'No hay propiedades publicadas todavía.'
              : 'No hay propiedades que coincidan con los filtros seleccionados.'}
          </p>
        )}
      </Container>
    </section>
  )
}
