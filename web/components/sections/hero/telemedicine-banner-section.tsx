import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Video, ExternalLink } from 'lucide-react'

export interface TelemedicineBannerSectionProps {
  title?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  platform?: string
  variant?: 'banner' | 'card' | 'float'
  __locale?: string
}

export function TelemedicineBannerSection({
  title = 'Consultá online',
  description = 'Sin moverte de casa. Videoconsulta con nuestros especialistas.',
  ctaText = 'Agendar videollamada',
  ctaHref = '#',
  variant = 'banner',
}: TelemedicineBannerSectionProps) {
  if (variant === 'float') {
    return (
      <a
        href={ctaHref}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90"
      >
        <Video className="h-5 w-5" />
        {ctaText}
      </a>
    )
  }

  if (variant === 'card') {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <Heading level={3}>{title}</Heading>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <a href={ctaHref} className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              {ctaText} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Section spacing="md" background="primary">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <Heading level={2} className="text-white">{title}</Heading>
            <p className="mt-1 text-sm text-white/80">{description}</p>
          </div>
          <a
            href={ctaHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-white/90"
          >
            <Video className="h-4 w-4" />
            {ctaText}
          </a>
        </div>
      </Container>
    </Section>
  )
}
