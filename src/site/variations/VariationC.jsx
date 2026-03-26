/**
 * Variation C — "Refined Modern"
 * Single-column, generous whitespace, warm undertones.
 * Centered but not symmetric. Two-voice typography (serif + sans).
 * The "expensive gallery" approach — each section is a room.
 */
import SocialIcons from '../SocialIcons.jsx'

export default function VariationC() {
  return (
    <div className="var-c">
      {/* Floating pill nav */}
      <header className="var-c__header">
        <nav className="var-c__nav">
          <a href="#songs">Songs</a>
          <a href="#about">About</a>
          <a href="#">Shop</a>
          <a href="#tours">Tours</a>
        </nav>
      </header>

      {/* Hero — stacked, off-center name */}
      <section className="var-c__hero">
        <div className="var-c__hero-inner">
          <p className="var-c__pre-title">The music of</p>
          <h1 className="var-c__name">Michael Kim-Sheng</h1>
        </div>
      </section>

      {/* Songs */}
      <section id="songs" className="var-c__section">
        <div className="var-c__card">
          <h2 className="var-c__section-label">Songs</h2>
          <div className="var-c__song-item">
            <span className="var-c__song-name">In a Field of Silence</span>
            <span className="var-c__song-detail">Piano &amp; Strings &middot; 2024</span>
          </div>
          <div className="var-c__divider" />
          <p className="var-c__muted">More works in progress</p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="var-c__section">
        <div className="var-c__card">
          <h2 className="var-c__section-label">About</h2>
          <p className="var-c__body">
            Composer for film, concert, and immersive experiences. His work has been
            described as &ldquo;a happiness that makes you tear up&rdquo; and
            &ldquo;the unbearable pain and beautiful release in one moment.&rdquo;
          </p>
          <div className="var-c__divider" />
          <a href="mailto:contact@michaelkimsheng.com" className="var-c__link">
            contact@michaelkimsheng.com
          </a>
        </div>
      </section>

      {/* Tours */}
      <section id="tours" className="var-c__section">
        <div className="var-c__card">
          <h2 className="var-c__section-label">Tours</h2>
          <p className="var-c__muted">Coming soon</p>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="var-c__section">
        <a href="#" className="var-c__shop-link">Visit Shop</a>
      </section>

      {/* Footer */}
      <footer className="var-c__footer">
        <SocialIcons />
        <span className="var-c__copyright">&copy; {new Date().getFullYear()} Michael Kim-Sheng</span>
      </footer>
    </div>
  )
}
