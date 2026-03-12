import { useEffect, useRef } from 'react'
import LandingContent from './LandingContent.jsx'
import MusicContent from './MusicContent.jsx'
import AboutContent from './AboutContent.jsx'
import StoreContent from './StoreContent.jsx'
import FooterContent from './FooterContent.jsx'
import './content-overlay.css'

const SECTIONS = [
  { t: 0.075, Component: LandingContent },
  { t: 0.275, Component: MusicContent },
  { t: 0.475, Component: AboutContent },
  { t: 0.725, Component: StoreContent },
  { t: 0.925, Component: FooterContent },
]

export default function ContentOverlay({ onSectionsReady }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('.content-section')
    onSectionsReady?.(Array.from(sections))
  }, [onSectionsReady])

  return (
    <div ref={containerRef} className="content-overlay">
      {SECTIONS.map(({ t, Component }) => (
        <div
          key={t}
          className="content-section"
          data-section-t={t}
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <Component />
        </div>
      ))}
    </div>
  )
}
