import Link from 'next/link'
import Image from 'next/image'

interface Props {
  siteSlug: string
  locale: string
  whatsappNumber?: string
}

const HERO_CATEGORIES = [
  { slug: 'Camping', label: 'Camping' },
  { slug: 'Pesca', label: 'Pesca' },
  { slug: 'Tactico/Defensa', label: 'Tactico' },
  { slug: 'Automoviles', label: 'Automoviles' },
  { slug: 'Motos', label: 'Motos' },
  { slug: 'Campo', label: 'Campo' },
]

export function TiendaHero({ siteSlug, locale, whatsappNumber }: Props) {
  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola! Quiero info sobre productos.')}`
    : '#'

  return (
    <section className="relative mb-8 overflow-hidden rounded-xl">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80"
          alt="Camping al aire libre"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Gradient overlay — dark on left, fades to transparent */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex aspect-video flex-col justify-center px-6 py-10 sm:aspect-[21/9] sm:px-10 sm:py-16 lg:px-16">
        <h1 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
          Equipate para tu proxima aventura
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
          Camping, pesca, equipo tactico, accesorios para auto y moto.
          Todo lo que necesitas para tu proxima escapada.
        </p>

        {/* CTAs */}
        <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-6">
          <a
            href="#catalogo"
            className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent,#E65100)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Ver Catalogo
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Hablanos por WhatsApp
          </a>
        </div>

        {/* Mini category pills */}
        <nav aria-label="Categorias rapidas" className="mt-4 flex flex-wrap gap-2 sm:mt-6">
          {HERO_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/s/${locale}/${siteSlug}/tienda?category=${encodeURIComponent(cat.slug)}`}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
