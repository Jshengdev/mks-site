import { useEffect, useRef } from 'react'
import { SECTION_T_VALUES } from '../meadow/constants.js'
import LandingContent from './LandingContent.jsx'
import MusicContent from './MusicContent.jsx'
import AboutContent from './AboutContent.jsx'
import StoreContent from './StoreContent.jsx'
import FooterContent from './FooterContent.jsx'
import './content-overlay.css'

const SECTION_COMPONENTS = [LandingContent, MusicContent, AboutContent, StoreContent, FooterContent]
const SECTIONS = SECTION_T_VALUES.map((t, i) => ({ t, Component: SECTION_COMPONENTS[i] }))

export default function ContentOverlay({ onSectionsReady }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('.content-section')
    onSectionsReady?.(Array.from(sections))
  }, [onSectionsReady])

  return (
    <div ref={containerRef} className="content-overlay">
      {SECTIONS.map((section) => (
        <div
          key={section.t}
          className="content-section"
          data-section-t={section.t}
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <section.Component />
        </div>
      ))}
    </div>
  )
}
