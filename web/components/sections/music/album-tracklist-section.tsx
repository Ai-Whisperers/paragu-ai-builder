'use client'

import { useState, useRef } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Play, Pause, Music } from 'lucide-react'

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
                <Play size={18} />
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
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    if (!audioRef.current) {
      if (!track.audio) return
      const audio = new Audio(track.audio)
      audio.addEventListener('timeupdate', () => {
        setProgress(audio.currentTime / (audio.duration || 1))
      })
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        setProgress(0)
      })
      audioRef.current = audio
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--track-hover-bg)] transition-colors cursor-pointer"
      onClick={togglePlay}
    >
      {/* Play/Pause button */}
      <button
        className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>

      {/* Progress bar (when playing) */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* Track info */}
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-baseline gap-3">
          <span className="text-sm text-[var(--textMuted)] tabular-nums w-6">
            {String(track.number).padStart(2, '0')}
          </span>
          <span className="font-medium truncate">{track.title}</span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 ml-9">
          <span className="text-xs text-[var(--textMuted)]">{track.key}</span>
          <span className="text-xs text-[var(--textMuted)]">{track.bpm} BPM</span>
          <span className="text-xs text-[var(--textMuted)] truncate">{track.mood}</span>
        </div>
      </div>

      {/* Audio indicator */}
      {track.audio && (
        <div className="flex-shrink-0 text-[var(--textMuted)] group-hover:text-[var(--primary)] transition-colors">
          <Music size={16} />
        </div>
      )}
    </div>
  )
}
