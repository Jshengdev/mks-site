import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { initPostHog, trackVariation } from './posthog.js'
import SocialIcons from './SocialIcons.jsx'
import portrait from '../assets/textures/mks-portrait.jpg'
import './site.css'

/* ── Motion tokens — spring physics, custom cubic-bezier, no linear ── */
const spring = { type: 'spring', stiffness: 80, damping: 18 }
const ease = [0.32, 0.72, 0, 1]

const VARS = ['atmosphere', 'editorial', 'refined']

export default function ProfessionalSite() {
  const [idx, setIdx] = useState(0)
  const touchX = useRef(null)
  const v = VARS[idx]

  useEffect(() => { initPostHog() }, [])
  useEffect(() => { trackVariation(v) }, [v])

  const go = useCallback((i) => setIdx(Math.max(0, Math.min(VARS.length - 1, i))), [])
  const onTouchStart = useCallback((e) => { touchX.current = e.touches[0].clientX }, [])
  const onTouchEnd = useCallback((e) => {
    if (touchX.current === null) return
    const d = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(d) > 50) go(idx + (d > 0 ? 1 : -1))
    touchX.current = null
  }, [idx, go])
  useEffect(() => {
    const h = (e) => { if (e.key === 'ArrowLeft') go(idx - 1); if (e.key === 'ArrowRight') go(idx + 1) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [idx, go])

  return (
    <>
      <SEO />
      <div
        className="min-h-[100dvh] bg-void text-text antialiased cursor-auto overflow-x-hidden selection:bg-teal/20"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Grain overlay — fixed, pointer-events-none (soft-skill 6: perf guardrail) */}
        <div
          className="fixed inset-0 z-50 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'g\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23g)\'/%3E%3C/svg%3E")', backgroundSize: '100px' }}
        />

        {/* Variation dots */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2.5" aria-label="Design variations">
          {VARS.map((name, i) => (
            <button key={name} onClick={() => go(i)} aria-label={`Variation ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${i === idx ? 'bg-text/70 scale-[1.4]' : 'bg-text/15 hover:bg-text/30'}`}
            />
          ))}
        </nav>
        <p className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 font-mono text-[9px] tracking-[0.15em] uppercase text-text/10 pointer-events-none select-none">
          swipe
        </p>

        {/* ━━━ HERO ━━━ */}
        <Hero v={v} />

        {/* ━━━ CONTENT ━━━ */}
        <div className="relative z-10">

          {/* Nav — centered, generous, no sticky edge-glue (soft-skill ban) */}
          <FadeIn>
            <nav className="flex justify-center gap-8 md:gap-12 py-8 md:py-10 border-b border-text/[0.05]">
              {[
                { label: 'Music', href: '#music' },
                { label: 'About', href: '#about' },
                { label: 'Shop', href: 'https://shop.michaelkimsheng.com', ext: true },
                { label: 'Tours', href: '#tours' },
              ].map(({ label, href, ext }) => (
                <motion.a key={label} href={href}
                  target={ext ? '_blank' : undefined} rel={ext ? 'noopener noreferrer' : undefined}
                  className="font-body text-[13px] font-light tracking-[0.12em] uppercase text-text/35 hover:text-text/80 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={spring}
                >
                  {label}
                </motion.a>
              ))}
            </nav>
          </FadeIn>

          {/* ── Music ── */}
          <ContentSection id="music">
            <Eyebrow>Music</Eyebrow>
            <h3 className="font-display text-2xl md:text-3xl font-light tracking-wide opacity-90">
              In a Field of Silence
            </h3>
            <p className="font-mono text-[11px] tracking-[0.06em] text-text-secondary/40 mt-3">
              Piano &amp; Strings
            </p>
            <div className="h-px bg-text/[0.05] my-8" />
            <div className="flex items-center justify-center gap-4">
              {['Spotify', 'Apple Music', 'YouTube'].map((name, i) => (
                <span key={name} className="flex items-center gap-4">
                  {i > 0 && <span className="text-text/8 text-[10px]">/</span>}
                  <motion.a href="#"
                    className="font-body text-[13px] font-light text-text/35 hover:text-text/80 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    whileHover={{ y: -1 }} transition={spring}
                  >{name}</motion.a>
                </span>
              ))}
            </div>
          </ContentSection>

          {/* ── About ── */}
          <ContentSection id="about" wide>
            <Eyebrow>About</Eyebrow>
            <blockquote className="font-display text-[1.15rem] md:text-xl font-light italic leading-[1.75] text-text/45 text-center max-w-lg mx-auto mb-10">
              &ldquo;It lifts my heart higher in my chest. Breath comes in a little harder
              for my anticipation, and my ears strain to hear the next note
              as I follow on its path.&rdquo;
            </blockquote>
            <p className="font-body text-[14px] font-light leading-[1.85] text-text/45 max-w-md mx-auto text-center">
              Michael Kim-Sheng composes for film, concert, and immersive
              experiences. Listeners describe physical sensations — hearts lifting,
              tears forming from beauty rather than sadness, the feeling of
              witnessing someone&rsquo;s last breath and first awakening in the same moment.
            </p>
            <div className="flex justify-center mt-8">
              <motion.a href="mailto:contact@michaelkimsheng.com"
                className="font-mono text-[11px] tracking-[0.05em] text-text/30 border-b border-text/10 pb-1 hover:text-text/70 hover:border-text/25 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                whileHover={{ y: -1 }} transition={spring}
              >
                contact@michaelkimsheng.com
              </motion.a>
            </div>
          </ContentSection>

          {/* ── Tours ── */}
          <ContentSection id="tours">
            <Eyebrow>Live</Eyebrow>
            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-text/12 text-center">
              Dates coming soon
            </p>
          </ContentSection>

          {/* ── Shop CTA ── */}
          <ContentSection>
            <div className="flex justify-center">
              {/* soft-skill: Button-in-Button with trailing arrow */}
              <motion.a href="https://shop.michaelkimsheng.com" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-body text-[13px] font-light tracking-[0.08em] uppercase text-text/40 pl-7 pr-2 py-2.5 border border-text/8 rounded-full hover:border-teal/30 hover:text-text/70 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}
              >
                Shop
                <span className="w-7 h-7 rounded-full bg-text/[0.04] flex items-center justify-center group-hover:bg-text/[0.08] group-hover:translate-x-0.5 group-hover:-translate-y-px transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-80">
                    <path d="M2 10L10 2M10 2H4M10 2v6" />
                  </svg>
                </span>
              </motion.a>
            </div>
          </ContentSection>

          {/* ── Footer ── */}
          <FadeIn>
            <footer className="flex flex-col items-center gap-7 pt-24 pb-20">
              <SocialIcons />
              <span className="font-mono text-[9px] tracking-[0.15em] text-text/12">
                &copy; {new Date().getFullYear()} Michael Kim-Sheng
              </span>
            </footer>
          </FadeIn>
        </div>
      </div>
    </>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO — Full viewport, portrait, centered name, parallax
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Hero({ v }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const textOp = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -30])

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Parallax portrait */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img src={portrait} alt="Michael Kim-Sheng" loading="eager"
          className={`w-full h-[130%] object-cover object-[center_18%] transition-[filter] duration-1000 ${
            v === 'atmosphere' ? 'brightness-[0.28] saturate-50'
            : v === 'editorial' ? 'brightness-[0.42] saturate-75 contrast-110'
            : 'brightness-[0.35] saturate-[0.85] sepia-[0.06]'
          }`}
        />
      </motion.div>

      {/* Gradient fade to void */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-void/15 via-transparent via-55% to-void" />

      {/* Vignette */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.5) 100%)' }} />

      {/* Name — always centered */}
      <motion.div className="relative z-[2] text-center px-6" style={{ opacity: textOp, y: textY }}>
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 0.95, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease }}
          className={`font-display font-light leading-tight ${
            v === 'atmosphere'
              ? 'text-[clamp(1.4rem,3.5vw,2.2rem)] tracking-[0.2em] uppercase'
              : v === 'editorial'
                ? 'text-[clamp(2.5rem,6vw,4.5rem)] tracking-[0.02em]'
                : 'text-[clamp(2rem,5vw,3.5rem)] tracking-[0.06em]'
          }`}
        >
          Michael Kim-Sheng
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1, ease }}
          className={`mt-5 font-mono tracking-[0.25em] uppercase ${
            v === 'atmosphere' ? 'text-[9px] text-text/20' : 'text-[10px] text-text/30'
          }`}
        >
          Composer
        </motion.p>
      </motion.div>
    </section>
  )
}

