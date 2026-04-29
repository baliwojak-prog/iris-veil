import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, EnvelopeSimple, SoundcloudLogo, SpotifyLogo } from '@phosphor-icons/react'
import { previewTracks, shows, statusLabel, tracks } from '../data'
import { useAudio } from '../audio'
import './V4Splice.css'

const STRIPS = 14

function V4Preview() {
  const { current, playing, play } = useAudio()
  return (
    <section className="v4-section v4-preview">
      <header className="v4-section-head">
        <span>00 — Preview</span>
        <h2>Three from the album.</h2>
      </header>
      <ol className="v4-preview-list">
        {previewTracks.map((t) => {
          const isCurrent = current?.id === t.id
          const isActive = isCurrent && playing
          return (
            <li key={t.id} className={isCurrent ? 'v4-preview-row active' : 'v4-preview-row'}>
              <button
                className="v4-preview-play"
                onClick={() => play(t.id)}
                aria-label={isActive ? `Pause ${t.title}` : `Play ${t.title}`}
              >
                {isActive ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
                )}
              </button>
              <span className="v4-preview-num">{t.index}</span>
              <span className="v4-preview-title">{t.title}</span>
              <span className="v4-preview-dur">{t.duration}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function V4Splice() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    document.title = 'Iris Veil — Halflight (v4 · splice)'
  }, [])

  // slow the video
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.playbackRate = 0.5
    const onLoaded = () => { el.playbackRate = 0.5 }
    el.addEventListener('loadedmetadata', onLoaded)
    return () => el.removeEventListener('loadedmetadata', onLoaded)
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = heroRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const h = window.innerHeight
        const p = Math.min(1, Math.max(0, -rect.top / (rect.height - h * 0.4)))
        setProgress(p)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const strips = Array.from({ length: STRIPS }, (_, i) => {
    const t = i / (STRIPS - 1)
    const top = t * 100
    const bottom = ((i + 1) / STRIPS) * 100
    const dir = i % 2 === 0 ? -1 : 1
    const variance = 0.6 + ((i * 37) % 100) / 100
    const driftPct = dir * progress * 80 * variance
    const middleness = 1 - Math.abs((i / (STRIPS - 1)) - 0.5) * 2
    const fadeStart = 0.3 + middleness * 0.25
    const opacity = Math.max(0, 1 - Math.max(0, (progress - fadeStart) / (1 - fadeStart)))
    const blur = progress > 0.6 ? (progress - 0.6) * 12 : 0
    return { top, bottom, driftPct, opacity, blur, key: i }
  })

  return (
    <main className="v4-root">
      <nav className="v4-nav">
        <span className="v4-nav-mark">IV</span>
        <span className="v4-nav-name">Iris Veil</span>
        <a className="v4-nav-cta" href="mailto:bookings@irisveil.fm">Booking ↗</a>
      </nav>

      {/* solid white traveling bars — invert text where they cross via difference blend.
          fade in once past the hero. */}
      <div
        className="v4-bars"
        aria-hidden="true"
        style={{ opacity: progress }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="v4-bar"
            style={{
              animationDuration: `${10 + i * 3}s`,
              animationDelay: `${i * 1.6}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }}
          />
        ))}
      </div>

      <div ref={heroRef} className="v4-hero" style={{ '--p': progress } as React.CSSProperties}>
        <div className="v4-strips" aria-hidden="true">
          <video
            ref={videoRef}
            src="/hero.mp4"
            autoPlay loop muted playsInline preload="auto"
            className="v4-source-video"
          />
          {strips.map((s) => (
            <div
              key={s.key}
              className="v4-strip"
              style={{
                clipPath: `inset(${s.top}% 0 ${100 - s.bottom}% 0)`,
                transform: `translate3d(${s.driftPct}%, 0, 0)`,
                opacity: s.opacity,
                filter: s.blur ? `blur(${s.blur}px)` : 'none',
              }}
            >
              <video
                src="/hero.mp4"
                autoPlay loop muted playsInline preload="auto"
                className="v4-strip-video"
              />
            </div>
          ))}
          <div className="v4-strip-grain" aria-hidden="true" />
        </div>

        <div className="v4-hero-overlay">
          <motion.div
            className="v4-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <span className="v4-eyebrow-bar" />
            Halflight · MMXXVI · Glassroom
          </motion.div>

          <motion.h1
            className="v4-title"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="v4-title-line">Iris</span>
            <span className="v4-title-line v4-italic">Veil</span>
          </motion.h1>

          <motion.p
            className="v4-lede"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            A second record about long nights, half-spoken letters, and the buildings between us.
          </motion.p>

          <div className="v4-scroll-hint">
            <span className="v4-scroll-line" />
            <span>Scroll · the image dissolves</span>
          </div>
        </div>
      </div>

      <V4Preview />

      <section className="v4-section">
        <header className="v4-section-head">
          <span>01 — The record</span>
          <h2>Halflight</h2>
          <p>
            Seven songs written between two cities. Synths run through a broken Studer A800.
            Strings recorded by Klangfeld Quartet in a single afternoon. Produced with Owen Marsh.
          </p>
        </header>
        <ol className="v4-tracks">
          {tracks.map((t, i) => (
            <motion.li
              key={t.index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <span className="v4-track-num">{t.index}</span>
              <span className="v4-track-title">{t.title}</span>
              {t.feature && <span className="v4-track-feat">{t.feature}</span>}
              <span className="v4-track-dur">{t.duration}</span>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="v4-section">
        <header className="v4-section-head">
          <span>02 — Live</span>
          <h2>Spring tour 2026</h2>
        </header>
        <ul className="v4-shows">
          {shows.map((show) => (
            <li key={show.date + show.city}>
              <span className="v4-show-date">{show.date}</span>
              <span className="v4-show-city">{show.city}</span>
              <span className="v4-show-venue">{show.venue}</span>
              <span className={`v4-show-status v4-status-${show.status}`}>{statusLabel[show.status]}</span>
              <a href={show.status === 'sold-out' ? '#' : 'https://example.com/tickets'} aria-disabled={show.status === 'sold-out'} className={show.status === 'sold-out' ? 'v4-show-btn v4-show-btn-off' : 'v4-show-btn'}>
                {show.status === 'sold-out' ? '—' : <>Tickets <ArrowUpRight size={12} weight="bold" /></>}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="v4-section v4-listen">
        <header className="v4-section-head">
          <span>03 — Listen</span>
          <h2>Out now.</h2>
        </header>
        <div className="v4-listen-row">
          <a href="https://open.spotify.com/"><SpotifyLogo size={18} weight="fill" /> Spotify</a>
          <a href="https://music.apple.com/">Apple Music</a>
          <a href="https://soundcloud.com/"><SoundcloudLogo size={18} weight="fill" /> SoundCloud</a>
          <a href="https://bandcamp.com/">Bandcamp</a>
          <a href="https://youtube.com/">YouTube</a>
        </div>
      </section>

      <footer className="v4-foot">
        <span>© 2026 Glassroom Records</span>
        <a href="mailto:hello@irisveil.fm"><EnvelopeSimple size={14} /> hello@irisveil.fm</a>
        <span>Berlin / London</span>
        <span className="v4-foot-credit">made by openflow.bot</span>
      </footer>
    </main>
  )
}
