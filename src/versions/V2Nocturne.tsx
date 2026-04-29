import { useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, EnvelopeSimple, InstagramLogo, SoundcloudLogo, SpotifyLogo } from '@phosphor-icons/react'
import { HeroVideo } from '../HeroVideo'
import { shows, tracks, previewTracks } from '../data'
import { useAudio } from '../audio'
import './V2Nocturne.css'

const romanize = (n: number) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] ?? String(n)

function V2Preview() {
  const { current, playing, play } = useAudio()
  return (
    <section className="v2-section">
      <div className="v2-section-rule">
        <span>—</span><span>Preview</span><span>{previewTracks.length} tracks · audible</span>
      </div>
      <ul className="v2-preview">
        {previewTracks.map((t, i) => {
          const isCurrent = current?.id === t.id
          const isActive = isCurrent && playing
          return (
            <li key={t.id} className={isCurrent ? 'v2-preview-row active' : 'v2-preview-row'}>
              <button
                className="v2-preview-play"
                onClick={() => play(t.id)}
                aria-label={isActive ? `Pause ${t.title}` : `Play ${t.title}`}
              >
                {isActive ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
                )}
              </button>
              <span className="v2-preview-roman">{romanize(i + 1)}</span>
              <span className="v2-preview-name">{t.title}</span>
              <span className="v2-preview-dur">{t.duration}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function V2Nocturne() {
  useEffect(() => {
    document.title = 'Iris Veil — Halflight (v2 · nocturne)'
  }, [])

  return (
    <main className="v2-root">
      {/* deluxe atmospheric glow — drifting orbs only */}
      <div className="v2-atmos" aria-hidden="true">
        <div className="v2-orb v2-orb-1" />
        <div className="v2-orb v2-orb-2" />
        <div className="v2-orb v2-orb-3" />
        <div className="v2-orb v2-orb-4" />
        <div className="v2-haze" />
      </div>

      <div className="v2-edge v2-edge-left" />
      <div className="v2-edge v2-edge-right" />

      <header className="v2-masthead">
        <div className="v2-mast-left">
          <span className="v2-mast-label">Glassroom Records</span>
          <span className="v2-mast-issue">Cat. HVL-0204</span>
        </div>
        <div className="v2-mast-center">
          <span>Iris Veil</span>
        </div>
        <div className="v2-mast-right">
          <a href="mailto:bookings@irisveil.fm">Booking ↗</a>
        </div>
      </header>

      <section className="v2-stage">
        <div className="v2-stage-caption-top">
          <span>A film by Iris Veil</span>
          <span>Halflight · MMXXVI</span>
        </div>
      </section>

      <div className="v2-letterbox">
        <HeroVideo className="v2-video-frame" rate={0.45} showVeil={false} />
        <div className="v2-letterbox-overlay">
          <span>Berlin / London</span>
          <span>04:11 — Tegel</span>
        </div>
      </div>

      <section className="v2-stage v2-stage-after">

        <motion.h1
          className="v2-title"
          initial={{ opacity: 0, y: 20, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.06em' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Halflight
        </motion.h1>

        <p className="v2-credit">
          Recorded January–August in a converted radio tower outside Tegel.
          Produced with Owen Marsh. Strings by Klangfeld Quartet.
        </p>
      </section>

      <V2Preview />

      <section className="v2-section">
        <div className="v2-section-rule">
          <span>I.</span><span>The Record</span><span>{tracks.length} tracks · 27:14</span>
        </div>
        <ol className="v2-tracks">
          {tracks.map((t, i) => (
            <motion.li
              key={t.index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
            >
              <span className="v2-track-roman">{romanize(i + 1)}</span>
              <span className="v2-track-name">{t.title}{t.feature && <em>&nbsp;— {t.feature}</em>}</span>
              <span className="v2-track-dur">{t.duration}</span>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="v2-section">
        <div className="v2-section-rule">
          <span>II.</span><span>Live</span><span>Spring tour 2026</span>
        </div>
        <ul className="v2-shows">
          {shows.map((show, i) => (
            <motion.li
              key={show.date + show.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
            >
              <div className="v2-show-city">{show.city}</div>
              <div className="v2-show-meta">
                <span>{show.date} · 2026</span>
                <span>{show.venue}</span>
                <span className={`v2-show-stat v2-stat-${show.status}`}>
                  {show.status === 'sold-out' ? 'Sold out' : show.status === 'few-left' ? 'Limited' : 'On sale'}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="v2-section v2-about">
        <div className="v2-section-rule">
          <span>III.</span><span>Iris Veil</span><span>b. 1993, Vilnius</span>
        </div>
        <div className="v2-about-grid">
          <figure className="v2-portrait">
            <img src="https://picsum.photos/id/119/720/960?grayscale" alt="Iris Veil — Tegel studio" loading="lazy" decoding="async" />
            <figcaption>Tegel · 04:11 · February</figcaption>
          </figure>
          <div className="v2-about-text">
            <p className="v2-lede">
              Berlin-based recording artist. Her debut <em>Soft Architecture</em> (2023, Glassroom)
              was longlisted for the Mercury Prize. Studied composition at the Royal Academy.
              Sings in English, French, and the Lithuanian her grandmother taught her.
            </p>
            <p>
              <em>Halflight</em> was written almost entirely on a 1978 Roland CR-78 and a borrowed upright,
              between two cities, in the long pause between her debut and now.
            </p>

            <dl className="v2-credits">
              <div><dt>Management</dt><dd>Mira Kosari · Pollen Studio</dd></div>
              <div><dt>Bookings</dt><dd>Lukas Brandenburg · Heron Live</dd></div>
              <div><dt>Press</dt><dd>Anneke Vermeulen · Stillpoint PR</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="v2-section v2-listen">
        <div className="v2-section-rule">
          <span>IV.</span><span>Listen</span><span>Available now</span>
        </div>
        <div className="v2-listen-row">
          <a href="https://open.spotify.com/"><SpotifyLogo size={18} weight="fill" />Spotify<ArrowUpRight size={12} weight="bold" /></a>
          <a href="https://music.apple.com/">Apple Music<ArrowUpRight size={12} weight="bold" /></a>
          <a href="https://soundcloud.com/"><SoundcloudLogo size={18} weight="fill" />SoundCloud<ArrowUpRight size={12} weight="bold" /></a>
          <a href="https://bandcamp.com/">Bandcamp<ArrowUpRight size={12} weight="bold" /></a>
          <a href="https://youtube.com/">YouTube<ArrowUpRight size={12} weight="bold" /></a>
        </div>
      </section>

      <footer className="v2-footer">
        <div className="v2-footer-rule" />
        <div className="v2-footer-row">
          <span>© MMXXVI · Glassroom Records</span>
          <div className="v2-footer-social">
            <a href="https://instagram.com/" aria-label="Instagram"><InstagramLogo size={14} /></a>
            <a href="https://soundcloud.com/" aria-label="SoundCloud"><SoundcloudLogo size={14} /></a>
            <a href="mailto:hello@irisveil.fm" aria-label="Email"><EnvelopeSimple size={14} /></a>
          </div>
          <span>Berlin / London</span>
        </div>
        <div className="v2-footer-row v2-footer-credit">
          <span>made by openflow.bot</span>
        </div>
      </footer>
    </main>
  )
}
