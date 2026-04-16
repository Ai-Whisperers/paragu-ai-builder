import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'

export interface Testimonial {
  quote: string
  author: string
  role?: string
  rating?: number
}

export interface TestimonialsSectionProps {
  title: string
  testimonials: Testimonial[]
}

export function TestimonialsSection({ title, testimonials }: TestimonialsSectionProps) {
  return (
    <section className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <div className="mb-12 text-center">
          <Heading level={2}>{title}</Heading>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover={false}>
              <CardContent>
                {/* Stars */}
                {testimonial.rating && (
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < testimonial.rating! ? 'text-[var(--accent)]' : 'text-[var(--surface-light)]'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}

                <blockquote className="mb-4 text-[var(--text)]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div>
                  <p className="font-semibold text-[var(--text)]">{testimonial.author}</p>
                  {testimonial.role && (
                    <p className="text-sm text-[var(--text-muted)]">{testimonial.role}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
