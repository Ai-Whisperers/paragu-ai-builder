import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'

export interface RucTimbradoDisplaySectionProps {
  ruc?: string
  businessName?: string
  timbrado?: string
  regime?: string
  variant?: 'footer' | 'inline' | 'badge'
  __locale?: string
}

export function RucTimbradoDisplaySection({
  ruc,
  businessName,
  timbrado,
  regime,
  variant = 'footer',
}: RucTimbradoDisplaySectionProps) {
  if (!ruc && !timbrado) return null

  const parts = [ruc && `RUC ${ruc}`, businessName, regime, timbrado && `Timbrado ${timbrado}`].filter(Boolean)

  if (variant === 'badge') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-light px-3 py-1 text-[10px] text-muted-foreground">
        {parts.join(' · ')}
      </span>
    )
  }

  if (variant === 'inline') {
    return (
      <p className="text-[10px] leading-relaxed text-muted-foreground">
        {parts.join(' · ')}
      </p>
    )
  }

  return (
    <Section spacing="sm" background="surface">
      <Container>
        <div className="border-t border-border pt-4 text-center">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            {parts.join(' · ')}
          </p>
        </div>
      </Container>
    </Section>
  )
}
