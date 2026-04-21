import { Star, Quote } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { DecorativeBlob } from '@/components/ui/decorative'
import { VideoModal } from '@/components/ui/video-modal'
import { cn } from '@/lib/utils'

export interface Testimonial {
  quote: string
  author: string
  role?: string
  rating?: number
  avatar?: string
  /** Optional YouTube/Vimeo URL. When empty, the videoPoster (if set)
   *  renders as a "video coming soon" thumbnail. */
  videoUrl?: string
  /** Optional poster frame URL for the video thumbnail. When set the
   *  card renders a prominent video thumbnail above the quote. */
  videoPoster?: string
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
  /** Locale for labels inside the video modal. */
  __locale?: string
}

const VIDEO_LABELS: Record<string, { play: string; comingSoon: string; close: string; dialog: string }> = {
  en: { play: 'Play testimonial', comingSoon: 'Video coming soon', close: 'Close', dialog: 'Testimonial video' },
  es: { play: 'Reproducir testimonio', comingSoon: 'Video próximamente', close: 'Cerrar', dialog: 'Video de testimonio' },
  nl: { play: 'Video afspelen', comingSoon: 'Video binnenkort', close: 'Sluiten', dialog: 'Testimoniumvideo' },
  de: { play: 'Video abspielen', comingSoon: 'Video folgt bald', close: 'Schließen', dialog: 'Testimonial-Video' },
  pt: { play: 'Reproduzir', comingSoon: 'Em breve', close: 'Fechar', dialog: 'Vídeo de depoimento' },
}

/**
 * Enhanced Testimonials section with improved UX and readability.
 *
 * Improvements:
 * - Better typography with proper hierarchy
 * - Improved card design with subtle shadows
 * - Quote icon for visual interest
 * - Avatar support
 * - Optional video poster + modal (R2.3): when a testimonial ships a
 *   `videoPoster` URL we render a video-first card; when `videoUrl` is
 *   also set, the poster opens a YouTube embed modal. Otherwise the
 *   poster doubles as a "video coming soon" visual.
 */
export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
  items,
  enhanced = true,
  columns = 3,
  __locale,
}: TestimonialsSectionProps) {
  // Normalize: some tenant content files ship {name, role, quote} instead of
  // {author, role, quote}. Accept either so a missing `author` doesn't crash
  // the avatar fallback (`.charAt(0)` on undefined) — previously 500'd the
  // whole page when any testimonial lacked an explicit `author`.
  const resolved = (testimonials || items || []).map((t) => ({
    ...t,
    author: t.author || (t as unknown as { name?: string }).name || 'Cliente',
  }))
  if (resolved.length === 0) return null

  const gridCols = columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
  const labels = VIDEO_LABELS[__locale ?? 'es'] ?? VIDEO_LABELS.es

  return (
    <section className="relative overflow-hidden bg-[var(--background)] py-20 sm:py-28 lg:py-32">
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
                  'group h-full overflow-hidden rounded-2xl transition-all duration-300',
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
                {testimonial.videoPoster && (
                  <VideoModal
                    videoUrl={testimonial.videoUrl}
                    poster={testimonial.videoPoster}
                    posterAlt={`${testimonial.author} — ${labels.dialog}`}
                    playLabel={labels.play}
                    comingSoonLabel={labels.comingSoon}
                    labelClose={labels.close}
                    labelDialog={labels.dialog}
                  />
                )}

                <div className="p-6 sm:p-8">
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
                              ? 'fill-[var(--secondary)] text-[var(--secondary)]'
                              : 'fill-gray-100 text-gray-200'
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
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    {testimonial.avatar ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--primary-foreground)',
                        }}
                      >
                        {testimonial.author.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-base"
                        style={{ color: 'var(--text)' }}
                      >
                        {testimonial.author}
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
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default TestimonialsSection