/* ━━━ Shared components ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ContentSection({ id, wide, children }) {
  return (
    <FadeIn>
      <section id={id}
        className={`${wide ? 'max-w-xl' : 'max-w-md'} mx-auto px-6 md:px-8 py-16 md:py-28 text-center border-b border-text/[0.03]`}
      >
        {children}
      </section>
    </FadeIn>
  )
}

/* soft-skill 4C: Eyebrow tags — microscopic pill badge */
function Eyebrow({ children }) {
  return (
    <span className="inline-block font-mono text-[9px] font-normal tracking-[0.2em] uppercase text-text/20 border border-text/[0.06] rounded-full px-4 py-1.5 mb-8">
      {children}
    </span>
  )
}

/* soft-skill 5C: Scroll entry — fade-up + blur, 800ms+, whileInView */
function FadeIn({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ━━━ SEO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SEO() {
  useEffect(() => {
    document.title = 'Michael Kim-Sheng \u2014 Composer'
    const m = {
      description: 'Composer for film, concert, and immersive experiences. Music that creates worlds you inhabit.',
      'og:title': 'Michael Kim-Sheng \u2014 Composer',
      'og:description': 'Music that creates worlds you inhabit.',
      'og:type': 'website', 'og:image': '/hero-bg.jpg',
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Michael Kim-Sheng \u2014 Composer',
    }
    for (const [k, val] of Object.entries(m)) {
      const a = k.startsWith('og:') ? 'property' : 'name'
      let el = document.querySelector(`meta[${a}="${k}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(a, k); document.head.appendChild(el) }
      el.setAttribute('content', val)
    }
    let s = document.getElementById('ld-json')
    if (!s) { s = document.createElement('script'); s.id = 'ld-json'; s.type = 'application/ld+json'; document.head.appendChild(s) }
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Michael Kim-Sheng', jobTitle: 'Composer', sameAs: ['https://open.spotify.com','https://youtube.com','https://instagram.com'] })
  }, [])
  return null
}
