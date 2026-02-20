import { useState, useCallback } from 'react'
import './App.css'

const SPARKLE_EMOJIS = ['✨', '⭐', '🌟', '💫', '🔥', '👑', '💛', '🎉']

function App() {
  const [clicks, setClicks] = useState(0)
  const [sparkles, setSparkles] = useState([])

  const handleClick = useCallback((e) => {
    setClicks(c => c + 1)
    const id = Date.now()
    const emoji = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)]
    const sparkle = {
      id,
      emoji,
      x: e.clientX + (Math.random() - 0.5) * 40,
      y: e.clientY,
    }
    setSparkles(prev => [...prev, sparkle])
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id))
    }, 800)
  }, [])

  const marqueeText = 'MICHAEL KIM SHENG · THE ONE AND ONLY · LEGEND IN THE MAKING · '

  return (
    <div className="app">
      {/* Floating background shapes */}
      <div className="floating-shapes">
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-crown">👑</div>
        <h1 className="hero-name">Michael Kim Sheng</h1>
        <p className="hero-subtitle">a.k.a. The MKS</p>
        <p className="hero-tagline">
          Welcome to the official internet headquarters of the one,
          the only, the legendary Michael Kim Sheng.
        </p>
      </section>

      {/* Marquee */}
      <div className="marquee-container">
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>{marqueeText}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-card">
          <span className="stat-emoji">😎</span>
          <div className="stat-label">Coolness Level</div>
          <div className="stat-value">Off the Charts</div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">💪</span>
          <div className="stat-label">Power Level</div>
          <div className="stat-value">Over 9000</div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">🧠</span>
          <div className="stat-label">Big Brain</div>
          <div className="stat-value">Certified</div>
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <h2 className="about-title">Who is MKS?</h2>
        <p className="about-text">
          <strong>Michael Kim Sheng</strong> isn't just a name — it's a whole vibe.
          Part legend, part mystery, 100% iconic. This is his corner of the internet,
          and you're lucky to be here.
        </p>
        <p className="about-text">
          Whether he's out there conquering the world or just vibing,
          one thing is certain: <strong>MKS runs things.</strong>
        </p>
      </section>

      {/* Vibes */}
      <section className="vibes-section">
        <h2 className="vibes-title">The MKS Vibes</h2>
        <div className="vibes-grid">
          <div className="vibe-item">
            <span className="vibe-emoji">🎮</span>
            Gaming Legend
          </div>
          <div className="vibe-item">
            <span className="vibe-emoji">🍕</span>
            Pizza Enthusiast
          </div>
          <div className="vibe-item">
            <span className="vibe-emoji">🏆</span>
            Born Winner
          </div>
          <div className="vibe-item">
            <span className="vibe-emoji">🚀</span>
            Future CEO
          </div>
          <div className="vibe-item">
            <span className="vibe-emoji">😂</span>
            Comedy King
          </div>
          <div className="vibe-item">
            <span className="vibe-emoji">💤</span>
            Professional Napper
          </div>
          <div className="vibe-item">
            <span className="vibe-emoji">🎵</span>
            Vibe Curator
          </div>
          <div className="vibe-item">
            <span className="vibe-emoji">👑</span>
            Main Character
          </div>
        </div>
      </section>

      {/* Click Counter */}
      <section className="click-zone">
        <button className="click-button" onClick={handleClick}>
          Show MKS Some Love 💛
        </button>
        <div className="click-count">
          {clicks === 0 ? (
            "Click to show love!"
          ) : (
            <>MKS has received <strong>{clicks}</strong> love{clicks !== 1 && 's'}</>
          )}
        </div>
      </section>

      {/* Marquee again */}
      <div className="marquee-container">
        <div className="marquee-track" style={{ animationDirection: 'reverse' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>{marqueeText}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Made with <span className="footer-heart">♥</span> for Michael Kim Sheng
        </p>
      </footer>

      {/* Click sparkles */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="sparkle"
          style={{ left: s.x, top: s.y }}
        >
          {s.emoji}
        </div>
      ))}
    </div>
  )
}

export default App
