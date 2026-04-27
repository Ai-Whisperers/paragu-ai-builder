import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'

export interface HeroVideoSectionProps {
  headline: string
  subheadline?: string
  videoUrl?: string
  posterUrl?: string
  ctaPrimaryText?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  trustBadges?: string[]
  variant?: 'video' | 'parallax'
  backgroundImage?: string
}

export function HeroVideoSection({
  headline,
  subheadline,
  videoUrl,
  posterUrl,
  ctaPrimaryText,
  ctaPrimaryHref = '#contacto',
  ctaSecondaryText,
  ctaSecondaryHref,
  trustBadges,
  variant = 'video',
  backgroundImage,
}: HeroVideoSectionProps) {
  const getYouTubeEmbed = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|shorts\/))([\w-]{11})/)
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&showinfo=0` : url
  }

  const isYT = videoUrl?.includes('youtube') || videoUrl?.includes('youtu.be')

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background */}
      {variant === 'video' && videoUrl && !isYT && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      {variant === 'video' && videoUrl && isYT && (
        <iframe
          src={getYouTubeEmbed(videoUrl)}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: 'blur(2px)', transform: 'scale(1.1)' }}
          allow="autoplay; encrypted-media"
          loading="lazy"
        />
      )}
      {variant === 'parallax' && backgroundImage && (
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {(videoUrl || backgroundImage) && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Content */}
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <Heading level={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {headline}
          </Heading>
          {subheadline && (
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl">
              {subheadline}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            {ctaPrimaryText && (
              <Button href={ctaPrimaryHref} size="lg">
                {ctaPrimaryText}
              </Button>
            )}
            {ctaSecondaryText && (
              <Button href={ctaSecondaryHref} variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
                {ctaSecondaryText}
              </Button>
            )}
          </div>
          {trustBadges && trustBadges.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {trustBadges.map((badge, i) => (
                <span key={i} className="px-3 py-1 text-sm text-white/70 bg-white/10 rounded-full backdrop-blur-sm">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
