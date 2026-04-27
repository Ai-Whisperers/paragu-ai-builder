import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface LogoStripLogo {
  src: string
  alt: string
  href?: string
  width?: number
  height?: number
}

export interface LogoStripSectionProps {
  title?: string
  logos: LogoStripLogo[]
  variant?: 'grid' | 'carousel' | 'single-row'
}

export function LogoStripSection({
  title,
  logos,
  variant = 'grid',
}: LogoStripSectionProps) {
  if (!logos || logos.length === 0) return null

  return (
    <section className="bg-[var(--surface)] py-12 sm:py-16">
      <Container>
        {title && (
          <div className="text-center mb-8">
            <Heading level={3} className="text-[var(--text-muted)] text-sm uppercase tracking-wider">
              {title}
            </Heading>
          </div>
        )}
        <div
          className={
            variant === 'single-row'
              ? 'flex flex-wrap justify-center items-center gap-8 sm:gap-12'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center'
          }
        >
          {logos.map((logo, i) => {
            const img = (
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 120}
                height={logo.height || 48}
                className="max-h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
            )
            return logo.href ? (
              <a key={i} href={logo.href} target="_blank" rel="noopener noreferrer" className="flex justify-center">
                {img}
              </a>
            ) : (
              <div key={i} className="flex justify-center">{img}</div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
