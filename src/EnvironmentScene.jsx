// EnvironmentScene — Mounts the 3D engine for each environment world
// Handles engine lifecycle: create on mount, destroy on world change
// Driven by WorldContext, not URL routes
import { useEffect, useRef, useState, useCallback } from 'react'
import { ENVIRONMENTS } from './environments/index.js'
import WorldEngine from './meadow/WorldEngine.js'
import ContentOverlay from './content/ContentOverlay.jsx'
import DevTuner from './DevTuner.jsx'
import useScrollAudio from './useScrollAudio.js'

export default function EnvironmentScene({ envId }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const config = ENVIRONMENTS[envId]

  // Detect tier 3 (mobile/no-WebGL2) eagerly — avoids setState inside effect
  const [isTier3] = useState(() => {
    if (window.screen.width <= 768) return true
    try {
      const c = document.createElement('canvas')
      return !c.getContext('webgl2')
    } catch { return true }
  })

  useEffect(() => {
    if (!canvasRef.current || isTier3) return

    // All environments use WorldEngine with their config
    engineRef.current = new WorldEngine(canvasRef.current, config)
    window.__MEADOW_ENGINE__ = engineRef.current

    return () => {
      engineRef.current?.destroy()
      engineRef.current = null
      window.__MEADOW_ENGINE__ = null
    }
  }, [envId, config, isTier3])

  useScrollAudio(engineRef)

  const handleSectionsReady = useCallback((sections) => {
    const register = () => {
      if (engineRef.current) {
        engineRef.current.setContentSections(sections)
      } else {
        requestAnimationFrame(register)
      }
    }
    register()
  }, [])

  return (
    <>
      {/* Scroll space */}
      <div style={{ height: '500vh' }} />

      {/* 3D canvas */}
      {isTier3 ? (
        <div className="static-meadow-fallback" />
      ) : (
        <canvas
          ref={canvasRef}
          style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        />
      )}

      {/* Content overlay — golden meadow uses full content, others show world identity */}
      {envId === 'golden-meadow' ? (
        <ContentOverlay onSectionsReady={handleSectionsReady} />
      ) : (
        <EnvironmentContent config={config} />
      )}

      <DevTuner engineRef={engineRef} />
    </>
  )
}

// Environment content for non-meadow worlds
function EnvironmentContent({ config }) {
  return (
    <div className="content-overlay">
      <div className="content-section" style={{ opacity: 1 }}>
        <div className="section-inner">
          <h1
            className="artist-name"
            style={{ color: config.dominantColor }}
          >
            {config.name}
          </h1>
          <p className="subtitle" style={{ opacity: 0.5 }}>
            {config.emotion}
          </p>
          <p
            className="section-body"
            style={{ marginTop: '1.5rem', fontStyle: 'italic' }}
          >
            {config.tagline}
          </p>
        </div>
      </div>
    </div>
  )
}
