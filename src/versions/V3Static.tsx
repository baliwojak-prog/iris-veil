import { useEffect } from 'react'
import { motion } from 'motion/react'
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  SoundcloudLogo,
  TiktokLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { HeroVideo } from '../HeroVideo'
import { previewTracks } from '../data'
import { useAudio } from '../audio'
import { coverArt } from '../coverArt'
import './V3Static.css'

type Tile = {
  id: string
  span: 'sq' | 'wide' | 'tall' | 'large'
  date: string
  cat: string
  title: string
  src: string
  href: string
  kind?: 'video' | 'photo' | 'audio' | 'press'
}

const tiles: Tile[] = [
  {
    id: 't1', span: 'large', date: '23 APR 26', cat: 'Music',
    title: 'Halflight — out now',
    src: coverArt('Halflight', { hue: 18, glyph: 'vinyl', w: 1080, h: 1080, subtitle: 'Mini-Album · Out Now' }),
    href: '#release', kind: 'audio',
  },
  {
    id: 't2', span: 'wide', date: '21 APR 26', cat: 'Video',
    title: 'Cathedrals — official film',
    src: coverArt('Cathedrals', { hue: 215, glyph: 'film', w: 1080, h: 720, subtitle: 'Official Film' }),
    href: '#video', kind: 'video',
  },
  {
    id: 't3', span: 'tall', date: '18 APR 26', cat: 'Press',
    title: 'On the cover of Dazed',
    src: coverArt('Dazed · May', { hue: 340, glyph: 'page', w: 720, h: 1080, subtitle: 'Cover Story' }),
    href: '#press', kind: 'press',
  },
  {
    id: 't4', span: 'sq', date: '15 APR 26', cat: 'Photos',
    title: 'Studio Tegel · sessions',
    src: coverArt('Tegel Studio', { hue: 200, glyph: 'mic', subtitle: 'Sessions' }),
    href: '#photos', kind: 'photo',
  },
  {
    id: 't5', span: 'wide', date: '12 APR 26', cat: 'Live',
    title: 'Spring tour 2026 announced',
    src: coverArt('Spring Tour 2026', { hue: 285, glyph: 'tour', w: 1080, h: 720, subtitle: '6 Cities · Europe' }),
    href: '#shows',
  },
  {
    id: 't6', span: 'sq', date: '08 APR 26', cat: 'Photos',
    title: 'Berlin · roof shoot',
    src: coverArt('Berlin Roof', { hue: 240, glyph: 'aperture', subtitle: 'Photo Shoot' }),
    href: '#photos', kind: 'photo',
  },
  {
    id: 't7', span: 'tall', date: '03 APR 26', cat: 'Music',
    title: 'Pale Star · single',
    src: coverArt('Pale Star', { hue: 280, glyph: 'note', w: 720, h: 1080, subtitle: 'Single' }),
    href: '#release', kind: 'audio',
  },
  {
    id: 't8', span: 'sq', date: '01 APR 26', cat: 'Merch',
    title: 'Limited vinyl pressing',
    src: coverArt('Limited Vinyl', { hue: 32, glyph: 'vinyl', subtitle: 'Pressing of 500' }),
    href: '#shop',
  },
  {
    id: 't9', span: 'wide', date: '24 MAR 26', cat: 'Interview',
    title: 'In conversation · The FADER',
    src: coverArt('The FADER', { hue: 12, glyph: 'mic', w: 1080, h: 720, subtitle: 'In Conversation' }),
    href: '#press', kind: 'press',
  },
  {
    id: 't10', span: 'sq', date: '15 MAR 26', cat: 'Behind',
    title: 'Tower sessions · day 12',
    src: coverArt('Day 12', { hue: 165, glyph: 'wave', subtitle: 'Tower Sessions' }),
    href: '#photos', kind: 'photo',
  },
]

const filters = ['ALL', 'NOW', 'MUSIC', 'VIDEOS', 'PHOTOS', 'PRESS', 'LIVE'] as const

