// src/FlowerField.jsx
import { useEffect, useRef } from 'react'
import { noise2D } from './utils/noise.js'
import { generateFlowerField, drawFlower } from './utils/flowers.js'

export default function FlowerField({ scrollProgress = 0 }) {
  const canvasRef = useRef(null)
  const flowersRef = useRef(null)
  const rafRef = useRef(null)
  const scrollRef = useRef(scrollProgress)

  // Keep scroll ref in sync with prop
  useEffect(() => { scrollRef.current = scrollProgress }, [scrollProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
      flowersRef.current = generateFlowerField(w, h, 200)
    }
    resize()
    window.addEventListener('resize', resize)

    // Audio energy (same pattern as existing FlowerVisual.jsx)
    let smoothEnergy = 0
    const getEnergy = () => {
      const audio = document.querySelector('audio')
      if (!audio || audio.paused) return 0
      const t = audio.currentTime
      return 0.15 + Math.sin(t * 2.1) * 0.06 + Math.sin(t * 3.7) * 0.04
    }

    let time = 0
    const draw = () => {
      time += 0.016
      const progress = scrollRef.current
      const flowers = flowersRef.current
      if (!flowers) { rafRef.current = requestAnimationFrame(draw); return }

      // Wave progress (Phase 3: 44%-78% of total landing scroll)
      const phase3Start = 0.44
      const phase3End = 0.78
      const waveProgress = Math.max(0, Math.min(1,
        (progress - phase3Start) / (phase3End - phase3Start)
      ))
      const waveX = waveProgress * w

      // Audio
      const rawEnergy = getEnergy()
      smoothEnergy += (rawEnergy - smoothEnergy) * 0.05

      ctx.clearRect(0, 0, w, h)

      // Don't render anything until wave has started
      if (waveProgress <= 0) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      // Update bloom states — cluster bloom with spring physics
      for (const flower of flowers) {
        const noiseOffset = (noise2D(flower.y * 0.008, time * 0.15) - 0.5) * 160

        // Only trigger bloom if wave has actually reached this flower
        // waveX must be positive and past the flower's x minus noise
        if (waveProgress > 0 && flower.x < waveX + noiseOffset && flower.bloomTarget === 0) {
          // Cluster stagger: flowers near wave edge get slight delay
          const distFromEdge = waveX + noiseOffset - flower.x
          flower.bloomDelay = Math.max(0, 0.5 - distFromEdge * 0.005) + Math.random() * 0.3
          flower.bloomTarget = 1
          flower.bloomStartTime = time
        }

        // Spring bloom animation
        if (flower.bloomTarget === 1 && flower.bloomStartTime > 0) {
          const elapsed = time - flower.bloomStartTime
          if (elapsed > flower.bloomDelay) {
            const t = elapsed - flower.bloomDelay
            const spring = 1 - Math.exp(-t * 3) * Math.cos(t * 4)
            flower.bloomState = Math.min(1, Math.max(0, spring))
          }
        }

        drawFlower(ctx, flower, time, smoothEnergy)
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
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  )
}
