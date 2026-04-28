'use client'

// Turbopack strictly forbids functions crossing the server→client
// boundary. The lightbox variant below uses a render-prop children
// (`<ImageLightbox>{({open}) => ...}</ImageLightbox>`) — that pattern
// is only valid when this parent is ALSO a client component. Making
// the whole section client is the cheapest fix; the non-lightbox
// branch renders plain img grids and has no interactive cost.
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ImageLightbox } from '@/components/ui/image-lightbox'

export interface GalleryImage {
  src: string
  alt: string
  category?: string
}

export interface GallerySectionProps {
  title: string
  subtitle?: string
  images?: GalleryImage[]
  /** Legacy alias — some content files ship `logos` with {name, image} instead of {src, alt}. */
  logos?: Array<{ name?: string; image?: string; alt?: string; src?: string }>
  columns?: 2 | 3 | 4
  /**
   * When true, tiles become buttons that open the image in an accessible
   * lightbox with keyboard nav. Defaults to false for backward compat —
   * callers must opt in by passing `lightbox: true` (or the `lightbox`
   * variant via the section registry).
   */
  lightbox?: boolean
  /**
   * When false, suppresses the hover-category overlay. Useful on
   * legal/serious pages where the decorative overlay feels out of
   * place. Default true for back-compat.
   */
  showCategory?: boolean
  /** Locale-aware labels for the lightbox controls. */
  __locale?: string
}

const LIGHTBOX_LABELS: Record<string, { prev: string; next: string; close: string; dialog: string; open: string }> = {
  en: { prev: 'Previous image', next: 'Next image', close: 'Close', dialog: 'Image gallery', open: 'Open image' },
  es: { prev: 'Imagen anterior', next: 'Siguiente imagen', close: 'Cerrar', dialog: 'Galería de imágenes', open: 'Abrir imagen' },
  nl: { prev: 'Vorige afbeelding', next: 'Volgende afbeelding', close: 'Sluiten', dialog: 'Afbeeldingengalerij', open: 'Afbeelding openen' },
  de: { prev: 'Vorheriges Bild', next: 'Nächstes Bild', close: 'Schließen', dialog: 'Bildergalerie', open: 'Bild öffnen' },
  pt: { prev: 'Imagem anterior', next: 'Próxima imagem', close: 'Fechar', dialog: 'Galeria de imagens', open: 'Abrir imagem' },
}

export function GallerySection({
  title,
  subtitle,
  images: imagesProp,
  logos,
  columns = 3,
  lightbox = false,
  showCategory = true,
  __locale,
}: GallerySectionProps) {
  const images: GalleryImage[] =
    imagesProp || (logos?.map((l) => ({ src: l.src || l.image || '', alt: l.alt || l.name || '' })) ?? [])
  if (images.length === 0) return null
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const labels = LIGHTBOX_LABELS[__locale ?? 'es'] ?? LIGHTBOX_LABELS.es

  const grid = (renderTile: (image: GalleryImage, index: number) => React.ReactNode) => (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {images.map(renderTile)}
    </div>
  )

  const tileContent = (image: GalleryImage) => (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-slow group-hover:scale-110"
        // SVG data-URIs and external hosts we can't preoptimize stay unoptimized;
        // next/image still gets us lazy-loading + blur/srcset for remote HTTPS.
        unoptimized={image.src.startsWith('data:')}
      />
      {showCategory && image.category && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-normal group-hover:opacity-100">
          <span className="text-sm font-medium text-white">{image.category}</span>
        </div>
      )}
    </>
  )

  return (
    <section id="galeria" className="bg-background py-16 sm:py-20">
      <Container>
        <div className="mb-12 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {lightbox ? (
          <ImageLightbox
            images={images.map((i) => ({ src: i.src, alt: i.alt, caption: i.category }))}
            labelPrev={labels.prev}
            labelNext={labels.next}
            labelClose={labels.close}
            labelDialog={labels.dialog}
          >
            {({ open }) =>
              grid((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => open(index)}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-surface-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`${labels.open}: ${image.alt}`}
                >
                  {tileContent(image)}
                </button>
              ))
            }
          </ImageLightbox>
        ) : (
          grid((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg bg-surface-light"
            >
              {tileContent(image)}
            </div>
          ))
        )}
      </Container>
    </section>
  )
}
