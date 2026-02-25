import { useEffect, useRef } from 'react'

const FLOWER_COUNT = 9

export default function FlowerVisual() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let analyser = null
    let audioCtx = null
    let source = null
    let connected = false

    // Bloom state: 0 = closed, 1 = fully open
    let bloomTarget = 0
    let bloomCurrent = 0
    let isPlaying = false

    // Generate flowers once
    const flowers = Array.from({ length: FLOWER_COUNT }, (_, i) => {
      const spread = FLOWER_COUNT > 1 ? i / (FLOWER_COUNT - 1) : 0.5
      return {
        // Spread across bottom, with some clustering toward center
        xPct: 0.08 + spread * 0.84 + (Math.random() - 0.5) * 0.06,
        // Vary height from bottom
        stemHeight: 80 + Math.random() * 120,
        petalCount: 5 + Math.floor(Math.random() * 3),
        petalLength: 18 + Math.random() * 22,
        petalWidth: 8 + Math.random() * 8,
        rotation: (Math.random() - 0.5) * 0.3,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.008,
        // Stagger bloom timing
        bloomDelay: i * 0.08 + Math.random() * 0.1,
        bloomState: 0,
        // Color variation — all in moonlit blue range
        hue: 200 + Math.random() * 40,
        sat: 25 + Math.random() * 30,
        light: 50 + Math.random() * 25,
        // Each flower has unique petal shapes
        petals: Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => ({
          lengthMul: 0.8 + Math.random() * 0.4,
          widthMul: 0.7 + Math.random() * 0.6,
          angleOffset: (Math.random() - 0.5) * 0.12,
        })),
        // Smaller inner petals
        innerPetals: Array.from({ length: 3 + Math.floor(Math.random() * 2) }, () => ({
          lengthMul: 0.4 + Math.random() * 0.3,
          widthMul: 0.5 + Math.random() * 0.4,
          angleOffset: (Math.random() - 0.5) * 0.2,
        })),
      }
    })

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Smooth energy based on volume changes (no analyser needed)
    let prevVolState = 0
    let smoothEnergy = 0

    function getAudioEnergy() {
      const audio = document.querySelector('audio')
      if (!audio || audio.paused) return 0
      // Use currentTime changes as a proxy for energy + gentle sine wave
      const t = audio.currentTime || 0
      const raw = 0.15 +
        Math.sin(t * 2.1) * 0.06 +
        Math.sin(t * 3.7) * 0.04 +
        Math.sin(t * 0.8) * 0.05
      smoothEnergy += (raw - smoothEnergy) * 0.05
      return smoothEnergy
    }

    function drawStem(x, baseY, height, sway, bloom) {
      const tipY = baseY - height * bloom
      const swayX = sway * 12 * bloom

      ctx.beginPath()
      ctx.moveTo(x, baseY)
      ctx.quadraticCurveTo(
        x + swayX * 0.5, baseY - height * 0.5 * bloom,
        x + swayX, tipY
      )
      ctx.strokeStyle = `rgba(80, 140, 120, ${0.15 + bloom * 0.2})`
      ctx.lineWidth = 1.5 + bloom * 0.5
      ctx.lineCap = 'round'
      ctx.stroke()

      // Small leaf on stem
      if (bloom > 0.3) {
        const leafY = baseY - height * 0.4 * bloom
        const leafX = x + swayX * 0.3
        const leafAlpha = (bloom - 0.3) / 0.7

        ctx.save()
        ctx.translate(leafX, leafY)
        ctx.rotate(-0.4 + sway * 0.2)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-8, -4, -12, -10, -3, -14)
        ctx.bezierCurveTo(2, -10, 4, -4, 0, 0)
        ctx.fillStyle = `rgba(70, 130, 110, ${0.12 * leafAlpha})`
        ctx.fill()
        ctx.restore()
      }

      return { x: x + swayX, y: tipY }
    }

    function drawPetal(cx, cy, angle, length, width, openAmount) {
      if (openAmount < 0.01) return

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)

      const tipY = -length * openAmount

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(
        -width * 0.6 * openAmount, tipY * 0.3,
        -width * 0.45 * openAmount, tipY * 0.75,
        0, tipY
      )
      ctx.bezierCurveTo(
        width * 0.45 * openAmount, tipY * 0.75,
        width * 0.6 * openAmount, tipY * 0.3,
        0, 0
      )
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    function drawFlower(flower, time, globalBloom, energy) {
      const w = canvas.width
      const h = canvas.height
      const x = flower.xPct * w
      const baseY = h + 5

      // Per-flower bloom with stagger delay
      const delayedBloom = Math.max(0, globalBloom - flower.bloomDelay) / (1 - flower.bloomDelay)
      const targetState = Math.max(0, Math.min(1, delayedBloom))
      // Smooth ease toward target
      flower.bloomState += (targetState - flower.bloomState) * 0.02
      const bloom = flower.bloomState

      if (bloom < 0.005) return

      // Gentle sway
      const sway = Math.sin(time * flower.swaySpeed + flower.swayPhase) * (0.5 + energy * 1.5)

      // Draw stem
      const tip = drawStem(x, baseY, flower.stemHeight, sway, bloom)

      // Audio-reactive pulse on petals
      const pulse = 1 + energy * 0.15

      // Outer glow on flower head
      const glowSize = flower.petalLength * bloom * pulse * 1.8
      const glow = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, glowSize)
      glow.addColorStop(0, `hsla(${flower.hue}, ${flower.sat}%, ${flower.light + 20}%, ${bloom * 0.08})`)
      glow.addColorStop(0.5, `hsla(${flower.hue}, ${flower.sat}%, ${flower.light}%, ${bloom * 0.03})`)
      glow.addColorStop(1, `hsla(${flower.hue}, ${flower.sat}%, ${flower.light}%, 0)`)
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(tip.x, tip.y, glowSize, 0, Math.PI * 2)
      ctx.fill()

      // Draw outer petals
      const petalAlpha = bloom * (0.12 + energy * 0.08)
      flower.petals.forEach((p, i) => {
        const angle = flower.rotation + sway * 0.1 +
          (Math.PI * 2 / flower.petals.length) * i + p.angleOffset
        const len = flower.petalLength * p.lengthMul * bloom * pulse
        const wid = flower.petalWidth * p.widthMul

        ctx.fillStyle = `hsla(${flower.hue + i * 4}, ${flower.sat + 10}%, ${flower.light}%, ${petalAlpha})`
        drawPetal(tip.x, tip.y, angle, len, wid, bloom)

        // Moonlight highlight on petal edge
        ctx.fillStyle = `hsla(${flower.hue}, 15%, 88%, ${petalAlpha * 0.3})`
        drawPetal(tip.x, tip.y, angle, len * 0.8, wid * 0.25, bloom)
      })

      // Inner petals — brighter, smaller
      flower.innerPetals.forEach((p, i) => {
        const angle = flower.rotation + sway * 0.08 + 0.3 +
          (Math.PI * 2 / flower.innerPetals.length) * i + p.angleOffset
        const len = flower.petalLength * p.lengthMul * bloom * pulse
        const wid = flower.petalWidth * p.widthMul * 0.7

        ctx.fillStyle = `hsla(${flower.hue + 20}, ${flower.sat - 5}%, ${flower.light + 15}%, ${petalAlpha * 0.8})`
        drawPetal(tip.x, tip.y, angle, len, wid, bloom)
      })

      // Center pistil glow
      if (bloom > 0.2) {
        const centerR = 3 * bloom * pulse
        const cg = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, centerR * 2)
        cg.addColorStop(0, `hsla(45, 50%, 85%, ${bloom * 0.3})`)
        cg.addColorStop(0.5, `hsla(${flower.hue}, 30%, 75%, ${bloom * 0.1})`)
        cg.addColorStop(1, `hsla(${flower.hue}, 30%, 70%, 0)`)
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(tip.x, tip.y, centerR * 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let time = 0

    function animate() {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Check if audio is playing
      const audio = document.querySelector('audio')
      if (audio && !audio.paused) {
        isPlaying = true
        bloomTarget = 1
      } else {
        isPlaying = false
        bloomTarget = 0
      }

      // Smooth global bloom transition
      bloomCurrent += (bloomTarget - bloomCurrent) * 0.008

      const energy = getAudioEnergy()

      // Draw all flowers
      flowers.forEach(f => drawFlower(f, time, bloomCurrent, energy))

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  )
}
