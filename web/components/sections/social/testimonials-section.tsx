import { Section } from '@/components/ui/section'
import { Star, Quote } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { DecorativeBlob } from '@/components/ui/decorative'
import { cn } from '@/lib/utils'

export interface Testimonial {
  quote: string
  text?: string
  /** Preferred. Legacy content may use `name` instead — both accepted. */
  author?: string
  /** Legacy content shape alias for `author`. */
  name?: string
  role?: string
  rating?: number
  avatar?: string
}

export interface TestimonialsSectionProps {
  title: string
  subtitle?: string
  testimonials?: Testimonial[]
  /** Legacy alias — some content files ship `items` instead of `testimonials`. */
  items?: Testimonial[]
  /** Enable enhanced effects */
  enhanced?: boolean
  columns?: 2 | 3
}

/**
 * Enhanced Testimonials section with improved UX and readability.
 * 
 * Improvements:
 * - Better typography with proper hierarchy
 * - Improved card design with subtle shadows
 * - Better spacing and visual breathing room
 * - Quote icon for visual interest
 * - Avatar support for more personal touch
 */
export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
  items,
  enhanced = true,
  columns = 3,
}: TestimonialsSectionProps) {
  const resolved = testimonials || items || []
  if (resolved.length === 0) return null

  const gridCols = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'

  return (
    <Section fullWidth spacing="xl" background="surface-light" className="relative overflow-hidden">
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
            opacity={0.08}
          />
          <DecorativeBlob
            variant="primary"
            size="lg"
            animated
            position="absolute"
            placement={{ bottom: '-10%', right: '-10%' }}
            blur="xl"
            opacity={0.06}
          />
        </>
      )}
      
      <Container className="relative z-10">
        <AnimatedSectionHeader className="mb-12 sm:mb-16">
          <Heading level={2}
            style={{
              fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {subtitle}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className={cn('grid gap-6 sm:gap-8', gridCols)}>
          {resolved.map((testimonial, index) => (
            <AnimateOnScroll 
              key={index} 
              stagger={((index % columns) + 1) as 1 | 2 | 3}
            >
              <article 
                className={cn(
                  'group h-full rounded-2xl p-8 sm:p-10 transition-all duration-300',
                  enhanced && 'hover:-translate-y-1'
                )}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: enhanced 
                    ? '0 4px 20px rgba(0,0,0,0.04)' 
                    : '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                {/* Quote icon */}
                <div 
                  className="mb-5 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(184, 134, 11, 0.12)' }}
                >
                  <Quote size={18} style={{ color: 'var(--secondary)' }} />
                </div>

                {/* Stars */}
                {testimonial.rating && (
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        strokeWidth={2}
                        className={cn(
                          'transition-colors',
                          i < testimonial.rating!
                            ? 'fill-[var(--secondary)] text-secondary'
                            : 'fill-gray-100 text-[var(--surface-light)]'
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Quote */}
                <blockquote 
                  className="mb-6 text-base sm:text-lg leading-relaxed"
                  style={{ color: 'var(--text)' }}
                >
                  &ldquo;{testimonial.text || testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
                >
                  {testimonial.avatar ? (
                    <img 
                      src={testimonial.avatar}
                      alt={(testimonial.author ?? testimonial.name ?? '')}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      }}
                    >
                      {(testimonial.author ?? testimonial.name ?? '').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-base"
                      style={{ color: 'var(--text)' }}
                    >
                      {(testimonial.author ?? testimonial.name ?? '')}
                    </p>
                    {testimonial.role && (
                      <p className="text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default TestimonialsSection
