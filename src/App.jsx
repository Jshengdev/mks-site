import { useEffect, useRef, useCallback, useState } from 'react'
import MeadowEngine from './meadow/MeadowEngine.js'
import ContentOverlay from './content/ContentOverlay.jsx'
import MiniPlayer from './MiniPlayer.jsx'
import MoonlightCursor from './MoonlightCursor.jsx'
import useScrollAudio from './useScrollAudio.js'

function App() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [isTier3, setIsTier3] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    engineRef.current = new MeadowEngine(canvasRef.current)
    if (engineRef.current.tier === 3) {
      setIsTier3(true)
    }
    return () => {
      engineRef.current?.destroy()
      engineRef.current = null
    }
  }, [])

  // Audio integration
  useScrollAudio(engineRef)

  // Register content sections with engine for opacity updates
  const handleSectionsReady = useCallback((sections) => {
    // Engine may not be ready yet — retry on next frame if needed
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
      {/* Scroll space — Lenis scrolls this */}
      <div style={{ height: '500vh' }} />

      {/* Three.js canvas or Tier 3 static fallback */}
      {isTier3 ? (
        <div className="static-meadow-fallback" />
      ) : (
        <canvas
          ref={canvasRef}
          style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        />
      )}

      {/* Content sections */}
      <ContentOverlay onSectionsReady={handleSectionsReady} />

      {/* Surviving components */}
      <MiniPlayer />
      <MoonlightCursor />
    </>
  )
}

export default App
