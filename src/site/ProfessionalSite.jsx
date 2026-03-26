import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { initPostHog, trackVariation } from './posthog.js'
import SocialIcons from './SocialIcons.jsx'
import portrait from '../assets/textures/mks-portrait.jpg'
import './site.css'

/* ── Animation config (taste-skill: spring physics, no linear) ── */
const spring = { type: 'spring', stiffness: 100, damping: 20 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ...spring, duration: 0.8 } },
}
const stagger = { visible: { transition: { staggerChildren: 0.12 } } }

const VARIATIONS = ['atmosphere', 'editorial', 'refined']

export default function ProfessionalSite() {
  const [idx, setIdx] = useState(0)
  const touchX = useRef(null)

  useEffect(() => { initPostHog() }, [])
  useEffect(() => { trackVariation(VARIATIONS[idx]) }, [idx])

  const go = useCallback((i) => setIdx(Math.max(0, Math.min(VARIATIONS.length - 1, i))), [])

  /* Swipe handlers */
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

  const v = VARIATIONS[idx]

  return (
    <>
      <SEO />
      <div
        className={`min-h-[100dvh] bg-void text-text cursor-auto overflow-x-hidden antialiased v-${v}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Film grain overlay — fixed, pointer-events-none per taste-skill perf rule */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '128px' }} />

        {/* Variation dots */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {VARIATIONS.map((name, i) => (
            <button
              key={name}
              onClick={() => go(i)}
              aria-label={`Style ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === idx
                  ? 'bg-text scale-125'
                  : 'bg-text/20 hover:bg-text/40'
              }`}
            />
          ))}
        </div>
        <p className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 font-mono text-[0.55rem] tracking-[0.12em] uppercase text-text/15 pointer-events-none">
          swipe for variations
        </p>

        {/* ─── HERO ─── */}
        <Hero variation={v} />

        {/* ─── NAV ─── */}
        <Nav variation={v} />

        {/* ─── CONTENT ─── */}
        <AnimatePresence mode="wait">
          <motion.div key={v} initial="hidden" animate="visible" variants={stagger}>

            {/* Music */}
            <Section id="music" variation={v}>
              <Label>Music</Label>
              <motion.div variants={fadeUp} className="py-2">
                <span className="font-display text-xl md:text-2xl font-light tracking-wide opacity-85 block">
                  In a Field of Silence
                </span>
                <span className="font-mono text-[0.65rem] tracking-wide text-text-secondary/50 mt-2 block">
                  Piano &amp; Strings
                </span>
              </motion.div>
              <motion.div variants={fadeUp} className="h-px bg-text/[0.06] my-6" />
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                {['Spotify', 'Apple Music', 'YouTube'].map((name, i) => (
                  <span key={name} className="flex items-center gap-3">
                    {i > 0 && <span className="text-text/10 text-xs">/</span>}
                    <motion.a
                      href="#"
                      className="font-body text-sm font-light text-text/45 hover:text-text/90 transition-colors duration-300"
                      whileHover={{ x: 2 }}
                      transition={spring}
                    >
                      {name}
                    </motion.a>
                  </span>
                ))}
              </motion.div>
            </Section>

            {/* About */}
            <Section id="about" variation={v} wide>
              <Label>About</Label>
              <motion.blockquote
                variants={fadeUp}
                className="font-display text-lg md:text-xl font-light italic leading-relaxed text-text/50 mb-8 pl-5 border-l-2 border-teal/30"
              >
                &ldquo;It lifts my heart higher in my chest. Breath comes in a little harder
                for my anticipation, and my ears strain to hear the next note
                as I follow on its path.&rdquo;
              </motion.blockquote>
              <motion.p
                variants={fadeUp}
                className="font-body text-sm font-light leading-[1.8] text-text/50 max-w-[52ch]"
              >
                Michael Kim-Sheng composes for film, concert, and immersive
                experiences. Listeners describe physical sensations — hearts lifting,
                tears forming from beauty rather than sadness, the feeling of
                witnessing someone&rsquo;s last breath and first awakening in
                the same moment.
              </motion.p>
              <motion.a
                variants={fadeUp}
                href="mailto:contact@michaelkimsheng.com"
                className="inline-block mt-6 font-mono text-xs tracking-wide text-text/35 border-b border-text/10 pb-0.5 hover:text-text/80 hover:border-text/30 transition-all duration-300"
              >
                contact@michaelkimsheng.com
              </motion.a>
            </Section>

            {/* Tours */}
            <Section id="tours" variation={v}>
              <Label>Live</Label>
              <motion.p variants={fadeUp} className="font-mono text-xs tracking-widest text-text/15">
                Dates coming soon
              </motion.p>
            </Section>

            {/* Shop */}
            <Section variation={v}>
              <motion.a
                variants={fadeUp}
                href="https://shop.michaelkimsheng.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-sm font-light tracking-[0.08em] uppercase px-8 py-3 border border-text/10 rounded-full text-text/45 hover:text-text/80 hover:border-teal/40 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
              >
                Visit Shop
              </motion.a>
            </Section>

            {/* Footer */}
            <motion.footer
              variants={fadeUp}
              className="flex flex-col items-center gap-6 pt-20 pb-16 border-t border-text/[0.04]"
            >
              <SocialIcons />
              <span className="font-mono text-[0.58rem] tracking-[0.1em] text-text/15">
                &copy; {new Date().getFullYear()} Michael Kim-Sheng
              </span>
            </motion.footer>

          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

/* ── Hero with parallax ────────────────────────────────────── */
function Hero({ variation }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  /* taste-skill: ANTI-CENTER BIAS for VARIANCE 8 → left-aligned for editorial */
  const isEditorial = variation === 'editorial'
  const isAtmosphere = variation === 'atmosphere'

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-end overflow-hidden">
      {/* Parallax portrait */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
        <img
          src={portrait}
          alt="Michael Kim-Sheng"
          loading="eager"
          className={`w-full h-[120%] object-cover object-[center_20%] ${
            isAtmosphere
              ? 'brightness-[0.3] saturate-[0.5]'
              : isEditorial
                ? 'brightness-[0.45] saturate-[0.7] contrast-110'
                : 'brightness-[0.38] saturate-[0.85] sepia-[0.08]'
          }`}
        />
      </motion.div>

      {/* Bottom gradient fade into void */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-void/10 via-transparent to-void/95" />

      {/* Hero text */}
      <motion.div
        className={`relative z-[2] w-full px-6 md:px-12 pb-[12vh] ${
          isEditorial ? 'max-w-4xl' : 'max-w-3xl mx-auto text-center'
        }`}
        style={{ opacity: textOpacity }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.95, y: 0 }}
          transition={{ ...spring, delay: 0.3, duration: 1.2 }}
          className={`font-display font-light leading-[0.95] ${
            isEditorial
              ? 'text-5xl md:text-7xl lg:text-8xl tracking-tight'
              : isAtmosphere
                ? 'text-2xl md:text-3xl tracking-[0.16em] uppercase'
                : 'text-3xl md:text-5xl tracking-[0.04em]'
          }`}
        >
          {isEditorial ? <>Michael<br />Kim-Sheng</> : 'Michael Kim-Sheng'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isAtmosphere ? 0.2 : 0.35 }}
          transition={{ delay: 0.8, duration: 1 }}
          className={`mt-4 md:mt-5 ${
            isEditorial
              ? 'font-mono text-xs tracking-[0.2em]'
              : isAtmosphere
                ? 'font-mono text-[0.6rem] tracking-[0.35em] uppercase'
                : 'font-body text-sm tracking-[0.12em] font-light'
          }`}
        >
          Composer
        </motion.p>
      </motion.div>
    </section>
  )
}

/* ── Nav ──────────────────────────────────────────────────── */
function Nav({ variation }) {
  const isEditorial = variation === 'editorial'
  const isRefined = variation === 'refined'

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className={`flex gap-8 md:gap-10 py-6 px-6 md:px-12 border-b border-text/[0.06] ${
        isEditorial ? 'justify-start' : 'justify-center'
      } ${isRefined ? 'sticky top-0 z-30 bg-void/70 backdrop-blur-xl' : ''}`}
    >
      {['Music', 'About', 'Shop', 'Tours'].map((item) => (
        <motion.a
          key={item}
          href={item === 'Shop' ? 'https://shop.michaelkimsheng.com' : `#${item.toLowerCase()}`}
          target={item === 'Shop' ? '_blank' : undefined}
          rel={item === 'Shop' ? 'noopener noreferrer' : undefined}
          className="font-body text-xs md:text-sm font-light tracking-[0.1em] uppercase text-text/40 hover:text-text/90 transition-colors duration-300"
          whileHover={{ y: -1 }}
          transition={spring}
        >
          {item}
        </motion.a>
      ))}
    </motion.nav>
  )
}

/* ── Section wrapper ─────────────────────────────────────── */
function Section({ id, variation, wide, children }) {
  const isEditorial = variation === 'editorial'
  return (
    <motion.section
      id={id}
      variants={fadeUp}
      className={`px-6 md:px-12 py-16 md:py-24 border-b border-text/[0.04] ${
        wide ? 'max-w-2xl' : 'max-w-xl'
      } ${isEditorial ? 'ml-6 md:ml-12' : 'mx-auto'}`}
    >
      {children}
    </motion.section>
  )
}

/* ── Mono label ──────────────────────────────────────────── */
function Label({ children }) {
  return (
    <motion.span
      variants={fadeUp}
      className="block font-mono text-[0.6rem] font-normal tracking-[0.18em] uppercase text-text/20 mb-8"
    >
      {children}
    </motion.span>
  )
}

/* ── SEO ─────────────────────────────────────────────────── */
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
