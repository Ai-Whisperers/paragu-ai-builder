'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { Sprout, X } from 'lucide-react'

export interface FarmCategory {
  name: string
  images: Array<{ src: string; alt: string; caption?: string }>
}

export interface FarmGallerySectionProps {
  title?: string
  subtitle?: string
  categories?: FarmCategory[]
  variant?: 'grid' | 'tour'
  __locale?: string
}

export function FarmGallerySection({
  title = 'Nuestra granja',
  subtitle = 'Conocé nuestras instalaciones',
  categories = [],
  variant = 'grid',
}: FarmGallerySectionProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const [activeCat, setActiveCat] = useState('')

  const allCategories = categories.map((c) => c.name)
  const filtered = activeCat ? categories.filter((c) => c.name === activeCat) : categories
  const allImages = filtered.flatMap((c) => c.images)

  if (!categories?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 text-center">
          <Sprout className="mx-auto mb-2 h-8 w-8 text-primary" />
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        {allCategories.length > 1 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            <button onClick={() => setActiveCat('')} className={`rounded-full px-4 py-1.5 text-xs font-medium ${!activeCat ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground'}`}>Todas</button>
            {allCategories.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={`rounded-full px-4 py-1.5 text-xs font-medium ${activeCat === c ? 'bg-primary text-white' : 'bg-surface-light text-muted-foreground'}`}>{c}</button>
            ))}
          </div>
        )}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {allImages.map((img, i) => (
            <button key={i} onClick={() => setLightbox(img)} className="group mb-4 block w-full overflow-hidden rounded-xl">
              <img src={img.src} alt={img.alt} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              {img.caption && <p className="mt-1 text-xs text-muted-foreground">{img.caption}</p>}
            </button>
          ))}
        </div>
        {lightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white"><X className="h-6 w-6" /></button>
            <img src={lightbox.src} alt={lightbox.alt} className="max-h-[85vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </Container>
    </Section>
  )
}
