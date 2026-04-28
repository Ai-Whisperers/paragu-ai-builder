import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Mail, Home, Star } from 'lucide-react'

export interface Agent {
  name: string
  title: string
  phone: string
  email?: string
  imageUrl?: string
  listings?: number
  bio?: string
  rating?: number
}

export interface AgentProfileSectionProps {
  title?: string
  subtitle?: string
  agents?: Agent[]
  variant?: 'card' | 'list'
  __locale?: string
}

export function AgentProfileSection({
  title = 'Nuestros agentes',
  subtitle = 'Profesionales listos para ayudarte',
  agents = [],
  variant = 'card',
}: AgentProfileSectionProps) {
  if (!agents?.length) return null

  if (variant === 'list') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <Heading level={2} className="mb-6">{title}</Heading>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
                {agent.imageUrl && <img src={agent.imageUrl} alt={agent.name} className="h-16 w-16 rounded-full object-cover" />}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{agent.name}</h3>
                  <p className="text-sm text-primary">{agent.title}</p>
                  {agent.rating && <div className="mt-1 flex items-center gap-1 text-sm text-yellow-500">{Array.from({ length: agent.rating }, (_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /> {agent.phone}</a>
                    {agent.email && <a href={`mailto:${agent.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> Email</a>}
                    {agent.listings && <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {agent.listings} propiedades</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.name}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                {agent.imageUrl && <img src={agent.imageUrl} alt={agent.name} className="mb-4 h-20 w-20 rounded-full object-cover" />}
                <h3 className="font-semibold text-foreground">{agent.name}</h3>
                <p className="text-sm text-primary">{agent.title}</p>
                {agent.rating && <div className="mt-1 flex items-center gap-1 text-sm text-yellow-500">{Array.from({ length: agent.rating }, (_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>}
                {agent.bio && <p className="mt-2 text-xs text-muted-foreground">{agent.bio}</p>}
                <div className="mt-4 flex items-center gap-3 text-xs">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-white hover:opacity-90"><Phone className="h-3 w-3" /> Llamar</a>
                  {agent.email && <a href={`mailto:${agent.email}`} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 hover:bg-surface-light"><Mail className="h-3 w-3" /> Email</a>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
