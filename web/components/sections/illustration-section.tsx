import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface IllustrationSectionProps {
  title?: string
  subtitle?: string
  src: string
  alt: string
  /** Max width in px. Defaults to 960 which fits most hero-adjacent diagrams. */
  maxWidth?: number
  /** 'background' (default) or 'surface' — lets the section blend with adjacent blocks. */
  background?: 'background' | 'surface'
  caption?: string
}

/**
 * Single centred illustration / diagram / map. Built for cases where a
 * gallery (grid of photos) is overkill but we still want one hero-sized
 * visual in the page flow — Paraguay coverage map, process flow chart,
 * factory floor plan, etc.
 */
export function IllustrationSection({
  title,
  subtitle,
  src,
  alt,
  maxWidth = 960,
  background = 'background',
  caption,
}: IllustrationSectionProps) {
  if (!src) return null
  const bg = background === 'surface' ? 'var(--surface)' : 'var(--background)'
  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: bg }}>
      <Container>
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && <Heading level={2}>{title}</Heading>}
            {subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
        )}
        <div className="mx-auto" style={{ maxWidth: `${maxWidth}px` }}>
          <div className="relative w-full overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={alt}
              width={maxWidth}
              height={Math.round(maxWidth * 1.125)}
              className="h-auto w-full"
              // SVGs don't benefit from next/image optimizer and triggering it
              // on local /public SVGs causes unnecessary work.
              unoptimized={src.endsWith('.svg') || src.startsWith('data:')}
              priority={false}
            />
          </div>
          {caption && (
            <p className="mt-3 text-center text-sm italic text-[var(--text-muted)]">{caption}</p>
          )}
        </div>
      </Container>
    </section>
  )
}

export default IllustrationSection
