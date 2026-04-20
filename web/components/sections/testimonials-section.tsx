import { Star } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { TiltCard } from '@/components/ui/glow'
import { StaggerContainer } from '@/components/ui/animated'
import { DecorativeBlob } from '@/components/ui/decorative'

export interface Testimonial {
  quote: string
  author: string
  role?: string
  rating?: number
}

export interface TestimonialsSectionProps {
  title: string
  subtitle?: string
  testimonials?: Testimonial[]
  /** Legacy alias — some content files ship `items` instead of `testimonials`. */
  items?: Testimonial[]
  /** Enable enhanced effects */
  enhanced?: boolean
}

/**
 * Testimonials section with optional enhanced effects.
 * 
 * @example
 * // Basic testimonials
 * <TestimonialsSection
 *   title="What Our Clients Say"
 *   subtitle="Trusted by thousands"
 *   testimonials={testimonials}
 * />
 * 
 * @example
 * // Enhanced with 3D tilt cards and decorative elements
 * <TestimonialsSection
 *   title="What Our Clients Say"
 *   subtitle="Trusted by thousands"
 *   testimonials={testimonials}
 *   enhanced
 * />
 */
export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
  items,
  enhanced = false,
}: TestimonialsSectionProps) {
  const resolved = testimonials || items || []
  if (resolved.length === 0) return null
  return (
    <section className="relative overflow-hidden bg-[var(--background)] py-16 sm:py-20">
      {/* Decorative elements when enhanced */}
      {enhanced && (
        <>
          <DecorativeBlob
            variant="accent"
            size="lg"
            animated
            position="absolute"
            placement={{ top: '-10%', left: '-10%' }}
            blur="xl"
            opacity={0.1}
          />
          <DecorativeBlob
            variant="primary"
            size="lg"
            animated
            position="absolute"
            placement={{ bottom: '-10%', right: '-10%' }}
            blur="xl"
            opacity={0.1}
          />
        </>
      )}
      
      <Container className="relative z-10">
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {enhanced ? (
          // Enhanced version with tilt cards and staggered animations
          <StaggerContainer 
            staggerDelay={150} 
            animation="scale-in"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {resolved.map((testimonial, index) => (
              <TiltCard key={index} maxTilt={5} scale={1.02} glare glareOpacity={0.15}>
                <div className="h-full rounded-lg bg-[var(--surface)] p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
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
                </div>
              </TiltCard>
            ))}
          </StaggerContainer>
        ) : (
          // Basic version (original behavior)
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resolved.map((testimonial, index) => (
              <div key={index}>
                <div className="h-full rounded-lg bg-[var(--surface)] p-6 shadow-card">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
