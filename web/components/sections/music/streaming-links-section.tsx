import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

interface StreamingPlatform {
  name: string
  url: string
  icon?: string
}

interface StreamingLinksSectionProps {
  title?: string
  subtitle?: string
  platforms?: StreamingPlatform[]
  variant?: 'single-row'
}

const BRAND_COLORS: Record<string, string> = {
  Spotify: '#1DB954',
  'Apple Music': '#FA243C',
  'YouTube Music': '#FF0000',
  SoundCloud: '#FF5500',
  Bandcamp: '#629AA9',
  'Amazon Music': '#FF9900',
  Deezer: '#A238FF',
  Tidal: '#000000',
}

export function StreamingLinksSection({
  title,
  subtitle,
  platforms = [],
}: StreamingLinksSectionProps) {
  if (!platforms || platforms.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <Container>
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <Heading level={2} className="mb-2">
                {title}
              </Heading>
            )}
            {subtitle && (
              <p className="text-[var(--textLight)]">{subtitle}</p>
            )}
          </div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {platforms.map((platform) => {
            const brandColor = BRAND_COLORS[platform.name]
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text)] font-medium text-sm transition-all duration-200 hover:text-white"
                style={{
                  '--brand-color': brandColor || 'var(--primary)',
                  '--brand-hover': brandColor ? `${brandColor}dd` : 'var(--primary)',
                } as React.CSSProperties}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor || 'var(--primary)' }} />
                {platform.name}
              </a>
            )
          })}
        </div>
        <style jsx>{`
          a:hover {
            background-color: var(--brand-hover) !important;
            border-color: transparent !important;
          }
        `}</style>
      </Container>
    </section>
  )
}
