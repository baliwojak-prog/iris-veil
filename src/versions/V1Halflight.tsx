import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  Play,
  SoundcloudLogo,
  TiktokLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { HeroVideo } from '../HeroVideo'
import { useAudio } from '../audio'
import { previewTracks } from '../data'
import './V1Halflight.css'

function MagneticBtn({
  children,
  href,
  primary,
}: {
  children: React.ReactNode
  href: string
  primary?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 240, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 240, damping: 20, mass: 0.4 })

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.18)
    y.set((e.clientY - r.top - r.height / 2) * 0.22)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={primary ? 'v1-btn v1-btn-primary' : 'v1-btn v1-btn-ghost'}
    >
      {children}
    </motion.a>
  )
}

function PreviewSection() {
  const { current, playing, play } = useAudio()
  return (
    <section className="v1-section v1-preview">
      <div className="v1-section-head">
        <span className="v1-eyebrow-dark">Preview</span>
        <h2>Three from the album</h2>
      </div>
      <ul className="v1-preview-list">
        {previewTracks.map((t) => {
          const isCurrent = current?.id === t.id
          const isActive = isCurrent && playing
          return (
            <li key={t.id} className={isCurrent ? 'v1-preview-row active' : 'v1-preview-row'}>
              <button
                className="v1-preview-play"
                onClick={() => play(t.id)}
                aria-label={isActive ? `Pause ${t.title}` : `Play ${t.title}`}
              >
                {isActive ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
                )}
              </button>
              <span className="v1-preview-num">{t.index}</span>
              <span className="v1-preview-title">{t.title}</span>
              <span className="v1-preview-dur">{t.duration}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function FeaturedArt() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 0.96])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])
  return (
    <motion.div
      ref={ref}
      className="v1-featured-art"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        src="https://picsum.photos/id/1043/1280/1280"
        alt="Halflight album art"
        loading="lazy"
        decoding="async"
        style={{ scale, y }}
      />
      <motion.div
        className="v1-featured-stamp"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <span>iris veil</span>
        <strong>Halflight</strong>
        <span>23.04.2026</span>
      </motion.div>
    </motion.div>
  )
}

type Era = { title: string; year: string; cat: string; src: string }
type Product = { title: string; tag: string; price: string; src: string }
type VideoCard = { title: string; meta: string; src: string }

const eras: Era[] = [
  { title: 'Halflight',         year: '2026', cat: 'LP · IRIS VEIL',  src: 'https://picsum.photos/id/1043/720/720?grayscale&blur=1' },
  { title: 'Soft Architecture', year: '2023', cat: 'LP · IRIS VEIL',  src: 'https://picsum.photos/id/1015/720/720?grayscale' },
  { title: 'Pale Star',         year: '2025', cat: 'EP · IRIS VEIL',  src: 'https://picsum.photos/id/1062/720/720?grayscale' },
  { title: 'Telegraph Hour',    year: '2022', cat: 'EP · IRIS VEIL',  src: 'https://picsum.photos/id/1029/720/720?grayscale&blur=1' },
]

const products: Product[] = [
  { title: 'Halflight · Limited Translucent Vinyl',     tag: 'LP', price: '€34',  src: 'https://picsum.photos/id/1080/720/720?grayscale' },
  { title: 'Halflight · Cassette',                       tag: 'CS', price: '€16',  src: 'https://picsum.photos/id/1011/720/720?grayscale' },
  { title: 'Tower Sessions · Tee, Bone Cotton',          tag: 'APP', price: '€48', src: 'https://picsum.photos/id/119/720/720?grayscale' },
  { title: 'Halflight · Hardcover Songbook',             tag: 'PR', price: '€28',  src: 'https://picsum.photos/id/177/720/720?grayscale' },
  { title: 'Telegraph Hour · 7” Reissue',           tag: '7"', price: '€18',  src: 'https://picsum.photos/id/433/720/720?grayscale' },
  { title: 'Iris Veil · Tour Crewneck',                  tag: 'APP', price: '€68', src: 'https://picsum.photos/id/91/720/720?grayscale' },
]

