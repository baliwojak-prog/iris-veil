import { Suspense, lazy, useEffect, useState } from 'react'
import { AudioProvider, MiniPlayer } from './audio'
import './App.css'

const V1Halflight = lazy(() => import('./versions/V1Halflight').then((m) => ({ default: m.V1Halflight })))
const V2Nocturne  = lazy(() => import('./versions/V2Nocturne').then((m) => ({ default: m.V2Nocturne })))
const V3Static    = lazy(() => import('./versions/V3Static').then((m) => ({ default: m.V3Static })))
const V4Splice    = lazy(() => import('./versions/V4Splice').then((m) => ({ default: m.V4Splice })))

type VersionId = 'v1' | 'v2' | 'v3' | 'v4'

const versions: { id: VersionId; label: string; tag: string }[] = [
  { id: 'v1', label: 'Halflight', tag: 'cream · video' },
  { id: 'v2', label: 'Nocturne', tag: 'cinematic · noir' },
  { id: 'v3', label: 'Static',   tag: 'kpop · sticker' },
  { id: 'v4', label: 'Splice',   tag: 'scroll · invert' },
]

function readHash(): VersionId {
  const h = window.location.hash.replace('#/', '').replace('#', '')
  if (h === 'v2' || h === 'v3' || h === 'v4') return h
  return 'v1'
}

function App() {
  const [version, setVersion] = useState<VersionId>(() =>
    typeof window === 'undefined' ? 'v1' : readHash(),
  )

  useEffect(() => {
    const onHash = () => setVersion(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const select = (id: VersionId) => {
    window.location.hash = `/${id}`
    window.scrollTo(0, 0)
  }

  return (
    <AudioProvider>
      <Suspense fallback={<div className="vload" aria-hidden="true" />}>
        {version === 'v1' && <V1Halflight />}
        {version === 'v2' && <V2Nocturne />}
        {version === 'v3' && <V3Static />}
        {version === 'v4' && <V4Splice />}
      </Suspense>

      <MiniPlayer />

      <div className="vswitch" role="tablist" aria-label="Version">
        {versions.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={version === v.id}
            className={version === v.id ? 'vswitch-btn active' : 'vswitch-btn'}
            onClick={() => select(v.id)}
          >
            <span className="vswitch-id">{v.id.toUpperCase()}</span>
            <span className="vswitch-label">{v.label}</span>
            <span className="vswitch-tag">{v.tag}</span>
          </button>
        ))}
      </div>
    </AudioProvider>
  )
}

export default App
