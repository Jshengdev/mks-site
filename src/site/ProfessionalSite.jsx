import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SocialIcons from './SocialIcons.jsx'
import ContactPage from './ContactPage.jsx'
import portrait from '../assets/textures/mks-portrait.jpg'
import './site.css'

const ease = [0.32, 0.72, 0, 1]
const spring = { type: 'spring', stiffness: 80, damping: 18 }

const copy = {
  en: {
    desc: 'a composer between musical worlds',
    construction: 'Site under construction',
    contact: 'Contact',
    shop: 'Shop',
    shopUrl: 'https://store.michaelkimsheng.com',
  },
  es: {
    desc: 'un compositor entre mundos musicales',
    construction: 'Sitio en construcci\u00f3n',
    contact: 'Contacto',
    shop: 'Tienda',
    shopUrl: 'https://store.michaelkimsheng.com/es',
  },
}

export default function ProfessionalSite() {
  const [lang, setLang] = useState('en')
  const [page, setPage] = useState('home')
  const t = copy[lang]

  useEffect(() => {
    document.title = 'Michael Kim-Sheng \u2014 Composer'
    setMeta('description', 'Composer between musical worlds. Film, concert, and immersive experiences.')
    setMeta('og:title', 'Michael Kim-Sheng \u2014 Composer')
    setMeta('og:type', 'website')
    setMeta('og:image', '/hero-bg.jpg')
    setMeta('twitter:card', 'summary_large_image')
  }, [])

  if (page === 'contact') {
    return <ContactPage lang={lang} onBack={() => setPage('home')} />
  }

  return (
    <div className="h-[100dvh] bg-void text-text antialiased cursor-auto flex flex-col relative overflow-hidden selection:bg-teal/20">

      {/* Grain */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'g\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23g)\'/%3E%3C/svg%3E")', backgroundSize: '100px' }}
      />

      {/* Portrait bg */}
      <div className="absolute inset-0">
        <img src={portrait} alt="" loading="eager"
          className="w-full h-full object-cover object-[center_18%] brightness-[0.5] saturate-[0.7]"
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.6) 100%)' }} />

      {/* ── TOP RIGHT: Shop, Contact, EN/ES ── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease }}
        className="fixed top-5 right-5 md:top-6 md:right-8 z-30 flex items-center gap-3"
      >
        <GlassButton href={t.shopUrl} external>{t.shop}</GlassButton>
        <GlassButton onClick={() => setPage('contact')}>{t.contact}</GlassButton>
        <LangToggle lang={lang} setLang={setLang} />
      </motion.nav>

      {/* ── CENTER CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">

        <motion.h1
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 0.95, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease }}
          className="font-display text-[clamp(2.2rem,6vw,4rem)] font-light tracking-[0.15em] uppercase leading-tight text-white"
        >
          Michael Kim-Sheng
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.6, duration: 1, ease }}
          className="font-body text-[13px] md:text-[15px] font-light tracking-[0.04em]"
        >
          {t.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease }}
          className="h-px w-10 bg-text/10"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.1, duration: 1, ease }}
          className="font-body text-[11px] font-light tracking-[0.12em] uppercase"
        >
          {t.construction}
        </motion.p>
      </div>

      {/* ── BOTTOM: SOCIALS (mobile only — desktop shows in header) ── */}
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease }}
        className="relative z-10 flex justify-center pb-8 pt-4 md:pb-10"
      >
        <SocialIcons size={20} lang={lang} />
      </motion.footer>
    </div>
  )
}

/* ── Glass button ── */
function GlassButton({ children, onClick, href, external }) {
  const cls = "font-body text-[13px] md:text-[14px] font-light tracking-[0.08em] uppercase px-6 py-2.5 md:px-7 md:py-3 rounded-full bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.05),0_2px_12px_rgba(0,0,0,0.2)] text-text/60 hover:text-white hover:bg-white/[0.12] hover:border-white/[0.18] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
  const anim = { whileHover: { y: -1, scale: 1.02 }, whileTap: { scale: 0.97 }, transition: spring }
  if (href) return <motion.a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cls} {...anim}>{children}</motion.a>
  return <motion.button onClick={onClick} className={cls} {...anim}>{children}</motion.button>
}

/* ── Language toggle — sliding pill indicator ── */
function LangToggle({ lang, setLang }) {
  return (
    <div className="relative flex items-center bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.2)] rounded-full p-1">
      {/* Sliding glass indicator */}
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-full bg-white/[0.15] border border-white/[0.15] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_4px_rgba(0,0,0,0.15)]"
        animate={{ left: lang === 'en' ? 4 : 'calc(50% + 0px)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      <button
        onClick={() => setLang('en')}
        className={`relative z-10 font-body text-[11px] font-light tracking-[0.06em] uppercase px-4 py-1.5 rounded-full transition-colors duration-300 ${lang === 'en' ? 'text-white' : 'text-text/30 hover:text-text/50'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`relative z-10 font-body text-[11px] font-light tracking-[0.06em] uppercase px-4 py-1.5 rounded-full transition-colors duration-300 ${lang === 'es' ? 'text-white' : 'text-text/30 hover:text-text/50'}`}
      >
        ES
      </button>
    </div>
  )
}

function setMeta(key, value) {
  const attr = key.startsWith('og:') || key.startsWith('twitter:') ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}
g-[0.06em] uppercase px-4 py-1.5 rounded-full transition-colors duration-300 ${lang === 'en' ? 'text-white' : 'text-text/30 hover:text-text/50'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`relative z-10 font-body text-[11px] font-light tracking-[0.06em] uppercase px-4 py-1.5 rounded-full transition-colors duration-300 ${lang === 'es' ? 'text-white' : 'text-text/30 hover:text-text/50'}`}
      >
        ES
      </button>
    </div>
  )
}

function setMeta(key, value) {
  const attr = key.startsWith('og:') || key.startsWith('twitter:') ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}
e('content', value)
}
