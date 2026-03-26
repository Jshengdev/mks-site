/**
 * Variation A — "Einaudi"
 * Atmospheric minimal. Full-viewport hero with just the name.
 * Hamburger nav. Almost nothing on the page. The restraint IS the design.
 */
import { useState } from 'react'
import SocialIcons from '../SocialIcons.jsx'

export default function VariationA() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="var-a">
      {/* Hamburger + off-canvas nav */}
      <button
        className="var-a__burger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <span className={`var-a__line ${menuOpen ? 'open' : ''}`} />
        <span className={`var-a__line ${menuOpen ? 'open' : ''}`} />
      </button>

      <nav className={`var-a__nav ${menuOpen ? 'visible' : ''}`}>
        <a href="#songs" onClick={() => setMenuOpen(false)}>Songs</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Shop</a>
        <a href="#tours" onClick={() => setMenuOpen(false)}>Tours</a>
        <SocialIcons className="var-a__nav-social" />
      </nav>

      {/* Hero — name floating in the void */}
      <section className="var-a__hero">
        <h1 className="var-a__name">Michael Kim-Sheng</h1>
        <p className="var-a__role">Composer</p>
      </section>

      {/* Songs */}
      <section id="songs" className="var-a__section">
        <h2 className="var-a__heading">Songs</h2>
        <div className="var-a__songs-list">
          <a className="var-a__song" href="#">
            <span className="var-a__song-title">In a Field of Silence</span>
            <span className="var-a__song-meta">2024</span>
          </a>
          <a className="var-a__song" href="#">
            <span className="var-a__song-title">Coming Soon</span>
            <span className="var-a__song-meta">&mdash;</span>
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="var-a__section">
        <h2 className="var-a__heading">About</h2>
        <p className="var-a__body">
          Michael Kim-Sheng is a composer whose music creates worlds. Each composition
          is a landscape — a place you inhabit, not a sound you hear.
        </p>
        <a href="mailto:contact@michaelkimsheng.com" className="var-a__email">contact@michaelkimsheng.com</a>
      </section>

      {/* Tours */}
      <section id="tours" className="var-a__section">
        <h2 className="var-a__heading">Tours</h2>
        <p className="var-a__coming-soon">Coming Soon</p>
      </section>

      {/* Footer */}
      <footer className="var-a__footer">
        <SocialIcons />
        <span>&copy; {new Date().getFullYear()} Michael Kim-Sheng</span>
      </footer>
    </div>
  )
}
