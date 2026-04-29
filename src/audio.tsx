import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { previewTracks, type PreviewTrack } from './data'

type AudioState = {
  current: PreviewTrack | null
  playing: boolean
  progress: number       // 0..1
  currentTime: number    // seconds
  duration: number       // seconds
}

type AudioApi = AudioState & {
  play: (id: string) => void
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
  if (!elRef.current && typeof window !== 'undefined') {
    elRef.current = new Audio()
    elRef.current.preload = 'metadata'
  }

  const [current, setCurrent] = useState<PreviewTrack | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // ref mirrors `current` so the `ended` handler can auto-advance without re-binding
  const currentRef = useRef<PreviewTrack | null>(null)
  useEffect(() => { currentRef.current = current }, [current])

  // attach event listeners to the singleton audio element
  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const onTime = () => setCurrentTime(el.currentTime)
    const onMeta = () => setDuration(el.duration || 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      const c = currentRef.current
      if (!c) { setPlaying(false); return }
      const idx = previewTracks.findIndex((t) => t.id === c.id)
      const nextTrack = previewTracks[(idx + 1) % previewTracks.length]
      if (!nextTrack) return
      el.src = nextTrack.src
      el.play().catch(() => {})
      setCurrent(nextTrack)
    }
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
    }
  }, [])

  /* synchronous swap — must run inside the originating user-gesture handler
     so the browser allows `el.play()` without throwing autoplay restrictions */
  const swapTrack = (t: PreviewTrack) => {
    const el = elRef.current
    if (!el) return
    if (!el.src.endsWith(t.src)) el.src = t.src
    el.play().catch(() => {})
    setCurrent(t)
  }

  const play = useCallback((id: string) => {
    const t = previewTracks.find((x) => x.id === id) ?? null
    if (!t) return
    const el = elRef.current
    if (!el) return
    if (current?.id === id) {
      if (el.paused) el.play().catch(() => {})
      else el.pause()
      return
    }
    swapTrack(t)
  }, [current])

  const toggle = useCallback(() => {
    const el = elRef.current
    if (!el) return
    if (!current) {
      const first = previewTracks[0]
      if (first) swapTrack(first)
      return
    }
    if (el.paused) el.play().catch(() => {})
    else el.pause()
  }, [current])

  const next = useCallback(() => {
    const t = current
      ? previewTracks[(previewTracks.findIndex((x) => x.id === current.id) + 1) % previewTracks.length]
      : previewTracks[0]
    if (t) swapTrack(t)
  }, [current])

  const prev = useCallback(() => {
    const idx = current
      ? (previewTracks.findIndex((x) => x.id === current.id) - 1 + previewTracks.length) % previewTracks.length
      : previewTracks.length - 1
    const t = previewTracks[idx]
    if (t) swapTrack(t)
  }, [current])

  const seek = useCallback((frac: number) => {
    const el = elRef.current
    if (!el || !duration) return
    el.currentTime = Math.max(0, Math.min(duration, frac * duration))
  }, [duration])

  const progress = duration > 0 ? currentTime / duration : 0

  const api = useMemo<AudioApi>(
    () => ({ current, playing, progress, currentTime, duration, play, toggle, next, prev, seek }),
    [current, playing, progress, currentTime, duration, play, toggle, next, prev, seek],
  )

  return <AudioCtx.Provider value={api}>{children}</AudioCtx.Provider>
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const ss = Math.floor(s % 60)
  return `${m}:${ss.toString().padStart(2, '0')}`
}

export function MiniPlayer() {
  const { current, playing, progress, currentTime, duration, toggle, next, prev, seek } = useAudio()
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
        <span className="mp-eyebrow">Now playing · Iris Veil</span>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM4.5 12l10 6V6z" transform="scale(1,1)"/><path d="M16 6h2v12h-2zM6 6l10 6L6 18z"/></svg>
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
