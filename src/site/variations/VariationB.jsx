/**
 * Variation B — "Editorial"
 * Tri-column header. Typography-driven. Monospace metadata accents.
 * Gaga-influenced: dark, confident, font-hierarchy through family not weight.
 */
import SocialIcons from '../SocialIcons.jsx'

export default function VariationB() {
  return (
    <div className="var-b">
      {/* Tri-column header: nav | name | social */}
      <header className="var-b__header">
        <nav className="var-b__nav-left">
          <a href="#songs">Songs</a>
          <a href="#about">About</a>
          <a href="#">Shop</a>
          <a href="#tours">Tours</a>
        </nav>
        <a href="#" className="var-b__logo">Michael Kim-Sheng</a>
        <SocialIcons className="var-b__header-social" />
      </header>

      {/* Hero — large serif name, mono subtitle */}
      <section className="var-b__hero">
        <h1 className="var-b__name">Michael<br />Kim-Sheng</h1>
        <p className="var-b__role">composer</p>
      </section>

      {/* Songs — editorial list */}
      <section id="songs" className="var-b__section">
        <span className="var-b__eyebrow">Works</span>
        <div className="var-b__song-row">
          <span className="var-b__song-num">01</span>
          <span className="var-b__song-title">In a Field of Silence</span>
          <span className="var-b__song-year">2024</span>
        </div>
        <div className="var-b__song-row var-b__song-row--muted">
          <span className="var-b__song-num">02</span>
          <span className="var-b__song-title">To Be Announced</span>
          <span className="var-b__song-year">&mdash;</span>
        </div>
      </section>

      {/* About — left-aligned, asymmetric */}
      <section id="about" className="var-b__section var-b__section--about">
        <span className="var-b__eyebrow">About</span>
        <p className="var-b__body">
          Each composition is an emotional landscape. Listeners describe physical
          sensations — hearts lifting, breath catching, tears forming from beauty
          rather than sadness. The music creates worlds you inhabit.
        </p>
        <div className="var-b__contact">
          <span className="var-b__eyebrow">Contact</span>
          <a href="mailto:contact@michaelkimsheng.com">contact@michaelkimsheng.com</a>
        </div>
      </section>

      {/* Tours */}
      <section id="tours" className="var-b__section">
        <span className="var-b__eyebrow">Live</span>
        <p className="var-b__coming-soon">Dates coming soon</p>
      </section>

      {/* Footer */}
      <footer className="var-b__footer">
        <div className="var-b__footer-left">
          <span>&copy; {new Date().getFullYear()} Michael Kim-Sheng</span>
        </div>
        <SocialIcons className="var-b__footer-social" />
      </footer>
    </div>
  )
}
