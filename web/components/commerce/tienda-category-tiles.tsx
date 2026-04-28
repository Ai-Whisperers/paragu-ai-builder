import Link from 'next/link'

interface Props {
  siteSlug: string
  locale: string
  availableCategories: string[]
  categoryCounts?: Record<string, number>
}

interface TileDef {
  label: string
  description: string
  icon: React.ReactNode
  bgImage: string
}

const CATEGORY_STYLES: Record<string, TileDef> = {
  Camping: {
    label: 'Camping',
    description: 'Carpas, bolsas, colchones',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20L12 4l8 16" /><path d="M2 20h20" /><path d="M8 12l4-2 4 2" />
      </svg>
    ),
    bgImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
  },
  Pesca: {
    label: 'Pesca',
    description: 'Canas, reels, senuelos',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2a4 4 0 0 0-4 4v7" /><path d="M18 6l-4 7" /><path d="M4 16c0-2 2-4 4-4s4 2 4 4-2 4-4 4-4-2-4-4z" /><path d="M14 13c1.5 0 4 1 4 3s-2.5 3-4 3" />
      </svg>
    ),
    bgImage: 'https://images.unsplash.com/photo-1575880963075-51d727bb1c12?w=600&q=80',
  },
  'Acc. Personales': {
    label: 'Acc. Personales',
    description: 'Mochilas, cuchillos, brujulas',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6a6 6 0 0 1 12 0v4a6 6 0 0 1-12 0V6z" /><path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" /><path d="M12 10v4" />
      </svg>
    ),
    bgImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  },
  Automoviles: {
    label: 'Automoviles',
    description: 'Dashcams, GPS, infladores',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14l2-6-1-4H4l-1 4 2 6z" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 7h6l2 4H7l2-4z" />
      </svg>
    ),
    bgImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
  },
  Motos: {
    label: 'Motos',
    description: 'Cascos, guantes, GPS',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l2-10h5l3 5 2 5" /><path d="M2 17h4" /><path d="M18 17h4" />
      </svg>
    ),
    bgImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80',
  },
  Campo: {
    label: 'Campo y Granja',
    description: 'Herramientas, cercas, bebederos',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22V8l10-6 10 6v14" /><path d="M8 22v-8h8v8" /><path d="M12 2v6" />
      </svg>
    ),
    bgImage: 'https://images.unsplash.com/photo-1593113598336-86d3a9cb3f79?w=600&q=80',
  },
  'Tactico/Defensa': {
    label: 'Tactico y Defensa',
    description: 'Cuchillos, linternas, gas',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H10l-1.5 8h7L14.5 2z" /><path d="M8.5 10l-2 12h11l-2-12" /><path d="M12 10v4" /><circle cx="12" cy="18" r="1" />
      </svg>
    ),
    bgImage: 'https://images.unsplash.com/photo-1621800361987-87dfc24e605b?w=600&q=80',
  },
}

function fallbackTile(cat: string): TileDef {
  return {
    label: cat,
    description: 'Productos',
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
      </svg>
    ),
    bgImage: '',
  }
}

export function TiendaCategoryTiles({ siteSlug, locale, availableCategories, categoryCounts }: Props) {
  const tiles = availableCategories
    .map((cat) => {
      const style = CATEGORY_STYLES[cat] ?? fallbackTile(cat)
      const count = categoryCounts?.[cat] ?? 0
      return { category: cat, ...style, count }
    })
    .filter((t) => t.count > 0)

  if (tiles.length < 3) return null

  return (
    <nav aria-label="Categorias principales" className="mb-6">
      {/* Mobile: horizontal scroll. Desktop: grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.category}
            href={`/s/${locale}/${siteSlug}/tienda?category=${encodeURIComponent(tile.category)}`}
            className="group relative flex w-44 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl border border-[color:var(--border,#e5e7eb)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] sm:w-auto sm:aspect-[3/2]"
          >
            {/* Background image */}
            {tile.bgImage ? (
              <div className="absolute inset-0">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${tile.bgImage})` }}
                />
              </div>
            ) : null}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-[color:var(--primary,#111)] shadow-sm backdrop-blur-sm">
              {tile.icon}
            </span>
            <p className="relative z-10 mt-2 text-base font-bold text-white drop-shadow-sm">{tile.label}</p>
            <p className="relative z-10 text-xs text-white/80 drop-shadow-sm">
              {tile.description}
              {tile.count > 0 ? ` · ${tile.count}` : ''}
            </p>
          </Link>
        ))}
      </div>
    </nav>
  )
}
