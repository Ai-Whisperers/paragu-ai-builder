import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export interface CTABannerSectionProps {
  title: string
  subtitle?: string
  buttonText: string
  buttonHref?: string
}

export function CTABannerSection({
  title,
  subtitle,
  buttonText,
  buttonHref = '#contacto',
}: CTABannerSectionProps) {
  return (
    <section className="bg-[var(--secondary)] py-16">
      <Container className="text-center">
        <h2
          className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">{subtitle}</p>
        )}
        <Button
          variant="secondary"
          size="lg"
          href={buttonHref}
          className="border-white text-white hover:bg-white hover:text-[var(--secondary)]"
        >
          {buttonText}
        </Button>
      </Container>
    </section>
  )
}
