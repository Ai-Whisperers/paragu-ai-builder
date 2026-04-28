import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Award } from 'lucide-react'

export interface Instructor {
  name: string
  title: string
  bio?: string
  imageUrl?: string
  specialties?: string[]
}

export interface InstructorProfileSectionProps {
  title?: string
  subtitle?: string
  instructors?: Instructor[]
  variant?: 'card' | 'list'
  __locale?: string
}

export function InstructorProfileSection({
  title = 'Nuestros instructores',
  subtitle = 'Profesionales con amplia experiencia',
  instructors = [],
  variant = 'card',
}: InstructorProfileSectionProps) {
  if (!instructors?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-6 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((inst) => (
            <Card key={inst.name}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                {inst.imageUrl && (
                  <img src={inst.imageUrl} alt={inst.name} className="mb-4 h-24 w-24 rounded-full object-cover" />
                )}
                <h3 className="font-semibold text-foreground">{inst.name}</h3>
                <p className="text-sm text-primary">{inst.title}</p>
                {inst.bio && <p className="mt-2 text-xs text-muted-foreground">{inst.bio}</p>}
                {inst.specialties && inst.specialties.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {inst.specialties.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 rounded-full bg-surface-light px-2.5 py-0.5 text-[10px] text-muted-foreground">
                        <Award className="h-3 w-3 text-primary" /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
