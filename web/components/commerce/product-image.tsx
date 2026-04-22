import Image from 'next/image'
import type { ProductImage as ProductImageData } from '@/lib/schemas/commerce/product'

interface Props {
  image: ProductImageData | null | undefined
  alt: string
  aspectRatio?: '1:1' | '4:5' | '16:9'
  priority?: boolean
  sizes?: string
  className?: string
  isSeed?: boolean
}

const ASPECT_CLASS: Record<NonNullable<Props['aspectRatio']>, string> = {
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
  '16:9': 'aspect-video',
}

/**
 * Seed products ship with a `data:image/svg+xml...linearGradient...` URL
 * in the `url` field — a colorful gradient with the product name in big
 * white letters, shipped straight from the catalog seed script. That
 * renders as "Wall of Skittles PowerPoint 2005" on the storefront grid.
 *
 * Until real product photography lands, we detect those gradient data
 * URLs and render the neutral placeholder instead. Real images (http(s),
 * cloudinary, supabase storage) pass through unchanged.
 */
function isSeedGradient(url: string | undefined): boolean {
  if (!url) return false
  return url.startsWith('data:image/svg+xml')
}

function NeutralPlaceholder({
  aspectRatio,
  className,
  alt,
  isSeed,
}: Pick<Props, 'aspectRatio' | 'className' | 'alt' | 'isSeed'>) {
  const ratio = aspectRatio ?? '4:5'
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-[color:var(--surface-muted,#f3f4f6)] ${ASPECT_CLASS[ratio]} ${className ?? ''}`}
      aria-label={alt}
    >
      <svg
        aria-hidden="true"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[color:var(--text-muted,#9ca3af)]"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      {isSeed && process.env.NODE_ENV !== 'production' ? (
        <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
          Ejemplo
        </span>
      ) : null}
    </div>
  )
}

export function ProductImage({ image, alt, aspectRatio = '4:5', priority, sizes, className, isSeed }: Props) {
  // No image → neutral placeholder.
  if (!image?.url) {
    return <NeutralPlaceholder aspectRatio={aspectRatio} className={className} alt={alt} isSeed={isSeed} />
  }

  // Gradient placeholder from seed data → neutral placeholder (not the
  // loud text-on-gradient thing the seed shipped).
  if (isSeedGradient(image.url)) {
    return <NeutralPlaceholder aspectRatio={aspectRatio} className={className} alt={alt} isSeed={isSeed} />
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-[color:var(--surface-muted,#f3f4f6)] ${ASPECT_CLASS[aspectRatio]} ${className ?? ''}`}>
      <Image
        src={image.url}
        alt={image.alt ?? alt}
        fill
        sizes={sizes ?? '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
        priority={priority}
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
      {isSeed && process.env.NODE_ENV !== 'production' ? (
        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          Ejemplo
        </span>
      ) : null}
    </div>
  )
}