function V3Preview() {
  const { current, playing, play } = useAudio()
  return (
    <section className="v3-preview">
      <div className="v3-preview-head">
        <span>PREVIEW</span>
        <h2>3 TRACKS · STREAMING NOW</h2>
      </div>
      <div className="v3-preview-grid">
        {previewTracks.map((t) => {
          const isCurrent = current?.id === t.id
          const isActive = isCurrent && playing
          return (
            <button
              key={t.id}
              className={isCurrent ? 'v3-preview-tile active' : 'v3-preview-tile'}
              onClick={() => play(t.id)}
              aria-label={isActive ? `Pause ${t.title}` : `Play ${t.title}`}
            >
              <span className="v3-preview-icon">
                {isActive ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
                )}
              </span>
              <span className="v3-preview-text">
                <span className="v3-preview-num">{t.index}</span>
                <strong>{t.title}</strong>
                <span className="v3-preview-time">{t.duration}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function V3Static() {
  useEffect(() => {
    document.title = 'IRIS VEIL · NOW'
  }, [])

  return (
    <main className="v3-root">
      <header className="v3-bar">
        <a href="#top" className="v3-logo">IRIS VEIL</a>
        <nav className="v3-nav">
          {filters.map((f) => (
            <a key={f} href={`#${f.toLowerCase()}`} className={f === 'ALL' ? 'v3-nav-link active' : 'v3-nav-link'}>{f}</a>
          ))}
        </nav>
        <a className="v3-shop" href="#shop">SHOP ↗</a>
      </header>

      <section className="v3-marquee" aria-label="Status">
        <div className="v3-marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>HALFLIGHT — OUT NOW — SPRING TOUR 2026 — TICKETS LIVE — </span>
          ))}
        </div>
      </section>

      <section className="v3-hero" id="top">
        <div className="v3-hero-video" aria-hidden="true">
          <HeroVideo className="v3-hv-frame" rate={0.5} showVeil={false} />
        </div>
        <div className="v3-hero-overlay">
          <div className="v3-hero-stamp">CH 04 · 04:11</div>
          <h1 className="v3-hero-title">
            <span>HALF</span><span>LIGHT</span>
          </h1>
          <div className="v3-hero-meta">
            <span>NEW MINI-ALBUM</span>
            <span>23.04.2026</span>
            <span>GLASSROOM RECORDS</span>
          </div>
        </div>
      </section>

      <section className="v3-grid" id="now">
        {tiles.map((t, i) => (
          <motion.a
            key={t.id}
            href={t.href}
            className={`v3-tile v3-tile-${t.span}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % 6) * 0.04 }}
          >
            <img src={t.src} alt={t.title} loading="lazy" decoding="async" />
            <div className="v3-tile-overlay">
              <div className="v3-tile-meta">
                <span>{t.date}</span>
                <span className="v3-tile-cat">{t.cat}</span>
              </div>
              <div className="v3-tile-title">{t.title}</div>
              <div className="v3-tile-arrow">↗</div>
            </div>
            {t.kind === 'video' && <span className="v3-tile-badge">▶ VIDEO</span>}
            {t.kind === 'audio' && <span className="v3-tile-badge">♪ LISTEN</span>}
            {t.kind === 'press' && <span className="v3-tile-badge">PRESS</span>}
            {t.kind === 'photo' && <span className="v3-tile-badge">+ {Math.floor(Math.random() * 18 + 6)}</span>}
          </motion.a>
        ))}
      </section>

      <V3Preview />

      <section className="v3-cta-band">
        <div>
          <span className="v3-cta-eyebrow">Stay close</span>
          <h2>Join the mailing list.</h2>
        </div>
        <form className="v3-cta-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </section>

      <footer className="v3-foot">
        <div className="v3-foot-row">
          <span className="v3-foot-mark">IV — IRIS VEIL</span>
          <div className="v3-foot-social">
            <a href="https://instagram.com/" aria-label="Instagram"><InstagramLogo size={16} /></a>
            <a href="https://tiktok.com/" aria-label="TikTok"><TiktokLogo size={16} /></a>
            <a href="https://youtube.com/" aria-label="YouTube"><YoutubeLogo size={16} /></a>
            <a href="https://soundcloud.com/" aria-label="SoundCloud"><SoundcloudLogo size={16} /></a>
            <a href="https://facebook.com/" aria-label="Facebook"><FacebookLogo size={16} /></a>
            <a href="mailto:hello@irisveil.fm" aria-label="Email"><EnvelopeSimple size={16} /></a>
          </div>
        </div>
        <div className="v3-foot-row v3-foot-meta">
          <span>© 2026 Iris Veil · Glassroom Records</span>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
          <span className="v3-foot-credit">made by openflow.bot</span>
        </div>
      </footer>
    </main>
  )
}
