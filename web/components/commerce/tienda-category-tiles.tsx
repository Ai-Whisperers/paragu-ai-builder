/**
 * 4 big category tiles for the top of the /tienda grid. Replaces "click
 * through a wall of lowercase chips" as the primary entry into the
 * catalog. Icons are inline SVG so no lucide import bloat — each tile
 * links to /tienda?category=<slug> so the existing filter logic handles
 * selection.
 *
 * Display rule: a tile is only rendered if the underlying category has
 * at least one product (checked via categoryCounts). If fewer than 3
 * tiles would render, the whole block collapses — the tenant isn't at
 * scale yet and the chips below are enough.
 */
import Link from 'next/link'

interface Props {
  siteSlug: string
  locale: string
  availableCategories: string[]
  categoryCounts?: Record<string, number>
}

interface Tile {
  category: string
  label: string
  description: string
  icon: React.ReactNode
  /** Gradient bg for the tile — deliberately muted so the category
   * wordmark stays dominant. */
  accent: string
}

const TILES: Tile[] = [
  {
    category: 'parejas',
    label: 'Parejas',
    description: 'Para compartir',
    icon: (
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    accent: 'from-pink-50 to-rose-50',
  },
  {
    category: 'vibradores',
    label: 'Para ella',
    description: 'Placer femenino',
    icon: (
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9 2 7 4 7 7v10a5 5 0 0 0 10 0V7c0-3-2-5-5-5z" />
      </svg>
    ),
    accent: 'from-purple-50 to-fuchsia-50',
  },
  {
    category: 'dildos',
    label: 'Para él',
    description: 'Placer masculino',
    icon: (
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M7 12h10" />
      </svg>
    ),
    accent: 'from-blue-50 to-indigo-50',
  },
  {
    category: 'lubricantes',
    label: 'Lubricantes',
    description: 'Bienestar íntimo',
    icon: (
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" />
      </svg>
    ),
    accent: 'from-amber-50 to-orange-50',
  },
]

export function TiendaCategoryTiles({ siteSlug, locale, availableCategories, categoryCounts }: Props) {
  // Only render tiles for categories that have at least one product
  // available in the current shop. Keeps the row honest.
  const available = TILES.filter((t) => availableCategories.includes(t.category))
  if (available.length < 3) return null

  return (
    <nav aria-label="Categorías principales" className="mb-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {available.map((tile) => {
          const count = categoryCounts?.[tile.category] ?? 0
          return (
            <Link
              key={tile.category}
              href={`/s/${locale}/${siteSlug}/tienda?category=${encodeURIComponent(tile.category)}`}
              className={`group flex flex-col items-start gap-1 rounded-xl border border-[color:var(--border,#e5e7eb)] bg-gradient-to-br ${tile.accent} p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 text-[color:var(--primary,#111)] shadow-sm group-hover:bg-white">
                {tile.icon}
              </span>
              <p className="mt-2 text-base font-semibold text-[color:var(--text,#111)]">{tile.label}</p>
              <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
                {tile.description}
                {count > 0 ? ` · ${count}` : ''}
              </p>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
