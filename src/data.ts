export type Track = {
  index: string
  title: string
  duration: string
  feature?: string
}

export type ShowStatus = 'on-sale' | 'few-left' | 'sold-out'

export type Show = {
  date: string
  city: string
  venue: string
  status: ShowStatus
}

export const tracks: Track[] = [
  { index: '01', title: 'Halflight', duration: '3:47' },
  { index: '02', title: 'Coastline in Reverse', duration: '4:12' },
  { index: '03', title: 'Cathedrals', duration: '3:28', feature: 'with Saoirse Klein' },
  { index: '04', title: 'Letter for the Burning House', duration: '5:01' },
  { index: '05', title: 'Pale Star', duration: '3:55' },
  { index: '06', title: 'Telegraph Hour', duration: '4:33' },
  { index: '07', title: 'Halflight (Reprise)', duration: '2:18' },
]

export const shows: Show[] = [
  { date: 'May 14', city: 'London', venue: 'Village Underground', status: 'sold-out' },
  { date: 'May 17', city: 'Berlin', venue: 'Festsaal Kreuzberg', status: 'few-left' },
  { date: 'May 21', city: 'Paris', venue: 'La Maroquinerie', status: 'on-sale' },
  { date: 'May 24', city: 'Amsterdam', venue: 'Paradiso Noord', status: 'on-sale' },
  { date: 'Jun 02', city: 'Copenhagen', venue: 'Vega Jr.', status: 'on-sale' },
  { date: 'Jun 06', city: 'Reykjavík', venue: 'Iðnó', status: 'few-left' },
]

export const statusLabel: Record<ShowStatus, string> = {
  'on-sale': 'On sale',
  'few-left': 'Few left',
  'sold-out': 'Sold out',
}

/* preview tracks — actual audio served from /public/audio */
export type PreviewTrack = {
  id: string
  index: string
  title: string
  src: string
  duration: string  /* mm:ss */
  durationSec: number
}

export const previewTracks: PreviewTrack[] = [
  {
    id: 'compassion',
    index: '01',
    title: 'Compassion No Reward',
    src: '/audio/compassion-no-reward.mp3',
    duration: '3:39',
    durationSec: 219.6,
  },
  {
    id: 'cracked',
    index: '02',
    title: 'Cracked Whole',
    src: '/audio/cracked-whole.mp3',
    duration: '3:04',
    durationSec: 184.56,
  },
  {
    id: 'simple-dent',
    index: '03',
    title: 'Simple Dent',
    src: '/audio/simple-dent.mp3',
    duration: '3:05',
    durationSec: 185.92,
  },
]
