import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

const inputClass = 'w-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] rounded-lg px-4 py-3 font-body text-sm font-light text-text/80 outline-none focus:border-teal/30 focus:bg-white/[0.05] transition-all duration-300 placeholder:text-text/15'
const selectClass = 'w-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] rounded-lg px-4 py-3 font-body text-sm font-light text-text/80 outline-none focus:border-teal/30 focus:bg-white/[0.05] transition-all duration-300 appearance-none cursor-pointer'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const ticketRef = generateRef()
    setRef(ticketRef)
    setStatus('sending')

    const inquiryType = form.type || t.types[5]
    const phoneLine = form.phone ? `Phone: ${form.phone}` : ''
    const emailBody = [
      `--- Inquiry ${ticketRef} ---`,
      '',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      phoneLine,
      `Type: ${inquiryType}`,
      `Subject: ${form.subject}`,
      '',
      '--- Message ---',
      '',
      form.message,
      '',
      '---',
      `Ref: ${ticketRef}`,
      `Submitted: ${new Date().toISOString()}`,
      `Language: ${lang.toUpperCase()}`,
    ].filter(Boolean).join('%0D%0A')

    const mailSubject = `[${ticketRef}] ${inquiryType} — ${form.subject}`

    setTimeout(() => {
      window.location.href = `mailto:mgmt@mynovaproduction.com?subject=${encodeURIComponent(mailSubject)}&body=${emailBody}`
      setStatus('sent')
    }, 600)
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="min-h-[100dvh] bg-void text-text antialiased cursor-auto flex flex-col items-center justify-center relative px-6 py-20 selection:bg-teal/20">

      {/* Back button */}
      <div className="fixed top-4 left-4 z-30">
        <motion.button onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] font-body text-[11px] font-light tracking-[0.08em] uppercase text-text/40 hover:text-text/80 hover:bg-white/[0.07] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
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
            className="w-full max-w-md"
          >
            <h1 className="font-display text-2xl md:text-3xl font-light tracking-[0.08em] text-center mb-4">
              {t.title}
            </h1>
            <p className="font-body text-[13px] font-light text-text/35 text-center mb-10 max-w-sm mx-auto leading-relaxed">
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
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="font-body text-[10px] font-light tracking-[0.12em] uppercase text-text/25">
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
