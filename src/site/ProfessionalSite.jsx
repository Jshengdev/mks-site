import { useState, useRef, useCallback, useEffect } from 'react'
import { initPostHog, trackVariation } from './posthog.js'
import SocialIcons from './SocialIcons.jsx'
import portrait from '../assets/textures/mks-portrait.jpg'
import './site.css'

const VARIATIONS = ['atmosphere', 'editorial', 'refined']

export default function ProfessionalSite() {
  const [idx, setIdx] = useState(0)
  const touchX = useRef(null)

  useEffect(() => { initPostHog() }, [])
  useEffect(() => { trackVariation(VARIATIONS[idx]) }, [idx])

  const go = useCallback((i) => setIdx(Math.max(0, Math.min(VARIATIONS.length - 1, i))), [])

  const onTouchStart = useCallback((e) => { touchX.current = e.touches[0].clientX }, [])
  const onTouchEnd = useCallback((e) => {
    if (touchX.current === null) return
    const d = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(d) > 50) go(idx + (d > 0 ? 1 : -1))
    touchX.current = null
  }, [idx, go])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowLeft') go(idx - 1)
      if (e.key === 'ArrowRight') go(idx + 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [idx, go])

  return (
    <>
      <SEO />
      <div className={`site v-${VARIATIONS[idx]}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Dots */}
        <div className="dots">
          {VARIATIONS.map((v, i) => (
            <button key={v} className={`dot ${i === idx ? 'on' : ''}`} onClick={() => go(i)} aria-label={`Style ${i + 1}`} />
          ))}
        </div>

        {/* ─── HERO ─── */}
        <section className="hero">
          <div className="hero-portrait">
            <img src={portrait} alt="Michael Kim-Sheng" loading="eager" />
            <div className="hero-fade" />
          </div>
          <div className="hero-text">
            <h1 className="hero-name">Michael Kim-Sheng</h1>
            <p className="hero-sub">Composer</p>
          </div>
        </section>

        {/* ─── NAV (below hero — Einaudi style: content IS below) ─── */}
        <nav className="site-nav">
          <a href="#music">Music</a>
          <a href="#about">About</a>
          <a href="https://shop.michaelkimsheng.com" target="_blank" rel="noopener noreferrer">Shop</a>
          <a href="#tours">Tours</a>
        </nav>

        {/* ─── MUSIC ─── */}
        <section id="music" className="section">
          <span className="label">Music</span>
          <div className="track">
            <span className="track-title">In a Field of Silence</span>
            <span className="track-detail">Piano & Strings</span>
          </div>
          <div className="divider" />
          <div className="listen-links">
            <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">Spotify</a>
            <span className="sep">/</span>
            <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer">Apple Music</a>
            <span className="sep">/</span>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        <section id="about" className="section section--wide">
          <span className="label">About</span>
          <blockquote className="quote">
            &ldquo;It lifts my heart higher in my chest. Breath comes in a little harder
            for my anticipation, and my ears strain to hear the next note
            as I follow on its path.&rdquo;
          </blockquote>
          <p className="body">
            Michael Kim-Sheng is a composer for film, concert, and immersive
            experiences. His music has been described by listeners as creating
            physical sensations — hearts lifting, tears forming from beauty
            rather than sadness, the feeling of witnessing someone&rsquo;s
            last breath and first awakening in the same moment.
          </p>
          <a href="mailto:contact@michaelkimsheng.com" className="email">contact@michaelkimsheng.com</a>
        </section>

        {/* ─── TOURS ─── */}
        <section id="tours" className="section">
          <span className="label">Live</span>
          <p className="muted">Dates coming soon</p>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="foot">
          <SocialIcons />
          <span className="copy">&copy; {new Date().getFullYear()} Michael Kim-Sheng</span>
        </footer>

        <div className="swipe-hint">swipe for variations</div>
      </div>
    </>
  )
}

function SEO() {
  useEffect(() => {
    document.title = 'Michael Kim-Sheng — Composer'
    const m = {
      description: 'Composer for film, concert, and immersive experiences. Music that creates worlds you inhabit.',
      'og:title': 'Michael Kim-Sheng — Composer',
      'og:description': 'Music that creates worlds you inhabit.',
      'og:type': 'website',
      'og:image': '/hero-bg.jpg',
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Michael Kim-Sheng — Composer',
    }
    for (const [k, v] of Object.entries(m)) {
      const a = k.startsWith('og:') ? 'property' : 'name'
      let el = document.querySelector(`meta[${a}="${k}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(a, k); document.head.appendChild(el) }
      el.setAttribute('content', v)
    }
    let s = document.getElementById('ld-json')
    if (!s) { s = document.createElement('script'); s.id = 'ld-json'; s.type = 'application/ld+json'; document.head.appendChild(s) }
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Person',
      name: 'Michael Kim-Sheng', jobTitle: 'Composer',
      sameAs: ['https://open.spotify.com', 'https://youtube.com', 'https://instagram.com'],
    })
  }, [])
  return null
}
