import { Star } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface Testimonial {
  quote: string
  author: string
  role?: string
  rating?: number
}

export interface TestimonialsSectionProps {
  title: string
  subtitle?: string
  testimonials: Testimonial[]
}

export function TestimonialsSection({ title, subtitle, testimonials }: TestimonialsSectionProps) {
  return (
    <section className="bg-[var(--background)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimateOnScroll key={index} stagger={index}>
              <Card hover={false}>
                <CardContent>
                  {/* Stars */}
                  {testimonial.rating && (
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < testimonial.rating!
                              ? 'fill-[var(--accent)] text-[var(--accent)]'
                              : 'fill-[var(--surface-light)] text-[var(--surface-light)]'
                          }
                        />
                      ))}
                    </div>
                  )}

                  <blockquote className="mb-4 text-[var(--text)] leading-relaxed">
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
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}
