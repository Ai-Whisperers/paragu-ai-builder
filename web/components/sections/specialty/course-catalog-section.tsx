import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Clock, DollarSign } from 'lucide-react'

export interface Course {
  name: string
  description?: string
  duration: string
  price?: string
  instructor?: string
  startDate?: string
  image?: string
  category?: string
}

export interface CourseCatalogSectionProps {
  title?: string
  subtitle?: string
  courses?: Course[]
  variant?: 'grid' | 'cards'
  __locale?: string
}

export function CourseCatalogSection({
  title = 'Cursos disponibles',
  subtitle = 'Formación profesional para tu desarrollo',
  courses = [],
  variant = 'grid',
}: CourseCatalogSectionProps) {
  if (!courses?.length) return null

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mb-8 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.name}>
              {course.image && (
                <img src={course.image} alt={course.name} className="h-40 w-full rounded-t-xl object-cover" />
              )}
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground">{course.name}</h3>
                {course.description && <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>}
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                  {course.price && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {course.price}</span>}
                  {course.instructor && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.instructor}</span>}
                </div>
                {course.startDate && <p className="mt-2 text-xs text-primary">Comienza: {course.startDate}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
