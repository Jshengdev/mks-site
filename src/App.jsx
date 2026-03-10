import { useState } from 'react'
import './App.css'
import MoonlightCursor from './MoonlightCursor'
import MiniPlayer from './MiniPlayer'
import FlowerVisual from './FlowerVisual'
import LandingSection from './LandingSection.jsx'
import Overlays from './Overlays.jsx'

function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      <a href="#" onClick={(e) => { e.preventDefault(); setPage('home') }} className="nav-logo">
        <img src="/mks-logo.svg" alt="MKS" className="nav-logo-img" />
      </a>
      <ul className="nav-links">
        <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('home') }} className={page === 'home' ? 'active' : ''}>Home</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('contact') }} className={page === 'contact' ? 'active' : ''}>Contact</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('tour') }} className={page === 'tour' ? 'active' : ''}>Tour</a></li>
      </ul>
    </nav>
  )
}

function SocialIcons() {
  return (
    <div className="social-icons">
      <a href="https://www.instagram.com/michaelkimsheng/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
      </a>
      <a href="https://www.facebook.com/mkimsheng/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
      </a>
      <a href="https://www.tiktok.com/@michael.kimsheng" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
        <svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
      </a>
      <a href="https://www.youtube.com/channel/UCwLZb8U3HTK_JUlCSPhwj0Q" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
      </a>
      <a href="https://open.spotify.com/artist/0agioWluEClo8cE4fzJvsd" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
        <svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
      </a>
    </div>
  )
}

function HomePage() {
  return (
    <div className="hero-content">
      <h1 className="hero-title">Michael Kim-Sheng</h1>
      <p className="hero-subtitle">a composer between musical worlds</p>
      <SocialIcons />
    </div>
  )
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiry: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, construct a mailto link
    const subject = encodeURIComponent(`${formData.inquiry || 'Inquiry'} — ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry: ${formData.inquiry}\n\n${formData.message}`
    )
    window.location.href = `mailto:contact@michaelkimsheng.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="contact-page">
      <div className="contact-layout">
        {/* Left side — info */}
        <div className="contact-info glass-card">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-desc">
            For commissions, collaborations, press inquiries, or booking —
            I'd love to hear from you.
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-detail-label">General Inquiries</span>
              <a href="mailto:contact@michaelkimsheng.com" className="contact-detail-value">
                contact@michaelkimsheng.com
              </a>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-label">Management</span>
              <a href="mailto:mgmt@michaelkimsheng.com" className="contact-detail-value">
                mgmt@michaelkimsheng.com
              </a>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-label">Press</span>
              <a href="mailto:press@michaelkimsheng.com" className="contact-detail-value">
                press@michaelkimsheng.com
              </a>
            </div>
          </div>

          <SocialIcons />
        </div>

        {/* Right side — form */}
        <div className="contact-form-wrap glass-card">
          {sent ? (
            <div className="contact-sent">
              <div className="contact-sent-icon">&#10003;</div>
              <h2>Message prepared</h2>
              <p>Your email client should have opened. If not, feel free to email directly.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="inquiry">Inquiry Type</label>
                <select
                  id="inquiry"
                  name="inquiry"
                  required
                  value={formData.inquiry}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select one...</option>
                  <option value="Commission">Commission</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Booking">Booking / Live Performance</option>
                  <option value="Press">Press / Interview</option>
                  <option value="Licensing">Licensing / Sync</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>

              <button type="submit" className="form-submit">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('home')

  return (
    <div className={`hero page-${page}`}>
      {page !== 'home' && <FlowerVisual />}
      <MiniPlayer />
      {page !== 'home' && (
        <div className="hero-bg">
          <img src="/hero-bg.jpg" alt="Michael Kim-Sheng at the piano" />
        </div>
      )}

      {page !== 'home' && <Nav page={page} setPage={setPage} />}

      <div className="page-wrapper" key={page}>
        {page === 'home' && <LandingSection />}
        {page === 'contact' && <ContactPage />}
        {page === 'tour' && <HomePage />}
      </div>
      <Overlays />
      <MoonlightCursor />
    </div>
  )
}

export default App
