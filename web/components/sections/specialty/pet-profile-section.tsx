import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PawPrint, Heart } from 'lucide-react'

export interface Pet {
  name: string
  type: string
  breed?: string
  age?: string
  size?: string
  gender?: string
  description: string
  status: string
  image: string
  hashtag?: string
}

export interface PetProfileSectionProps {
  title?: string
  subtitle?: string
  pets?: Pet[]
  variant?: 'card' | 'list'
  __locale?: string
}

const STATUS_COLORS: Record<string, string> = {
  'en adopción': 'bg-green-100 text-green-700 border-green-200',
  'adoptado': 'bg-gray-100 text-gray-500 border-gray-200',
  'nuevo rescatado': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'en tratamiento': 'bg-blue-100 text-blue-700 border-blue-200',
}

export function PetProfileSection({
  title = 'Conocé nuestros animales',
  subtitle = 'Todos buscan un hogar responsable',
  pets = [],
  variant = 'card',
}: PetProfileSectionProps) {
  if (!pets?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-8 text-center">
          <PawPrint className="mx-auto mb-2 h-8 w-8 text-primary" />
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Card key={pet.name}>
              <div className="relative">
                <img src={pet.image} alt={pet.name} className="h-52 w-full rounded-t-xl object-cover" />
                <span className={`absolute left-2 top-2 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${STATUS_COLORS[pet.status] || 'bg-gray-100'}`}>{pet.status}</span>
                {pet.hashtag && <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">{pet.hashtag}</span>}
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-foreground">{pet.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <PawPrint className="h-3 w-3" /> {pet.type}{pet.breed ? ` · ${pet.breed}` : ''}{pet.age ? ` · ${pet.age}` : ''}
                </p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{pet.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pet.size && <Badge variant="outline">{pet.size}</Badge>}
                  {pet.gender && <Badge variant="outline">{pet.gender === 'macho' ? '♂' : '♀'} {pet.gender}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
