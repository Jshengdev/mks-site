import { useState } from 'react'
import { motion } from 'framer-motion'
import './site.css'

const ease = [0.32, 0.72, 0, 1]
const spring = { type: 'spring', stiffness: 80, damping: 18 }

const text = {
  en: {
    title: 'Contact',
    subtitle: 'For inquiries regarding sponsorship, contribution, or collaboration.',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send',
    back: 'Back',
    thanks: 'Thank you for your message.',
  },
  es: {
    title: 'Contacto',
    subtitle: 'Para consultas sobre patrocinio, contribuci\u00f3n o colaboraci\u00f3n.',
    name: 'Nombre',
    email: 'Correo electr\u00f3nico',
    subject: 'Asunto',
    message: 'Mensaje',
    send: 'Enviar',
    back: 'Volver',
    thanks: 'Gracias por tu mensaje.',
  },
}

const inputClass = 'w-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] rounded-lg px-4 py-3 font-body text-sm font-light text-text/80 outline-none focus:border-teal/30 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-text/10'

export default function ContactPage({ lang = 'en', onBack }) {
  const t = text[lang]
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0ASubject: ${form.subject}%0D%0A%0D%0A${form.message}`
    window.open(`mailto:mgmt@mynovaproduction.com?subject=${encodeURIComponent(form.subject)}&body=${body}`, '_self')
    setSent(true)
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="min-h-[100dvh] bg-void text-text antialiased cursor-auto flex flex-col items-center justify-center relative px-6 py-16 selection:bg-teal/20">

      {/* Back button — frosted glass pill */}
      <div className="fixed top-4 left-4 z-30">
        <motion.button onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] font-body text-[11px] font-light tracking-[0.08em] uppercase text-text/40 hover:text-text/80 hover:bg-white/[0.07] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          whileHover={{ x: -2 }} transition={spring}
        >
          &larr; {t.back}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-md"
      >
        <h1 className="font-display text-2xl md:text-3xl font-light tracking-[0.08em] text-center mb-4">
          {t.title}
        </h1>
        <p className="font-body text-[13px] font-light text-text/35 text-center mb-12 max-w-sm mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        {sent ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="font-body text-sm text-center text-text/50"
          >
            {t.thanks}
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {[
              { key: 'name', label: t.name, type: 'text' },
              { key: 'email', label: t.email, type: 'email' },
              { key: 'subject', label: t.subject, type: 'text' },
            ].map(({ key, label, type }) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="font-body text-[10px] font-light tracking-[0.12em] uppercase text-text/25">
                  {label}
                </label>
                <input type={type} required value={form[key]} onChange={set(key)} className={inputClass} />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <label className="font-body text-[10px] font-light tracking-[0.12em] uppercase text-text/25">
                {t.message}
              </label>
              <textarea required rows={5} value={form.message} onChange={set('message')}
                className={`${inputClass} resize-none`}
              />
            </div>
            <motion.button
              type="submit"
              className="mt-4 py-3 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] font-body text-[13px] font-light tracking-[0.08em] uppercase text-text/50 hover:text-text/80 hover:bg-white/[0.08] hover:border-teal/25 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
            >
              {t.send}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
