'use client'

import { useState, useRef } from 'react'
import { Music } from 'lucide-react'

interface Track {
  number: number
  title: string
  key: string
  bpm: number
  mood: string
  duration?: string
  style?: string
  audio?: string
}

export function TrackAudioPlayer({ track }: { track: Track }) {
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
      className="group relative flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--track-hover-bg)] transition-colors cursor-pointer"
      onClick={togglePlay}
    >
      <button
        className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      >
        <span className="text-lg leading-none">{isPlaying ? '⏸' : '▶'}</span>
      </button>

      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
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

      {track.audio && (
        <div className="flex-shrink-0 text-[var(--textMuted)] group-hover:text-[var(--primary)] transition-colors">
          <Music size={16} />
        </div>
      )}
    </div>
  )
}
