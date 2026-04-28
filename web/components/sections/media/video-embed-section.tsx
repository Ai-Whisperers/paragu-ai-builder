import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface VideoEmbedSectionProps {
  url: string
  title?: string
  caption?: string
  autoplay?: boolean
  variant?: 'aspect-16-9' | 'aspect-4-3' | 'square' | 'full-width'
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|shorts\/))([\w-]{11})/
  )
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

export function VideoEmbedSection({
  url,
  title,
  caption,
  autoplay = false,
  variant = 'aspect-16-9',
}: VideoEmbedSectionProps) {
  const youtubeId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)

  const aspectClass = {
    'aspect-16-9': 'aspect-video',
    'aspect-4-3': 'aspect-4/3',
    'square': 'aspect-square',
    'full-width': 'aspect-video',
  }

  let embedUrl = url
  if (youtubeId) {
    embedUrl = `https://www.youtube.com/embed/${youtubeId}${autoplay ? '?autoplay=1' : ''}`
  } else if (vimeoId) {
    embedUrl = `https://player.vimeo.com/video/${vimeoId}${autoplay ? '?autoplay=1' : ''}`
  }

  return (
    <section className="bg-background py-12 sm:py-16">
      <Container>
        {title && (
          <div className="text-center mb-8">
            <Heading level={2}>{title}</Heading>
            {caption && (
              <p className="mt-2 text-muted-foreground">{caption}</p>
            )}
          </div>
        )}
        <div className={`mx-auto max-w-4xl ${aspectClass[variant]}`}>
          <iframe
            src={embedUrl}
            title={title || 'Video'}
            className="w-full h-full rounded-lg shadow-card"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </Container>
    </section>
  )
}
