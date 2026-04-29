/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { previewTracks, type PreviewTrack } from './data'

type AudioState = {
  current: PreviewTrack | null
  playing: boolean
  blocked: boolean
  error: string | null
  progress: number       // 0..1
  currentTime: number    // seconds
  duration: number       // seconds
}

type AudioApi = AudioState & {
  play: (id: string) => void
  requestAutoplay: (id?: string) => () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (frac: number) => void
}

const AudioCtx = createContext<AudioApi | null>(null)

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const elRef = useRef<HTMLAudioElement | null>(null)
  const autoplayCleanupRef = useRef<(() => void) | null>(null)
  const [current, setCurrent] = useState<PreviewTrack | null>(null)
  const [playing, setPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // ref mirrors `current` so the `ended` handler can auto-advance without re-binding
  const currentRef = useRef<PreviewTrack | null>(null)
  useEffect(() => { currentRef.current = current }, [current])

  const clearAutoplayListeners = useCallback(() => {
    autoplayCleanupRef.current?.()
    autoplayCleanupRef.current = null
  }, [])

  /* synchronous play — must run inside the originating user-gesture handler */
  const startPlayback = useCallback((t: PreviewTrack) => {
    const el = elRef.current
    if (!el) return
    if (!el.src.endsWith(t.src)) {
      el.src = t.src
      el.load()
    }
    setCurrent(t)
    setError(null)
    const p = el.play()
    if (p && typeof p.then === 'function') {
      p.then(() => {
        setBlocked(false)
        clearAutoplayListeners()
      }).catch((err) => {
        const name = err?.name ? String(err.name) : 'PlaybackError'
        const message = err?.message ? String(err.message) : 'Playback was blocked by the browser.'
        setBlocked(name === 'NotAllowedError')
        setError(`${name}: ${message}`)
        console.warn('[audio] play() rejected:', name, message, 'src:', el.currentSrc)
      })
    }
  }, [clearAutoplayListeners])

  const play = useCallback((id: string) => {
    const t = previewTracks.find((x) => x.id === id)
    if (!t) return
    const el = elRef.current
    if (!el) return
    if (current?.id === id) {
      if (el.paused) {
        const p = el.play()
        if (p && typeof p.then === 'function') {
          p.then(() => {
            setBlocked(false)
            setError(null)
            clearAutoplayListeners()
          }).catch((err) => {
            setBlocked(err?.name === 'NotAllowedError')
            setError(err?.message ?? 'Playback was blocked by the browser.')
          })
        }
      } else {
        el.pause()
      }
      return
    }
    startPlayback(t)
  }, [clearAutoplayListeners, current, startPlayback])

  const requestAutoplay = useCallback((id?: string) => {
    clearAutoplayListeners()

    const t = previewTracks.find((x) => x.id === id) ?? previewTracks[0]
    const el = elRef.current
    if (!t || !el) return () => {}

    setCurrent(t)

    // Browsers generally block audible autoplay. We still try once for browsers
    // or repeat visitors that allow it, then arm the first real user gesture.
    startPlayback(t)

    const controller = new AbortController()
    const unlock = () => startPlayback(t)
    const opts: AddEventListenerOptions = {
      capture: true,
      passive: true,
      signal: controller.signal,
    }

    window.addEventListener('pointerdown', unlock, opts)
    window.addEventListener('keydown', unlock, opts)
    window.addEventListener('touchstart', unlock, opts)

    autoplayCleanupRef.current = () => controller.abort()
    return () => {
      controller.abort()
      if (autoplayCleanupRef.current) autoplayCleanupRef.current = null
    }
  }, [clearAutoplayListeners, startPlayback])

  const toggle = useCallback(() => {
    const el = elRef.current
    if (!el) return
    if (!current) {
      const first = previewTracks[0]
      if (first) startPlayback(first)
      return
    }
    if (el.paused) {
      const p = el.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          setBlocked(false)
          setError(null)
          clearAutoplayListeners()
        }).catch((err) => {
          setBlocked(err?.name === 'NotAllowedError')
          setError(err?.message ?? 'Playback was blocked by the browser.')
        })
      }
    } else {
      el.pause()
    }
  }, [clearAutoplayListeners, current, startPlayback])

  const next = useCallback(() => {
    const t = current
      ? previewTracks[(previewTracks.findIndex((x) => x.id === current.id) + 1) % previewTracks.length]
      : previewTracks[0]
    if (t) startPlayback(t)
  }, [current, startPlayback])

  const prev = useCallback(() => {
    const idx = current
      ? (previewTracks.findIndex((x) => x.id === current.id) - 1 + previewTracks.length) % previewTracks.length
      : previewTracks.length - 1
    const t = previewTracks[idx]
    if (t) startPlayback(t)
  }, [current, startPlayback])

  const seek = useCallback((frac: number) => {
    const el = elRef.current
    if (!el || !duration) return
    el.currentTime = Math.max(0, Math.min(duration, frac * duration))
  }, [duration])

  const progress = duration > 0 ? currentTime / duration : 0

  const api = useMemo<AudioApi>(
    () => ({
      current,
      playing,
      blocked,
      error,
      progress,
      currentTime,
      duration,
      play,
      requestAutoplay,
      toggle,
      next,
      prev,
      seek,
    }),
    [current, playing, blocked, error, progress, currentTime, duration, play, requestAutoplay, toggle, next, prev, seek],
  )

  // shared listeners for the JSX audio element
  const onTime = () => { const el = elRef.current; if (el) setCurrentTime(el.currentTime) }
  const onMeta = () => { const el = elRef.current; if (el) setDuration(el.duration || 0) }
  const onPlay = () => setPlaying(true)
  const onPause = () => setPlaying(false)
  const onError = () => {
    const el = elRef.current
    const mediaError = el?.error
    if (!mediaError) return
    setError(`MediaError ${mediaError.code}`)
  }
  const onEnded = () => {
    const c = currentRef.current
    const el = elRef.current
    if (!c || !el) { setPlaying(false); return }
    const idx = previewTracks.findIndex((t) => t.id === c.id)
    const nextTrack = previewTracks[(idx + 1) % previewTracks.length]
    if (!nextTrack) return
    el.src = nextTrack.src
    setCurrent(nextTrack)
    const p = el.play()
    if (p && typeof p.then === 'function') p.catch(() => {})
  }

  return (
    <AudioCtx.Provider value={api}>
      {children}
      <audio
        ref={elRef}
        preload="metadata"
        playsInline
        onTimeUpdate={onTime}
        onLoadedMetadata={onMeta}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        onEnded={onEnded}
        // hidden but kept in DOM
        style={{ display: 'none' }}
      />
    </AudioCtx.Provider>
  )
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const ss = Math.floor(s % 60)
  return `${m}:${ss.toString().padStart(2, '0')}`
}

export function MiniPlayer() {
  const { current, playing, blocked, error, progress, currentTime, duration, toggle, next, prev, seek } = useAudio()
  const barRef = useRef<HTMLDivElement>(null)

  if (!current) return null

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = barRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const frac = (e.clientX - rect.left) / rect.width
    seek(frac)
  }

  return (
    <div className="mp" role="region" aria-label="Audio player">
      <div className="mp-info">
        <span className="mp-eyebrow">
          {blocked ? 'Tap play to enable audio' : error ? 'Audio needs attention' : 'Now playing · Iris Veil'}
        </span>
        <span className="mp-title">{current.title}</span>
      </div>
      <div className="mp-controls">
        <button onClick={prev} aria-label="Previous track" className="mp-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12l9.5 6V6z"/></svg>
        </button>
        <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="mp-btn mp-btn-play">
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
          )}
        </button>
        <button onClick={next} aria-label="Next track" className="mp-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 6l10 6L6 18z"/></svg>
        </button>
      </div>
      <div className="mp-bar-wrap" onClick={onScrub}>
        <div ref={barRef} className="mp-bar">
          <div className="mp-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="mp-time">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  )
}
