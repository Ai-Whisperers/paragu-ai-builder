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

export function ProductImage({ image, alt, aspectRatio = '4:5', priority, sizes, className, isSeed }: Props) {
  if (!image?.url) {
    return (
      <div
        className={`relative overflow-hidden rounded-lg bg-[color:var(--surface-muted,#f3f4f6)] ${ASPECT_CLASS[aspectRatio]} ${className ?? ''}`}
        aria-label={alt}
      >
        <div className="flex h-full items-center justify-center text-sm text-[color:var(--text-muted,#9ca3af)]">Sin imagen</div>
      </div>
    )
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
      {isSeed ? (
        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          Ejemplo
        </span>
      ) : null}
    </div>
  )
}
