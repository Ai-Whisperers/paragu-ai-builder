import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface TestimonialVideoProps {
  title?: string
  subtitle?: string
  videos: Array<{
    author: string
    role?: string
    /** YouTube/Vimeo/direct MP4 URL. */
    src: string
    poster?: string
    caption?: string
  }>
}

function embedUrl(src: string): string {
  const yt = src.match(/youtu\.?be(?:\.com)?\/(?:watch\?v=|embed\/)?([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vm = src.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return src
}

export function TestimonialVideoSection({ title = 'Historias de clientes', subtitle, videos }: TestimonialVideoProps) {
  if (!videos?.length) return null
  return (
    <section className="py-16 bg-surface">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {videos.map((v, i) => {
            const url = embedUrl(v.src)
            const isEmbed = url !== v.src
            return (
              <figure key={i}>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {isEmbed ? (
                    <iframe
                      src={url}
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                      title={`Testimonio de ${v.author}`}
                    />
                  ) : (
                    <video src={v.src} poster={v.poster} controls className="w-full h-full" />
                  )}
                </div>
                <figcaption className="mt-2 text-sm">
                  <div className="font-semibold text-foreground">{v.author}</div>
                  {v.role && <div className="text-muted-foreground">{v.role}</div>}
                  {v.caption && <p className="mt-1 italic text-muted-foreground">{v.caption}</p>}
                </figcaption>
              </figure>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
