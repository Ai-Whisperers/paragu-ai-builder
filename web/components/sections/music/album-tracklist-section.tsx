'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { TrackAudioPlayer } from './track-audio-player'

interface TrackLyrics {
  intro?: string
  verse1?: string
  chorus?: string
  verse2?: string
  bridge?: string
  break?: string
  outro?: string
}

interface Track {
  number: number
  title: string
  key: string
  bpm: number
  mood: string
  duration?: string
  style?: string
  audio?: string
  lyrics?: TrackLyrics
}

interface AlbumTracklistSectionProps {
  title?: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  tracks?: Track[]
  artist?: string
  engine?: string
  duration?: string
  keyChain?: string
  arc?: string
  albumInfo?: {
    artist?: string
    engine?: string
    duration?: string
    keyChain?: string
    arc?: string
  }
  variant?: 'full' | 'album-spotlight'
}

export function AlbumTracklistSection(props: AlbumTracklistSectionProps) {
  const variant = props.variant || 'full'

  // Support both flat props and nested content ref
  const title = props.title || 'Still Reaching'
  const subtitle = props.subtitle || ''
  const description = props.description || ''
  const ctaText = props.ctaText || ''
  const ctaLink = props.ctaLink || ''
  const info = props.albumInfo || {}
  const allTracks = props.tracks || []
  const artist = props.artist || info.artist || ''
  const albumDuration = props.duration || info.duration || ''
  const keyChain = props.keyChain || info.keyChain || ''
  const arc = props.arc || info.arc || ''

  if (variant === 'album-spotlight') {
    return (
      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <Heading as="h2" level={2} className="mb-3">
              {title}
            </Heading>
            {subtitle && (
              <p className="text-[var(--textLight)] text-lg mb-4">{subtitle}</p>
            )}
            {description && (
              <p className="text-[var(--textMuted)] mb-8 leading-relaxed">{description}</p>
            )}
            {ctaText && ctaLink && (
              <a
                href={ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                {ctaText}
              </a>
            )}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Heading as="h1" level={1} className="mb-3">
              {title}
            </Heading>
            {subtitle && (
              <p className="text-[var(--textLight)] text-lg mb-4">{subtitle}</p>
            )}
            {description && (
              <p className="text-[var(--textMuted)] max-w-xl mx-auto">{description}</p>
            )}
          </div>

          {/* Album metadata */}
          {(artist || albumDuration) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 text-center text-sm">
              {artist && (
                <div className="bg-[var(--surface)] rounded-lg p-3">
                  <span className="text-[var(--textMuted)] block text-xs uppercase tracking-wider mb-1">Artist</span>
                  <span className="font-medium">{artist}</span>
                </div>
              )}
              {albumDuration && (
                <div className="bg-[var(--surface)] rounded-lg p-3">
                  <span className="text-[var(--textMuted)] block text-xs uppercase tracking-wider mb-1">Duration</span>
                  <span className="font-medium">{albumDuration}</span>
                </div>
              )}
              {keyChain && (
                <div className="bg-[var(--surface)] rounded-lg p-3">
                  <span className="text-[var(--textMuted)] block text-xs uppercase tracking-wider mb-1">Key Chain</span>
                  <span className="font-medium text-xs">{keyChain}</span>
                </div>
              )}
              {arc && (
                <div className="bg-[var(--surface)] rounded-lg p-3">
                  <span className="text-[var(--textMuted)] block text-xs uppercase tracking-wider mb-1">Arc</span>
                  <span className="font-medium text-xs">{arc}</span>
                </div>
              )}
            </div>
          )}

          {/* Tracklist with audio player */}
          <div className="space-y-2">
            {allTracks.map((track) => (
              <TrackRow key={track.number} track={track} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function TrackRow({ track }: { track: Track }) {
  return <TrackAudioPlayer track={track} />
}
