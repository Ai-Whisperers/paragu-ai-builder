'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'

export interface HealthTip {
  title: string
  description: string
  image?: string
  link?: string
  category?: string
}

export interface HealthTipsCarouselSectionProps {
  title?: string
  subtitle?: string
  tips?: HealthTip[]
  variant?: 'carousel' | 'grid'
  __locale?: string
}

export function HealthTipsCarouselSection({
  title = 'Tips de salud',
  subtitle = 'Consejos para tu bienestar',
  tips = [],
  variant = 'carousel',
}: HealthTipsCarouselSectionProps) {
  const [idx, setIdx] = useState(0)

  if (!tips?.length) return null

  if (variant === 'grid') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mb-8 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map((tip) => (
              <Card key={tip.title}>
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    {tip.category && <span className="text-xs text-muted-foreground">{tip.category}</span>}
                  </div>
                  <h3 className="font-semibold text-foreground">{tip.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  const tip = tips[idx]

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="mx-auto max-w-lg">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-2 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {tip.category && <span className="text-xs font-medium text-muted-foreground">{tip.category}</span>}
            </div>
            <h3 className="text-lg font-semibold text-foreground">{tip.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tip.description}</p>
          </div>
          {tips.length > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <button onClick={() => setIdx((i) => (i - 1 + tips.length) % tips.length)} className="rounded-lg border border-border p-2 hover:bg-surface-light">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {tips.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-primary' : 'bg-border'}`} />
                ))}
              </div>
              <button onClick={() => setIdx((i) => (i + 1) % tips.length)} className="rounded-lg border border-border p-2 hover:bg-surface-light">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
