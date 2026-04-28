import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Award, GraduationCap, Clock, Phone } from 'lucide-react'

export interface Doctor {
  name: string
  specialty: string
  credentials?: string[]
  imageUrl?: string
  bio?: string
  schedule?: string
  phone?: string
  bookable?: boolean
}

export interface DoctorProfileSectionProps {
  title?: string
  subtitle?: string
  doctors?: Doctor[]
  variant?: 'card' | 'list' | 'detailed'
  __locale?: string
}

export function DoctorProfileSection({
  title = 'Nuestros profesionales',
  subtitle = 'Conocé a nuestro equipo médico',
  doctors = [],
  variant = 'card',
}: DoctorProfileSectionProps) {
  if (!doctors?.length) return null

  if (variant === 'list') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <div className="mb-8 text-center">
            <Heading level={2}>{title}</Heading>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border">
            {doctors.map((doc) => (
              <div key={doc.name} className="flex items-center gap-4 px-5 py-4">
                {doc.imageUrl && (
                  <img src={doc.imageUrl} alt={doc.name} className="h-14 w-14 rounded-full object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{doc.name}</p>
                  <p className="text-sm text-primary">{doc.specialty}</p>
                  {doc.schedule && <p className="text-xs text-muted-foreground">{doc.schedule}</p>}
                </div>
                {doc.phone && (
                  <a href={`tel:${doc.phone}`} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Phone className="h-3 w-3" /> Llamar
                  </a>
                )}
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
        <div className="mb-8 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <Card key={doc.name}>
              <CardContent className="p-5">
                {doc.imageUrl && (
                  <img src={doc.imageUrl} alt={doc.name} className="mb-4 h-24 w-24 rounded-full object-cover" />
                )}
                <h3 className="font-semibold text-foreground">{doc.name}</h3>
                <p className="text-sm text-primary">{doc.specialty}</p>
                {doc.bio && <p className="mt-2 text-xs text-muted-foreground">{doc.bio}</p>}
                {doc.credentials && doc.credentials.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {doc.credentials.map((c) => (
                      <p key={c} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Award className="h-3 w-3 text-primary" /> {c}
                      </p>
                    ))}
                  </div>
                )}
                {doc.schedule && (
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {doc.schedule}
                  </p>
                )}
                {doc.phone && (
                  <a href={`tel:${doc.phone}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Phone className="h-3 w-3" /> {doc.phone}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
