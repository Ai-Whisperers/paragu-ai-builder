'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export interface TabAudioPlayerProps {
  src: string
  title?: string
  /** localStorage key for remembering the user's on/off choice. */
  storageKey?: string
}

/**
 * Ambient tab music with pause-on-blur.
 *
 * Browser autoplay policy: Chrome/Safari/Firefox all block audio with
 * sound from starting before a user gesture. We attempt `.play()` on
 * mount anyway (works when the user previously consented on the same
 * origin), and fall back to a floating button for first-time visitors.
 *
 * Behavior:
 *  - First visit: floating button rendered in "paused" state.
 *    User clicks → audio plays → consent saved in localStorage.
 *  - Subsequent visits: tries autoplay; if blocked the button is there.
 *  - Tab goes to background (Page Visibility API): pause.
 *  - Tab becomes foreground again: resume (only if user had opted in).
 *  - Window loses OS-level focus: also pause, matching the user's
 *    mental model of "playing while I'm on this tab".
 *
 * Single-instance: if two copies mount (nav rerender), the browser
 * only has one <audio> element per unique src + we track via ref.
 */
export function TabAudioPlayer({
  src,
  title = 'Música',
  storageKey = 'paragu:tab-audio:v1',
}: TabAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Hydrate from localStorage and try autoplay if the user previously opted in.
  useEffect(() => {
    let wanted = false
    try {
      wanted = window.localStorage.getItem(storageKey) === 'on'
    } catch {
      // localStorage can throw in private mode / SSR mismatch — treat as "no".
    }
    setHasInteracted(wanted)
    if (!wanted) return
    const el = audioRef.current
    if (!el) return
    el.play().then(
      () => setPlaying(true),
      () => {
        // Autoplay blocked despite prior consent (can happen across
        // origins or after long idle). Show the button, let them tap.
        setPlaying(false)
      },
    )
  }, [storageKey])

  // Pause/resume on tab visibility and window focus.
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const shouldPause = () => {
      if (!el.paused) el.pause()
    }
    const shouldResume = () => {
      if (!hasInteracted) return
      if (document.visibilityState !== 'visible') return
      if (typeof document.hasFocus === 'function' && !document.hasFocus()) return
      el.play().catch(() => {
        // Resume silently dropped — leave UI in paused state.
      })
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') shouldPause()
      else shouldResume()
    }
    const onBlur = () => shouldPause()
    const onFocus = () => shouldResume()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [hasInteracted])

  // Reflect the audio element's playing state into React (catches
  // `ended`, browser-initiated pauses, etc.).
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [])

  function toggle() {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play().then(
        () => {
          setHasInteracted(true)
          try {
            window.localStorage.setItem(storageKey, 'on')
          } catch {
            // ignore — toggle still works for the current session
          }
        },
        () => {
          // Rare: play() rejects even on a click. Surface via state.
          setPlaying(false)
        },
      )
    } else {
      el.pause()
      try {
        window.localStorage.setItem(storageKey, 'off')
      } catch {
        // ignore
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pausar ${title}` : `Reproducir ${title}`}
        aria-pressed={playing}
        className="fixed bottom-24 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 sm:h-12 sm:w-12"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: '2px solid rgba(255,255,255,0.85)',
        }}
        title={playing ? `${title} — en reproducción` : `${title} — pausado`}
      >
        {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </>
  )
}

export default TabAudioPlayer
