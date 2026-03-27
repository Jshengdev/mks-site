import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  },
  es: {
    desc: 'un compositor entre mundos musicales',
    construction: 'Sitio en construcci\u00f3n',
    contact: 'Contacto',
    shop: 'Tienda',
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
    <div className="min-h-[100dvh] bg-void text-text antialiased cursor-auto flex flex-col items-center justify-center relative overflow-hidden selection:bg-teal/20">

      {/* Grain */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
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

      {/* Top right nav — frosted glass pill */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease }}
        className="fixed top-4 right-4 z-30 flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <motion.a
          href="https://store.michaelkimsheng.com"
          target="_blank" rel="noopener noreferrer"
          className="font-body text-[11px] font-light tracking-[0.08em] uppercase text-text/40 hover:text-text/80 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          whileHover={{ y: -1 }} transition={spring}
        >
          {t.shop}
        </motion.a>
        <span className="w-px h-3 bg-text/[0.08]" />
        <motion.button
          onClick={() => setPage('contact')}
          className="font-body text-[11px] font-light tracking-[0.08em] uppercase text-text/40 hover:text-text/80 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          whileHover={{ y: -1 }} transition={spring}
        >
          {t.contact}
        </motion.button>
        <span className="w-px h-3 bg-text/[0.08]" />
        <div className="flex items-center gap-0.5">
          <button onClick={() => setLang('en')}
            className={`font-body text-[10px] font-light tracking-[0.06em] uppercase px-1.5 py-0.5 rounded-full transition-all duration-300 ${lang === 'en' ? 'text-text/80 bg-white/[0.06]' : 'text-text/25 hover:text-text/50'}`}
          >EN</button>
          <button onClick={() => setLang('es')}
            className={`font-body text-[10px] font-light tracking-[0.06em] uppercase px-1.5 py-0.5 rounded-full transition-all duration-300 ${lang === 'es' ? 'text-text/80 bg-white/[0.06]' : 'text-text/25 hover:text-text/50'}`}
          >ES</button>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">

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
          className="font-body text-[13px] font-light tracking-[0.04em]"
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
          className="font-body text-[10px] font-light tracking-[0.12em] uppercase"
        >
          {t.construction}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease }}
        >
          <SocialIcons size={20} lang={lang} />
        </motion.div>

      </div>
    </div>
  )
}

function setMeta(key, value) {
  const attr = key.startsWith('og:') || key.startsWith('twitter:') ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}
