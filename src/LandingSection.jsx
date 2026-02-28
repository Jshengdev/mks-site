import { useEffect, useRef, useState } from 'react'
import { noise2D } from './utils/noise.js'
import './LandingSection.css'

export default function LandingSection() {
  const sectionRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const videoRef = useRef(null)
  const rafRef = useRef(null)
  const scrollRef = useRef(0)
  const [warmOpacity, setWarmOpacity] = useState(0)

  // Scroll tracking — stored in ref to avoid re-renders
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const totalHeight = sectionRef.current.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      scrollRef.current = Math.max(0, Math.min(1, -rect.top / totalHeight))
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

      // Warming overlay (Phase 2: 22%-44%)
      const warmStart = 0.22
      const warmEnd = 0.44
      const warmProgress = Math.max(0, Math.min(1,
        (progress - warmStart) / (warmEnd - warmStart)
      ))
      setWarmOpacity(warmProgress)

      // Wave progress (Phase 3: 44%-78%)
      const phase3Start = 0.44
      const phase3End = 0.78
      const waveProgress = Math.max(0, Math.min(1,
        (progress - phase3Start) / (phase3End - phase3Start)
      ))

      // Fill dark
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      if (waveProgress > 0) {
        const waveX = waveProgress * w
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
        style={{ opacity: warmOpacity * 0.6 }}
      />

      {/* Dark mask canvas */}
      <canvas ref={maskCanvasRef} className="landing-mask" />

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
