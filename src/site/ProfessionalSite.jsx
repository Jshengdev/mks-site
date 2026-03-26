import { useState, useRef, useEffect, useCallback } from 'react'
import { initPostHog, trackVariation } from './posthog.js'
import VariationA from './variations/VariationA.jsx'
import VariationB from './variations/VariationB.jsx'
import VariationC from './variations/VariationC.jsx'
import './site.css'

const variations = [
  { id: 'einaudi', label: 'I', component: VariationA },
  { id: 'editorial', label: 'II', component: VariationB },
  { id: 'refined', label: 'III', component: VariationC },
]

export default function ProfessionalSite() {
  const [current, setCurrent] = useState(0)
  const touchStart = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => { initPostHog() }, [])
  useEffect(() => { trackVariation(variations[current].id) }, [current])

  const goTo = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(variations.length - 1, idx)))
  }, [])

  // Touch swipe
  const onTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) {
      goTo(current + (diff > 0 ? 1 : -1))
    }
    touchStart.current = null
  }, [current, goTo])

  // Mouse drag swipe
  const onMouseDown = useCallback((e) => {
    touchStart.current = e.clientX
  }, [])

  const onMouseUp = useCallback((e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.clientX
    if (Math.abs(diff) > 80) {
      goTo(current + (diff > 0 ? 1 : -1))
    }
    touchStart.current = null
  }, [current, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, goTo])

  const Variation = variations[current].component

  return (
    <>
      <SEOHead />
      <div
        className="site"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        {/* Variation indicator + nav dots */}
        <div className="site-variation-nav">
          {variations.map((v, i) => (
            <button
              key={v.id}
              className={`site-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Variation ${v.label}`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Current variation */}
        <Variation />

        {/* Swipe hint */}
        <div className="site-swipe-hint">
          swipe to browse variations
        </div>
      </div>
    </>
  )
}

function SEOHead() {
  useEffect(() => {
    document.title = 'Michael Kim-Sheng — Composer'

    const metas = {
      description: 'Michael Kim-Sheng is a composer whose music creates worlds. Each composition is an emotional landscape — a place you inhabit, not a sound you hear.',
      'og:title': 'Michael Kim-Sheng — Composer',
      'og:description': 'Composer for film, concert, and immersive experiences. Music that creates worlds.',
      'og:type': 'website',
      'og:url': 'https://michaelkimsheng.com',
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Michael Kim-Sheng — Composer',
      'twitter:description': 'Composer for film, concert, and immersive experiences.',
    }

    for (const [key, value] of Object.entries(metas)) {
      const attr = key.startsWith('og:') ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    // Structured data — Schema.org Person + MusicGroup
    let script = document.getElementById('ld-json')
    if (!script) {
      script = document.createElement('script')
      script.id = 'ld-json'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Michael Kim-Sheng',
      url: 'https://michaelkimsheng.com',
      jobTitle: 'Composer',
      sameAs: [
        'https://open.spotify.com',
        'https://youtube.com',
        'https://instagram.com',
        'https://facebook.com',
      ],
    })
  }, [])

  return null
}
