import { useEffect } from 'react'
import { motion } from 'framer-motion'
import SocialIcons from './SocialIcons.jsx'
import portrait from '../assets/textures/mks-portrait.jpg'
import './site.css'

const ease = [0.32, 0.72, 0, 1]

export default function ProfessionalSite() {
  useEffect(() => {
    document.title = 'Michael Kim-Sheng \u2014 Composer'
    setMeta('description', 'Composer for film, concert, and immersive experiences.')
    setMeta('og:title', 'Michael Kim-Sheng \u2014 Composer')
    setMeta('og:type', 'website')
    setMeta('og:image', '/hero-bg.jpg')
    setMeta('twitter:card', 'summary_large_image')
  }, [])

  return (
    <div className="min-h-[100dvh] bg-void text-text antialiased cursor-auto flex flex-col items-center justify-center relative overflow-hidden selection:bg-teal/20">

      {/* Grain */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'g\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23g)\'/%3E%3C/svg%3E")', backgroundSize: '100px' }}
      />

      {/* Portrait bg — dimmed, covers viewport */}
      <div className="absolute inset-0">
        <img
          src={portrait}
          alt=""
          loading="eager"
          className="w-full h-full object-cover object-[center_18%] brightness-[0.22] saturate-50"
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.6) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 0.95, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease }}
          className="font-display text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-[0.15em] uppercase leading-tight"
        >
          Michael Kim-Sheng
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 0.7, duration: 1, ease }}
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
        >
          Composer
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease }}
          className="h-px w-12 bg-text/10 my-2"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2, duration: 1, ease }}
          className="font-body text-sm font-light tracking-[0.06em]"
        >
          Site under construction
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease }}
        >
          <SocialIcons size={20} />
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
