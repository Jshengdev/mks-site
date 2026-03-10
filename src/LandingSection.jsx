import { useEffect, useRef, useState } from 'react'
import { noise2D } from './utils/noise.js'
import FlowerField from './FlowerField.jsx'
import useScrollAudio from './useScrollAudio.js'
import './LandingSection.css'
import './LandingAccessibility.css'

export default function LandingSection() {
  const sectionRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const videoRef = useRef(null)
  const rafRef = useRef(null)
  const scrollRef = useRef(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [debugInfo, setDebugInfo] = useState('')

  // Derive phase values from scroll
  const warmOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.22) / 0.22)) * 0.6
  const waveProgress = Math.max(0, Math.min(1, (scrollProgress - 0.44) / 0.34))

  // Audio volume ramp tied to wave progress
  useScrollAudio(waveProgress)

  // Scroll tracking — updates both ref (for canvas) and state (for React)
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const totalHeight = sectionRef.current.scrollHeight - window.innerHeight
      const scrollY = window.scrollY
      if (totalHeight <= 0) {
        setDebugInfo(`EARLY RETURN: scrollH=${sectionRef.current.scrollHeight} winH=${window.innerHeight} scrollY=${scrollY}`)
        return
      }
      const p = Math.max(0, Math.min(1, -rect.top / totalHeight))
      scrollRef.current = p
      setScrollProgress(p)
      setDebugInfo(`rectTop=${rect.top.toFixed(0)} totalH=${totalHeight.toFixed(0)} scrollY=${scrollY.toFixed(0)}`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mask canvas — draws the dark overlay that the wave erases
  useEffect(() => {
    const canvas = maskCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h

    const resize = () => {
      w = Math.floor(window.innerWidth / 2)
      h = Math.floor(window.innerHeight / 2)
      canvas.width = w
      canvas.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0
    const draw = () => {
      time += 0.016
      const progress = scrollRef.current

      // Wave progress (Phase 3: 44%-78%)
      const wp = Math.max(0, Math.min(1, (progress - 0.44) / 0.34))

      // Fill dark
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      if (wp > 0) {
        const waveX = wp * w
        const imageData = ctx.getImageData(0, 0, w, h)
        const data = imageData.data
        const feather = 30

        for (let y = 0; y < h; y++) {
          const noiseOffset = (noise2D(y * 0.008, time * 0.15) - 0.5) * 80
          const edgeX = waveX + noiseOffset

          for (let x = 0; x < Math.min(w, Math.ceil(edgeX + feather)); x++) {
            const idx = (y * w + x) * 4
            if (x < edgeX - feather) {
              data[idx + 3] = 0
            } else if (x < edgeX) {
              const t = (x - (edgeX - feather)) / feather
              data[idx + 3] = Math.floor(t * t * 255)
            }
          }
        }
        ctx.putImageData(imageData, 0, 0)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div ref={sectionRef} className="landing-section">
      {/* DEBUG — remove after testing */}
      <div style={{
        position: 'fixed', top: 10, right: 10, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)', color: '#0f0', padding: '8px 12px',
        fontFamily: 'monospace', fontSize: 12, borderRadius: 4,
      }}>
        scroll: {scrollProgress.toFixed(3)} | warm: {warmOpacity.toFixed(2)} | wave: {waveProgress.toFixed(3)}<br/>
        {debugInfo}
      </div>

      {/* Video layer */}
      <video
        ref={videoRef}
        className="landing-video"
        src="/meadow.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Warming overlay */}
      <div
        className="landing-warming-overlay"
        style={{ opacity: warmOpacity }}
      />

      {/* Dark mask canvas */}
      <canvas ref={maskCanvasRef} className="landing-mask" />

      {/* Generative flowers — primary visual layer */}
      <FlowerField scrollProgress={scrollProgress} />

      {/* Phase 1: The Knowing */}
      <div className="landing-phase landing-phase--knowing">
        <h1 className="landing-title">Michael Kim-Sheng</h1>
        <p className="landing-subtitle">a composer between musical worlds</p>
      </div>

      {/* Scroll space for phases 2-4 */}
      <div className="landing-phase landing-phase--warming" />
      <div className="landing-phase landing-phase--first-note" />
      <div className="landing-phase landing-phase--field" />
    </div>
  )
}
