import { useEffect, useRef } from 'react'
import MeadowEngine from './meadow/MeadowEngine.js'
import MiniPlayer from './MiniPlayer.jsx'
import MoonlightCursor from './MoonlightCursor.jsx'

function App() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    engineRef.current = new MeadowEngine(canvasRef.current)
    return () => engineRef.current?.destroy()
  }, [])

  return (
    <>
      {/* Scroll space — Lenis scrolls this */}
      <div style={{ height: '500vh' }} />

      {/* Three.js canvas — fixed behind everything */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Content overlay — added in Chunk 7 */}

      <MiniPlayer />
      <MoonlightCursor />
    </>
  )
}

export default App
