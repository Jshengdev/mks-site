import './site.css'

export default function ProfessionalSite() {
  return (
    <div className="site">
      <header className="site-header">
        <span className="site-name">Michael Kim-Sheng</span>
        <nav className="site-nav">
          <a href="#music">Music</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="site-main">
        <section className="site-hero">
          <h1 className="site-title">Michael Kim-Sheng</h1>
          <p className="site-subtitle">Composer</p>
        </section>

        <section id="music" className="site-section">
          <h2>Music</h2>
          {/* Content to be filled with MKS */}
        </section>

        <section id="about" className="site-section">
          <h2>About</h2>
          {/* Content to be filled with MKS */}
        </section>

        <section id="contact" className="site-section">
          <h2>Contact</h2>
          {/* Content to be filled with MKS */}
        </section>
      </main>

      <footer className="site-footer">
        <span>&copy; {new Date().getFullYear()} Michael Kim-Sheng</span>
      </footer>
    </div>
  )
}
