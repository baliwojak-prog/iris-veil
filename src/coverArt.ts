/* generate inline SVG album-cover-style placeholders — music-themed, deterministic */

type Glyph = 'vinyl' | 'wave' | 'mic' | 'film' | 'tape' | 'stage' | 'aperture' | 'page' | 'tour' | 'shirt' | 'speaker' | 'note'

type Opts = {
  hue?: number          // base hue 0-360
  glyph?: Glyph
  w?: number
  h?: number
  subtitle?: string
}

const glyphSvg = (g: Glyph, w: number, h: number, color: string) => {
  const cx = w * 0.78
  const cy = h * 0.28
  const r = Math.min(w, h) * 0.16
  switch (g) {
    case 'vinyl':
      return `
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.16"/>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.45"/>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.45"/>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.32}" fill="${color}" opacity="0.3"/>
        <circle cx="${cx}" cy="${cy}" r="${r * 0.08}" fill="${color}"/>
      `
    case 'wave': {
      const bars = Array.from({ length: 22 }, (_, i) => {
        const x = cx - r + (i / 21) * r * 2
        const phase = Math.sin((i / 21) * Math.PI * 4) * 0.5 + 0.5
        const bh = r * 1.2 * (0.2 + phase * 0.8)
        return `<rect x="${x}" y="${cy - bh / 2}" width="2" height="${bh}" fill="${color}" opacity="${0.4 + phase * 0.4}" />`
      }).join('')
      return bars
    }
    case 'mic':
      return `
        <rect x="${cx - r * 0.18}" y="${cy - r * 0.55}" width="${r * 0.36}" height="${r * 0.85}" rx="${r * 0.18}" fill="${color}" opacity="0.55"/>
        <path d="M ${cx - r * 0.4} ${cy + r * 0.1} q ${r * 0.4} ${r * 0.5} ${r * 0.8} 0" stroke="${color}" stroke-width="2" fill="none" opacity="0.55"/>
        <line x1="${cx}" y1="${cy + r * 0.45}" x2="${cx}" y2="${cy + r * 0.85}" stroke="${color}" stroke-width="2" opacity="0.55"/>
      `
    case 'film':
      return `
        <rect x="${cx - r * 0.9}" y="${cy - r * 0.55}" width="${r * 1.8}" height="${r * 1.1}" fill="${color}" opacity="0.18"/>
        <polygon points="${cx - r * 0.18},${cy - r * 0.3} ${cx - r * 0.18},${cy + r * 0.3} ${cx + r * 0.32},${cy}" fill="${color}" opacity="0.7"/>
      `
    case 'tape':
      return `
        <rect x="${cx - r}" y="${cy - r * 0.5}" width="${r * 2}" height="${r}" rx="${r * 0.12}" fill="${color}" opacity="0.18"/>
        <circle cx="${cx - r * 0.45}" cy="${cy}" r="${r * 0.28}" fill="none" stroke="${color}" stroke-width="2" opacity="0.55"/>
        <circle cx="${cx + r * 0.45}" cy="${cy}" r="${r * 0.28}" fill="none" stroke="${color}" stroke-width="2" opacity="0.55"/>
        <line x1="${cx - r * 0.85}" y1="${cy + r * 0.32}" x2="${cx + r * 0.85}" y2="${cy + r * 0.32}" stroke="${color}" stroke-width="1.5" opacity="0.55"/>
      `
    case 'stage':
      return Array.from({ length: 5 }, (_, i) => {
        const x = cx + (i - 2) * r * 0.32
        const angle = (i - 2) * 14
        return `<line x1="${x}" y1="${cy - r * 0.6}" x2="${x + Math.tan(angle * Math.PI / 180) * r * 1.2}" y2="${cy + r * 0.6}" stroke="${color}" stroke-width="2.5" opacity="${0.45 - Math.abs(i - 2) * 0.06}" stroke-linecap="round"/>`
      }).join('')
    case 'aperture': {
      const blades = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        const x1 = cx + Math.cos(a) * r * 0.35
        const y1 = cy + Math.sin(a) * r * 0.35
        const x2 = cx + Math.cos(a) * r
        const y2 = cy + Math.sin(a) * r
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" opacity="0.45"/>`
      }).join('')
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>${blades}<circle cx="${cx}" cy="${cy}" r="${r * 0.34}" fill="${color}" opacity="0.18"/>`
    }
    case 'page':
      return `
        <rect x="${cx - r * 0.6}" y="${cy - r * 0.8}" width="${r * 1.2}" height="${r * 1.6}" rx="${r * 0.04}" fill="${color}" opacity="0.14"/>
        <line x1="${cx - r * 0.4}" y1="${cy - r * 0.4}" x2="${cx + r * 0.4}" y2="${cy - r * 0.4}" stroke="${color}" stroke-width="1.5" opacity="0.55"/>
        <line x1="${cx - r * 0.4}" y1="${cy - r * 0.15}" x2="${cx + r * 0.3}" y2="${cy - r * 0.15}" stroke="${color}" stroke-width="1.5" opacity="0.45"/>
        <line x1="${cx - r * 0.4}" y1="${cy + r * 0.1}" x2="${cx + r * 0.4}" y2="${cy + r * 0.1}" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
        <line x1="${cx - r * 0.4}" y1="${cy + r * 0.35}" x2="${cx + r * 0.2}" y2="${cy + r * 0.35}" stroke="${color}" stroke-width="1.5" opacity="0.35"/>
      `
    case 'tour':
      return `
        <circle cx="${cx}" cy="${cy}" r="${r * 0.85}" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>
        <path d="M ${cx - r * 0.7} ${cy} q ${r * 0.7} ${-r * 0.4} ${r * 1.4} 0" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.45"/>
        <path d="M ${cx - r * 0.7} ${cy} q ${r * 0.7} ${r * 0.4} ${r * 1.4} 0" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.45"/>
        <line x1="${cx - r * 0.85}" y1="${cy}" x2="${cx + r * 0.85}" y2="${cy}" stroke="${color}" stroke-width="1.5" opacity="0.45"/>
        <line x1="${cx}" y1="${cy - r * 0.85}" x2="${cx}" y2="${cy + r * 0.85}" stroke="${color}" stroke-width="1.5" opacity="0.45"/>
      `
    case 'shirt':
      return `
        <path d="M ${cx - r * 0.8} ${cy - r * 0.4} l ${r * 0.4} ${-r * 0.25} l ${r * 0.2} ${r * 0.18} l ${r * 0.2} ${-r * 0.18} l ${r * 0.4} ${r * 0.25} l ${-r * 0.18} ${r * 0.5} l ${-r * 0.18} ${-r * 0.05} l 0 ${r * 0.95} l ${-r * 0.88} 0 l 0 ${-r * 0.95} l ${-r * 0.18} ${r * 0.05} z" fill="${color}" opacity="0.18"/>
      `
    case 'speaker':
      return `
        <rect x="${cx - r * 0.5}" y="${cy - r * 0.7}" width="${r}" height="${r * 1.4}" rx="${r * 0.05}" fill="${color}" opacity="0.16"/>
        <circle cx="${cx}" cy="${cy - r * 0.32}" r="${r * 0.16}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.45"/>
        <circle cx="${cx}" cy="${cy + r * 0.22}" r="${r * 0.32}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
      `
    case 'note':
      return `
        <line x1="${cx - r * 0.5}" y1="${cy - r * 0.55}" x2="${cx - r * 0.5}" y2="${cy + r * 0.4}" stroke="${color}" stroke-width="2.5" opacity="0.55"/>
        <line x1="${cx + r * 0.4}" y1="${cy - r * 0.7}" x2="${cx + r * 0.4}" y2="${cy + r * 0.25}" stroke="${color}" stroke-width="2.5" opacity="0.55"/>
        <line x1="${cx - r * 0.5}" y1="${cy - r * 0.55}" x2="${cx + r * 0.4}" y2="${cy - r * 0.7}" stroke="${color}" stroke-width="2.5" opacity="0.55"/>
        <ellipse cx="${cx - r * 0.62}" cy="${cy + r * 0.4}" rx="${r * 0.16}" ry="${r * 0.12}" fill="${color}" opacity="0.7"/>
        <ellipse cx="${cx + r * 0.28}" cy="${cy + r * 0.25}" rx="${r * 0.16}" ry="${r * 0.12}" fill="${color}" opacity="0.7"/>
      `
  }
}

export function coverArt(title: string, opts: Opts = {}): string {
  const { hue = 215, glyph = 'vinyl', w = 720, h = 720, subtitle } = opts
  const bg1 = `hsl(${hue}, 22%, 9%)`
  const bg2 = `hsl(${(hue + 18) % 360}, 24%, 18%)`
  const fg = `hsl(${hue}, 14%, 92%)`
  const accent = `hsl(${(hue + 28) % 360}, 55%, 65%)`
  const titleSize = Math.min(w, h) / 11
  const subSize = Math.min(w, h) / 30

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="r" cx="0.78" cy="0.28" r="0.6">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="${accent}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .25 0"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#r)"/>
  ${glyphSvg(glyph, w, h, accent)}
  <rect x="${w * 0.06}" y="${h * 0.06}" width="${Math.min(w, h) * 0.06}" height="1" fill="${fg}" opacity="0.7"/>
  <text x="${w * 0.06}" y="${h * 0.12}" font-family="Bricolage Grotesque, Jost, sans-serif" font-weight="700" font-size="${subSize}" fill="${fg}" opacity="0.6" letter-spacing="3">IRIS VEIL</text>
  <text x="${w * 0.06}" y="${h * 0.85}" font-family="Bricolage Grotesque, Jost, sans-serif" font-weight="800" font-size="${titleSize}" fill="${fg}" letter-spacing="-0.5">${title.toUpperCase()}</text>
  ${subtitle ? `<text x="${w * 0.06}" y="${h * 0.92}" font-family="Bricolage Grotesque, Jost, sans-serif" font-weight="500" font-size="${subSize}" fill="${fg}" opacity="0.55" letter-spacing="2">${subtitle.toUpperCase()}</text>` : ''}
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.4"/>
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