const videos: VideoCard[] = [
  { title: 'Cathedrals',                meta: 'Official Film · Dir. Léa Marchant · 04:32', src: 'https://picsum.photos/id/1015/1080/720?grayscale' },
  { title: 'Halflight (Tower Session)', meta: 'Live · Tegel · 03:47',                       src: 'https://picsum.photos/id/119/1080/720?grayscale' },
  { title: 'Letter for the Burning House', meta: 'Visual · Dir. Iris Veil · 05:01',         src: 'https://picsum.photos/id/1050/1080/720?grayscale' },
]

export function V1Halflight() {
  useEffect(() => {
    document.title = 'Iris Veil'
  }, [])

  return (
    <main className="v1-root">
      {/* Top nav */}
      <header className="v1-bar">
        <a href="https://instagram.com/" className="v1-bar-social" aria-label="Instagram"><InstagramLogo size={14} /></a>
        <a href="#shop" className="v1-bar-link">Shop</a>
        <a href="#letter" className="v1-bar-link">My Letter</a>
        <a href="#archive" className="v1-bar-link">Archive</a>
        <a href="#directed" className="v1-bar-link">Directed Projects</a>
        <a href="#signup" className="v1-bar-link">Sign Up</a>
        <a href="https://tiktok.com/" className="v1-bar-social" aria-label="TikTok"><TiktokLogo size={14} /></a>
      </header>

      {/* Logo hero — centered wordmark, no big image */}
      <section className="v1-logo-hero" id="top">
        <motion.div
          className="v1-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          The new mini-album · out now
        </motion.div>
        <motion.h1
          className="v1-wordmark"
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.16em' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          IRIS&nbsp;VEIL
        </motion.h1>
        <motion.div
          className="v1-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <span className="v1-rule" /> Halflight · MMXXVI <span className="v1-rule" />
        </motion.div>
      </section>

      {/* Trailer video — full bleed feature */}
      <section className="v1-trailer">
        <div className="v1-trailer-frame">
          <HeroVideo className="v1-trailer-video" rate={0.5} showVeil={false} />
          <div className="v1-trailer-overlay">
            <span className="v1-trailer-stamp">Watch the official film</span>
            <strong className="v1-trailer-title">Halflight · A film by Iris Veil</strong>
            <span className="v1-trailer-meta">Dir. Léa Marchant · 04:32</span>
          </div>
        </div>
      </section>

      {/* Featured era — Halflight (big album art with overlaid logo) */}
      <section className="v1-featured">
        <FeaturedArt />
        <motion.div
          className="v1-featured-meta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="v1-featured-cat">The new album</span>
          <h2>Halflight</h2>
          <p>
            Seven songs about long nights, half-spoken letters, and the buildings between us.
            Recorded in a converted radio tower outside Tegel, January through August.
            Produced with Owen Marsh.
          </p>
          <div className="v1-featured-cta">
            <MagneticBtn primary href="#listen">Listen Now</MagneticBtn>
            <MagneticBtn href="#shop">Shop the Album ↗</MagneticBtn>
          </div>
          <ol className="v1-tracklist">
            <li><span>01</span><span>Halflight</span><span>3:47</span></li>
            <li><span>02</span><span>Coastline in Reverse</span><span>4:12</span></li>
            <li><span>03</span><span>Cathedrals — with Saoirse Klein</span><span>3:28</span></li>
            <li><span>04</span><span>Letter for the Burning House</span><span>5:01</span></li>
            <li><span>05</span><span>Pale Star</span><span>3:55</span></li>
            <li><span>06</span><span>Telegraph Hour</span><span>4:33</span></li>
            <li><span>07</span><span>Halflight (Reprise)</span><span>2:18</span></li>
          </ol>
        </motion.div>
      </section>

      <PreviewSection />

      {/* Directed Projects — videos */}
      <section className="v1-section" id="directed">
        <div className="v1-section-head">
          <span className="v1-eyebrow-dark">Directed projects</span>
          <h2>Films & visuals</h2>
        </div>
        <ul className="v1-video-grid">
          {videos.map((v, i) => (
            <motion.li
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
            >
              <a href="#video">
                <div className="v1-video-thumb">
                  {i === 0 ? (
                    <HeroVideo className="v1-vt-frame" rate={0.5} showVeil={false} />
                  ) : (
                    <img src={v.src} alt={v.title} loading="lazy" decoding="async" />
                  )}
                  <span className="v1-play"><Play weight="fill" size={16} /></span>
                </div>
                <strong>{v.title}</strong>
                <small>{v.meta}</small>
              </a>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Shop — merch grid */}
      <section className="v1-section" id="shop">
        <div className="v1-section-head">
          <span className="v1-eyebrow-dark">Shop</span>
          <h2>The store</h2>
        </div>
        <ul className="v1-shop-grid">
          {products.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
            >
              <a href="#shop">
                <div className="v1-product-img">
                  <img src={p.src} alt={p.title} loading="lazy" decoding="async" />
                  <span className="v1-product-tag">{p.tag}</span>
                </div>
                <strong>{p.title}</strong>
                <div className="v1-product-row">
                  <span>{p.price}</span>
                  <span className="v1-shop-now">Shop Now ↗</span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Era archive */}
      <section className="v1-section" id="archive">
        <div className="v1-section-head">
          <span className="v1-eyebrow-dark">Archive</span>
          <h2>The eras</h2>
        </div>
        <ul className="v1-era-grid">
          {eras.map((e, i) => (
            <motion.li
              key={e.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <a href="#era">
                <div className="v1-era-art">
                  <img src={e.src} alt={`${e.title} cover`} loading="lazy" decoding="async" />
                  <div className="v1-era-overlay">
                    <span>{e.cat}</span>
                    <strong>{e.title}</strong>
                  </div>
                </div>
                <div className="v1-era-meta">
                  <span>{e.year}</span>
                  <span>View ↗</span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Letter */}
      <section className="v1-section v1-letter" id="letter">
        <div className="v1-letter-stamp">A letter</div>
        <p className="v1-letter-body">
          I wrote most of this album in the early hours, a borrowed upright in the room and a
          tape machine that kept slipping out of sync. I wanted to make something that felt
          like the part of the night when you can't tell whether it's almost morning or
          almost dark again. Thank you for listening.
        </p>
        <p className="v1-letter-sign">— iris</p>
      </section>

      {/* Sign up */}
      <section className="v1-signup" id="signup">
        <div>
          <span className="v1-eyebrow-dark">Sign up</span>
          <h2>Be the first to hear.</h2>
        </div>
        <form className="v1-signup-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email address" required />
          <select defaultValue="">
            <option value="" disabled>Country / Region</option>
            <option value="DE">Germany</option>
            <option value="UK">United Kingdom</option>
            <option value="US">United States</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="OT">Other</option>
          </select>
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="v1-foot">
        <div className="v1-foot-row">
          <div className="v1-foot-mark">IRIS VEIL</div>
          <div className="v1-foot-social">
            <a href="https://instagram.com/" aria-label="Instagram"><InstagramLogo size={14} /></a>
            <a href="https://tiktok.com/" aria-label="TikTok"><TiktokLogo size={14} /></a>
            <a href="https://youtube.com/" aria-label="YouTube"><YoutubeLogo size={14} /></a>
            <a href="https://soundcloud.com/" aria-label="SoundCloud"><SoundcloudLogo size={14} /></a>
            <a href="https://facebook.com/" aria-label="Facebook"><FacebookLogo size={14} /></a>
            <a href="mailto:hello@irisveil.fm" aria-label="Email"><EnvelopeSimple size={14} /></a>
          </div>
        </div>
        <div className="v1-foot-meta">
          <span>© 2026 Iris Veil · Glassroom Records</span>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
          <span className="v1-foot-credit">made by openflow.bot</span>
        </div>
      </footer>
    </main>
  )
}
