/* curated Unsplash music/concert/instrument photos — verified one-by-one */

const u = (id: string, w: number, h: number, opts?: { gray?: boolean }) => {
  const sat = opts?.gray ? '&sat=-100' : ''
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=80&auto=format${sat}`
}

/* ---- music-themed photo IDs (each visually verified) ---- */

const PHOTOS = {
  micWarm:        '1511671782779-c97d3d27a1d4',  // vintage mic, warm bokeh
  stageSilhouette:'1501612780327-45045538702b',  // concert stage w/ synth players, stark
  micPurple:      '1485579149621-3123dd979885',  // vintage mic on purple
  performer:      '1493225457124-a3eb161ffa5f',  // concert performer w/ smoke
  micBwStage:     '1453090927415-5f45085b65c0',  // mic on dark stage with spotlights, BW
  micCloseup:     '1516280440614-37939bbacd81',  // mic closeup w/ warm bokeh
  crowdYellow:    '1459749411175-04bf5292ceea',  // concert audience yellow lights
  boombox:        '1487180144351-b8472da7d491',  // person w/ retro boombox
  djTurntable:    '1470225620780-dba8ba36b745',  // DJ hand on turntable purple
  guitarBlue:     '1564186763535-ebb21ef5277f',  // blue Stratocaster on stage
  festivalConfetti:'1514525253161-7a46d19cd819', // festival crowd with confetti
  bandAcoustic:   '1483393458019-411bc6bd104e',  // street band trio
  guitarBlack:    '1550985616-10810253b84d',     // black electric guitar w/ amp
}

/* legacy `coverArt` API kept so existing callers compile —
   maps logical glyph → photo URL */
type Glyph = 'vinyl' | 'wave' | 'mic' | 'film' | 'tape' | 'stage' | 'aperture' | 'page' | 'tour' | 'shirt' | 'speaker' | 'note'

type Opts = {
  hue?: number
  glyph?: Glyph
  w?: number
  h?: number
  subtitle?: string
  gray?: boolean
}

const glyphToPhoto: Record<Glyph, string> = {
  vinyl:    PHOTOS.djTurntable,
  wave:     PHOTOS.stageSilhouette,
  mic:      PHOTOS.micWarm,
  film:     PHOTOS.performer,
  tape:     PHOTOS.boombox,
  stage:    PHOTOS.crowdYellow,
  aperture: PHOTOS.micCloseup,
  page:     PHOTOS.micPurple,
  tour:     PHOTOS.festivalConfetti,
  shirt:    PHOTOS.bandAcoustic,
  speaker:  PHOTOS.guitarBlack,
  note:     PHOTOS.guitarBlue,
}

export function coverArt(_title: string, opts: Opts = {}): string {
  const { glyph = 'vinyl', w = 720, h = 720, gray = false } = opts
  return u(glyphToPhoto[glyph], w, h, { gray })
}

/* direct-photo helper for new call-sites */
export const photo = {
  micWarm:         (w = 720, h = 720, gray = false) => u(PHOTOS.micWarm, w, h, { gray }),
  stage:           (w = 720, h = 720, gray = false) => u(PHOTOS.stageSilhouette, w, h, { gray }),
  micPurple:       (w = 720, h = 720, gray = false) => u(PHOTOS.micPurple, w, h, { gray }),
  performer:       (w = 720, h = 720, gray = false) => u(PHOTOS.performer, w, h, { gray }),
  micBw:           (w = 720, h = 720, gray = false) => u(PHOTOS.micBwStage, w, h, { gray }),
  micCloseup:      (w = 720, h = 720, gray = false) => u(PHOTOS.micCloseup, w, h, { gray }),
  crowd:           (w = 720, h = 720, gray = false) => u(PHOTOS.crowdYellow, w, h, { gray }),
  boombox:         (w = 720, h = 720, gray = false) => u(PHOTOS.boombox, w, h, { gray }),
  dj:              (w = 720, h = 720, gray = false) => u(PHOTOS.djTurntable, w, h, { gray }),
  guitarBlue:      (w = 720, h = 720, gray = false) => u(PHOTOS.guitarBlue, w, h, { gray }),
  festival:        (w = 720, h = 720, gray = false) => u(PHOTOS.festivalConfetti, w, h, { gray }),
  band:            (w = 720, h = 720, gray = false) => u(PHOTOS.bandAcoustic, w, h, { gray }),
  guitarBlack:     (w = 720, h = 720, gray = false) => u(PHOTOS.guitarBlack, w, h, { gray }),
}
