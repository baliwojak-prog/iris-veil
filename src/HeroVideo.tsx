import { useEffect, useRef } from 'react'

type Props = {
  className?: string
  rate?: number
  showVeil?: boolean
}

export function HeroVideo({ className = 'hero-video-frame', rate = 0.55, showVeil = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.playbackRate = rate
    const onLoaded = () => {
      el.playbackRate = rate
    }
    el.addEventListener('loadedmetadata', onLoaded)
    return () => el.removeEventListener('loadedmetadata', onLoaded)
  }, [rate])

  return (
    <div className={className} aria-hidden="true">
      <video
        ref={ref}
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hero-video"
      />
      {showVeil && <div className="hero-video-veil" />}
    </div>
  )
}
