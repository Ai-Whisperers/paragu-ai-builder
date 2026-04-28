'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  lyrics?: TrackLyrics
}

interface LyricsDisplaySectionProps {
  tracks?: Track[]
  variant?: 'full-album'
}

const SECTION_ORDER = ['intro', 'verse1', 'verse2', 'chorus', 'bridge', 'break', 'outro'] as const
const SECTION_LABELS: Record<string, string> = {
  intro: 'Intro',
  verse1: 'Verse 1',
  verse2: 'Verse 2',
  chorus: 'Chorus',
  bridge: 'Bridge',
  break: 'Break',
  outro: 'Outro',
}

export function LyricsDisplaySection({ tracks = [], variant = 'full-album' }: LyricsDisplaySectionProps) {
  if (!tracks || tracks.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto space-y-16">
          {tracks.map((track) => (
            <TrackLyricsCard key={track.number} track={track} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function TrackLyricsCard({ track }: { track: Track }) {
  const [expanded, setExpanded] = useState(false)
  const lyrics = track.lyrics
  const hasLyrics = lyrics && Object.values(lyrics).some((v) => v && v.length > 0)

  return (
    <div className="border-b border-[var(--border-color)] pb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-sm text-[var(--textMuted)] tabular-nums">
              {String(track.number).padStart(2, '0')}
            </span>
            <Heading as="h3" level={3} className="group-hover:text-[var(--primary)] transition-colors">
              {track.title}
            </Heading>
          </div>
          <div className="flex items-center gap-3 mt-1 ml-8">
            <span className="text-xs text-[var(--textMuted)]">{track.key}</span>
            <span className="text-xs text-[var(--textMuted)]">{track.bpm} BPM</span>
            <span className="text-xs text-[var(--textMuted)]">{track.mood}</span>
          </div>
        </div>
        {hasLyrics && (
          <ChevronDown
            size={20}
            className={cn(
              'text-[var(--textMuted)] transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        )}
      </button>

      {hasLyrics && expanded && (
        <div className="mt-6 ml-8 space-y-6 font-[var(--font-lyrics)]">
          {SECTION_ORDER.map((sectionKey) => {
            const content = lyrics?.[sectionKey as keyof TrackLyrics]
            if (!content) return null
            const lines = content.split('\n').filter(Boolean)
            if (lines.length === 0) return null

            return (
              <div key={sectionKey}>
                <span className="text-xs uppercase tracking-widest text-[var(--textMuted)] block mb-2">
                  {SECTION_LABELS[sectionKey] || sectionKey}
                </span>
                <div className="space-y-1 text-base leading-relaxed text-[var(--text)]">
                  {lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
