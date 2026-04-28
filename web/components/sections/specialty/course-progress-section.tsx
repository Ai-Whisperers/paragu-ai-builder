import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, CheckCircle } from 'lucide-react'

export interface CourseProgressSectionProps {
  title?: string
  courseName?: string
  completed?: number
  total?: number
  nextLesson?: string
  nextDate?: string
  variant?: 'bar' | 'steps'
  __locale?: string
}

export function CourseProgressSection({
  title = 'Progreso del curso',
  courseName,
  completed = 0,
  total = 10,
  nextLesson,
  nextDate,
  variant = 'bar',
}: CourseProgressSectionProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <Section spacing="md" background="surface">
      <Container>
        <div className="mx-auto max-w-md">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <Heading level={3}>{title}</Heading>
                  {courseName && <p className="text-sm text-muted-foreground">{courseName}</p>}
                </div>
              </div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{completed} de {total} lecciones</span>
                <span className="font-semibold text-primary">{pct}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-light">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              {variant === 'steps' && completed < total && (
                <div className="mt-4 space-y-2">
                  {Array.from({ length: total }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        i < completed ? 'bg-primary text-white' : i === completed ? 'border-2 border-primary text-primary' : 'bg-surface-light text-muted-foreground'
                      }`}>
                        {i < completed ? <CheckCircle className="h-3 w-3" /> : i + 1}
                      </span>
                      <span className={`text-sm ${i < completed ? 'text-foreground' : i === completed ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                        {i === completed && nextLesson ? nextLesson : `Lección ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {nextLesson && nextDate && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Próxima clase: {nextLesson} — {nextDate}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  )
}
