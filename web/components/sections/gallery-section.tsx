import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface GalleryImage {
  src: string
  alt: string
  category?: string
}

export interface GallerySectionProps {
  title: string
  subtitle?: string
  images: GalleryImage[]
  columns?: 2 | 3 | 4
}

export function GallerySection({
  title,
  subtitle,
  images,
  columns = 3,
}: GallerySectionProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <section id="galeria" className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        <div className={`grid gap-4 ${gridCols[columns]}`}>
          {images.map((image, index) => (
            <AnimateOnScroll key={index} stagger={index}>
              <div className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--surface-light)]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-110"
                  loading="lazy"
                />
                {image.category && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-normal group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">{image.category}</span>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}
