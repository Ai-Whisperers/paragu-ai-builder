import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'

export interface TrustSignalsLogosProps {
  title?: string
  logos: Array<{ name: string; src?: string; alt?: string; href?: string }>
  grayscale?: boolean
}

export function TrustSignalsLogosSection({
  title = 'Trabajamos con',
  logos,
  grayscale = true,
}: TrustSignalsLogosProps) {
  if (!logos?.length) return null
  return (
    <Section spacing="sm" background="surface" className="py-10">
      <Container>
        {title && (
          <p className="text-center text-sm uppercase tracking-wide text-muted-foreground mb-6">
            {title}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {logos.map((l, i) => {
            const img = l.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={l.src}
                alt={l.alt || l.name}
                className={`h-8 md:h-10 opacity-80 hover:opacity-100 transition ${
                  grayscale ? 'grayscale hover:grayscale-0' : ''
                }`}
              />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">{l.name}</span>
            )
            return (
              <div key={i} className="flex items-center">
                {l.href ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
