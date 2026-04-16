'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ExternalLink,
  Pencil,
  Trash2,
  MapPin,
  Briefcase,
} from 'lucide-react'

interface BusinessItem {
  name: string
  slug: string
  type: string
  city: string
  neighborhood?: string
  services?: Array<{ name: string }>
}

interface AdminFiltersProps {
  businesses: BusinessItem[]
  typeLabels: Record<string, string>
  allTypes: readonly string[]
}

const TYPE_BADGE_STYLES: Record<string, string> = {
  peluqueria: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  salon_belleza: 'bg-[var(--accent)]/10 text-[var(--accent)]',
  gimnasio: 'bg-[var(--success)]/10 text-[var(--success)]',
  spa: 'bg-[var(--secondary)]/10 text-[var(--secondary)]',
  unas: 'bg-[var(--destructive)]/10 text-[var(--destructive)]',
  tatuajes: 'bg-[var(--foreground)]/10 text-[var(--foreground)]',
  barberia: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  estetica: 'bg-[var(--accent)]/10 text-[var(--accent)]',
  maquillaje: 'bg-[var(--warning)]/10 text-[var(--warning)]',
  depilacion: 'bg-[var(--success)]/10 text-[var(--success)]',
  pestanas: 'bg-[var(--secondary)]/10 text-[var(--secondary)]',
}

export default function AdminFilters({
  businesses,
  typeLabels,
  allTypes,
}: AdminFiltersProps) {
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState<string>('todos')

  const filtered = businesses.filter((biz) => {
    const matchesSearch = biz.name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesType =
      activeType === 'todos' || biz.type === activeType
    return matchesSearch && matchesType
  })

  return (
    <div>
      {/* Search + Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar negocio por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveType('todos')}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeType === 'todos'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Todos ({businesses.length})
          </button>
          {allTypes.map((type) => {
            const count = businesses.filter((b) => b.type === type).length
            if (count === 0) return null
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {typeLabels[type] || type} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count */}
      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length} negocio{filtered.length !== 1 ? 's' : ''} encontrado
        {filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Business Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((biz) => (
          <div
            key={biz.slug}
            className="rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
          >
            {/* Header: Name + Type Badge */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{biz.name}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  TYPE_BADGE_STYLES[biz.type] ||
                  'bg-muted text-muted-foreground'
                }`}
              >
                {typeLabels[biz.type] || biz.type}
              </span>
            </div>

            {/* Location */}
            <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>
                {biz.city}
                {biz.neighborhood ? `, ${biz.neighborhood}` : ''}
              </span>
            </div>

            {/* Services Count */}
            {biz.services && biz.services.length > 0 && (
              <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {biz.services.length} servicio
                  {biz.services.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Status */}
            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-[var(--success)]/10 px-2.5 py-0.5 text-xs font-medium text-success">
                Generado
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <Link
                href={`/${biz.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver Sitio
              </Link>
              <Link
                href={`/admin/${biz.slug}/edit`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Link>
              <button
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                onClick={() => {
                  if (
                    window.confirm(
                      `Estas seguro de que quieres eliminar "${biz.name}"?`
                    )
                  ) {
                    fetch(`/api/businesses/${biz.slug}`, {
                      method: 'DELETE',
                    })
                      .then((res) => {
                        if (res.ok) {
                          window.location.reload()
                        } else {
                          console.error(
                            '[AdminFilters] Delete failed:',
                            res.status
                          )
                        }
                      })
                      .catch((err) => {
                        console.error('[AdminFilters] Delete error:', err)
                      })
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-lg border border-border bg-card py-16 text-center">
          <p className="text-lg font-medium text-foreground">
            No se encontraron negocios
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Intenta con otro termino de busqueda o filtro.
          </p>
        </div>
      )}
    </div>
  )
}
