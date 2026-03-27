import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import pianoBg from '/hero-bg.jpg'
import './site.css'

const ease = [0.32, 0.72, 0, 1]
const spring = { type: 'spring', stiffness: 80, damping: 18 }

const text = {
  en: {
    title: 'Contact',
    subtitle: 'For inquiries regarding sponsorship, contribution, or collaboration.',
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    phoneHint: 'optional',
    type: 'Inquiry Type',
    types: ['Sponsorship', 'Collaboration', 'Licensing / Sync', 'Press / Media', 'Performance Booking', 'General Inquiry'],
    subject: 'Subject',
    message: 'Message',
    messageHint: 'Please describe your inquiry in detail.',
    send: 'Submit Request',
    back: 'Back',
    sending: 'Sending...',
    thanks: 'Your request has been submitted.',
    thanksDetail: 'We typically respond within 2\u20133 business days.',
    ref: 'Reference',
  },
  es: {
    title: 'Contacto',
    subtitle: 'Para consultas sobre patrocinio, contribuci\u00f3n o colaboraci\u00f3n.',
    name: 'Nombre completo',
    email: 'Correo electr\u00f3nico',
    phone: 'Tel\u00e9fono',
    phoneHint: 'opcional',
    type: 'Tipo de consulta',
    types: ['Patrocinio', 'Colaboraci\u00f3n', 'Licencia / Sync', 'Prensa / Medios', 'Reserva de presentaci\u00f3n', 'Consulta general'],
    subject: 'Asunto',
    message: 'Mensaje',
    messageHint: 'Describa su consulta en detalle.',
    send: 'Enviar solicitud',
    back: 'Volver',
    sending: 'Enviando...',
    thanks: 'Su solicitud ha sido enviada.',
    thanksDetail: 'Normalmente respondemos en 2\u20133 d\u00edas h\u00e1biles.',
    ref: 'Referencia',
  },
}

const inputClass = 'w-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] rounded-lg px-5 py-3.5 font-body text-[15px] font-light text-white/90 outline-none focus:border-teal/40 focus:bg-white/[0.08] transition-all duration-300 placeholder:text-text/20'
const selectClass = 'w-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] rounded-lg px-5 py-3.5 font-body text-[15px] font-light text-white/90 outline-none focus:border-teal/40 focus:bg-white/[0.08] transition-all duration-300 appearance-none cursor-pointer'

function generateRef() {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const id = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `MKS-${y}${m}${d}-${id}`
}

export default function ContactPage({ lang = 'en', onBack }) {
  const t = text[lang]
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [ref, setRef] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ticketRef = generateRef()
    setRef(ticketRef)
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          type: form.type || t.types[5],
          subject: form.subject,
          message: form.message,
          ref: ticketRef,
          lang,
        }),
      })

      if (!res.ok) throw new Error('Send failed')
      setStatus('sent')
    } catch {
      // Fallback to mailto if API fails
      const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0ASubject: ${form.subject}%0D%0A%0D%0A${form.message}`
      window.location.href = `mailto:mgmt@mynovaproduction.com?subject=${encodeURIComponent(`[${ticketRef}] ${form.subject}`)}&body=${body}`
      setStatus('sent')
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="min-h-[100dvh] bg-void text-text antialiased cursor-auto flex flex-col md:flex-row relative selection:bg-teal/20 overflow-hidden">

      {/* Left: form side */}
      <div className="relative z-10 flex-1 flex flex-col justify-center" style={{ padding: '5rem 6rem 5rem 6rem' }}>

      {/* Back button */}
      <div className="fixed top-6 left-6 md:top-10 md:left-12 z-30">
        <motion.button onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] font-body text-[13px] font-light tracking-[0.06em] uppercase text-text/60 hover:text-white hover:bg-white/[0.1] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          whileHover={{ x: -2 }} transition={spring}
        >
          &larr; {t.back}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-center max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center mx-auto mb-6">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal">
                <path d="M4 10l4 4 8-8" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-light tracking-wide mb-3">{t.thanks}</h2>
            <p className="font-body text-[13px] font-light text-text/40 mb-6">{t.thanksDetail}</p>
            <p className="font-body text-[11px] font-light text-text/20 tracking-wide">
              {t.ref}: <span className="text-text/40 font-mono">{ref}</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease }}
            className="w-full max-w-md relative z-10"
          >
            <h1 className="font-display text-3xl md:text-4xl font-light tracking-[0.08em] mb-5 text-white">
              {t.title}
            </h1>
            <p className="font-body text-[15px] font-light text-text/55 mb-12 max-w-sm leading-relaxed">
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <Field label={t.name}>
                <input type="text" required value={form.name} onChange={set('name')} className={inputClass} />
              </Field>

              {/* Email */}
              <Field label={t.email}>
                <input type="email" required value={form.email} onChange={set('email')} className={inputClass} />
              </Field>

              {/* Phone (optional) */}
              <Field label={t.phone} hint={t.phoneHint}>
                <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} />
              </Field>

              {/* Inquiry type */}
              <Field label={t.type}>
                <div className="relative">
                  <select required value={form.type} onChange={set('type')} className={selectClass}>
                    <option value="" disabled></option>
                    {t.types.map((type) => (
                      <option key={type} value={type} className="bg-[#1a1a1a] text-text">{type}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text/25" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 4.5l3 3 3-3" />
                  </svg>
                </div>
              </Field>

              {/* Subject */}
              <Field label={t.subject}>
                <input type="text" required value={form.subject} onChange={set('subject')} className={inputClass} />
              </Field>

              {/* Message */}
              <Field label={t.message} hint={t.messageHint}>
                <textarea required rows={5} value={form.message} onChange={set('message')}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                className="mt-4 py-3.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] font-body text-[13px] font-light tracking-[0.08em] uppercase text-text/50 hover:text-text/80 hover:bg-white/[0.08] hover:border-teal/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                whileHover={status !== 'sending' ? { scale: 1.01 } : {}}
                whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
                transition={spring}
              >
                {status === 'sending' ? t.sending : t.send}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Right: piano photo */}
      <div className="hidden md:block md:w-[45%] relative">
        <img src={pianoBg} alt="Michael Kim-Sheng at the piano" loading="eager"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6] saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/60 to-transparent" />
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="font-body text-[12px] font-light tracking-[0.1em] uppercase text-text/50">
          {label}
        </label>
        {hint && (
          <span className="font-body text-[9px] font-light text-text/15 italic normal-case tracking-normal">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
