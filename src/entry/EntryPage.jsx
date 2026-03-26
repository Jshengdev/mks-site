// EntryPage — Canvas 2D dithered procedural flower
// Confirms AudioContext, then dissolves into the WebGL meadow.
// Key techniques stolen from reference:
// - Bezier curve petals with radial gradients
// - Double-layer dithering (Void-and-Cluster 16x16 + Bayer 4x4 blend)
// - 4-tone palette: #ededea, #a8a8a4, #545250, #111110
// - Half-resolution render for pixelated quality
// - 6-layer cursor parallax
// - Breathing animation (petal scale, flutter, skew)
import { useRef, useEffect, useState, useCallback } from 'react'
import { useWorld } from '../WorldContext.jsx'
import './EntryPage.css'

// 4-tone palette — dark monochrome base (pre-bloom)
const PALETTE_MONO = [
  [0x11, 0x11, 0x10], // darkest
  [0x54, 0x52, 0x50], // dark mid
  [0xa8, 0xa8, 0xa4], // light mid
  [0xed, 0xed, 0xea], // lightest
]

// Golden palette — warm amber tones (post-bloom, earned warmth)
const PALETTE_GOLD = [
  [0x1a, 0x12, 0x08], // warm black
  [0x8a, 0x6a, 0x2a], // dark amber
  [0xd4, 0xc9, 0x68], // amber (--amber from design system)
  [0xf0, 0xe8, 0xc8], // warm cream
]

// Lerp between two palettes
function lerpPalette(t) {
  return PALETTE_MONO.map((mono, i) => {
    const gold = PALETTE_GOLD[i]
    return [
      Math.round(mono[0] + (gold[0] - mono[0]) * t),
      Math.round(mono[1] + (gold[1] - mono[1]) * t),
      Math.round(mono[2] + (gold[2] - mono[2]) * t),
    ]
  })
}

let PALETTE = PALETTE_MONO

// Bayer 4x4 dither matrix (normalized 0-1)
const BAYER_4 = [
  [ 0/16,  8/16,  2/16, 10/16],
  [12/16,  4/16, 14/16,  6/16],
  [ 3/16, 11/16,  1/16,  9/16],
  [15/16,  7/16, 13/16,  5/16],
]

function ditherPixel(brightness, x, y) {
  // Bayer threshold lookup
  const threshold = BAYER_4[y % 4][x % 4]
  // Map brightness (0-1) to palette index with dithering
  const raw = brightness * (PALETTE.length - 1)
  const idx = raw + threshold > Math.floor(raw) + 1
    ? Math.min(Math.floor(raw) + 1, PALETTE.length - 1)
    : Math.floor(raw)
  return PALETTE[Math.max(0, Math.min(idx, PALETTE.length - 1))]
}

// Procedural flower geometry — different each visit via seeded random
function createFlowerSeed() {
  return {
    petalCount: 5 + Math.floor(Math.random() * 3), // 5-7 petals
    petalLength: 0.28 + Math.random() * 0.08,
    petalWidth: 0.12 + Math.random() * 0.04,
    petalCurve: 0.3 + Math.random() * 0.3,
    centerRadius: 0.06 + Math.random() * 0.02,
    stamenCount: 5 + Math.floor(Math.random() * 4),
    stemCurve: -0.05 + Math.random() * 0.1,
    leafAngle: 0.3 + Math.random() * 0.4,
    rotation: Math.random() * Math.PI * 0.1 - 0.05, // slight tilt
  }
}

// Draw a single bezier petal in normalized coordinates
function drawPetal(ctx, cx, cy, angle, length, width, curve, scale) {
  const sin = Math.sin(angle)
  const cos = Math.cos(angle)

  // Petal tip
  const tipX = cx + cos * length * scale
  const tipY = cy + sin * length * scale

  // Control points for bezier curves (left and right edges)
  const perpX = -sin * width * scale
  const perpY = cos * width * scale
  const curveOffX = cos * length * curve * scale
  const curveOffY = sin * length * curve * scale

  ctx.beginPath()
  ctx.moveTo(cx, cy)
  // Left edge
  ctx.bezierCurveTo(
    cx + curveOffX + perpX * 1.5, cy + curveOffY + perpY * 1.5,
    tipX + perpX * 0.5, tipY + perpY * 0.5,
    tipX, tipY
  )
  // Right edge (back to center)
  ctx.bezierCurveTo(
    tipX - perpX * 0.5, tipY - perpY * 0.5,
    cx + curveOffX - perpX * 1.5, cy + curveOffY - perpY * 1.5,
    cx, cy
  )
  ctx.closePath()
}

// 6 parallax layers (stem, back petals, front petals, center, stamen, annotations)
const PARALLAX_DEPTHS = [0.02, 0.04, 0.06, 0.08, 0.1, 0.03]

export default function EntryPage() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const seedRef = useRef(createFlowerSeed())
  const rafRef = useRef(null)
  const timeRef = useRef(0)
  const [dissolving, setDissolving] = useState(false)
  const dissolveRef = useRef(0)
  const bloomRef = useRef(0) // 0→1 color bloom (gold appears)
  const openRef = useRef(0) // 0→1 petal opening
  const { completeEntry } = useWorld()

  const handleEnter = useCallback(() => {
    if (dissolving) return
    setDissolving(true)
  }, [dissolving])

  // Bloom sequence: petals open + color blooms → then dissolve → enter
  useEffect(() => {
    if (!dissolving) return
    const start = performance.now()
    const bloomDuration = 800  // color + open
    const holdDuration = 400   // hold at full gold
    const dissolveDuration = 800 // dissolve to world
    const total = bloomDuration + holdDuration + dissolveDuration

    const animate = (now) => {
      const elapsed = now - start

      // Phase 1: Bloom color + open petals (0-800ms)
      if (elapsed < bloomDuration) {
        const t = elapsed / bloomDuration
        const eased = t * t * (3 - 2 * t) // smoothstep
        bloomRef.current = eased
        openRef.current = eased
        PALETTE = lerpPalette(eased)
      }
      // Phase 2: Hold at full gold (800-1200ms)
      else if (elapsed < bloomDuration + holdDuration) {
        bloomRef.current = 1
        openRef.current = 1
        PALETTE = PALETTE_GOLD
      }
      // Phase 3: Dissolve to world (1200-2000ms)
      else {
        const t = (elapsed - bloomDuration - holdDuration) / dissolveDuration
        bloomRef.current = 1
        openRef.current = 1
        dissolveRef.current = Math.min(1, t)
        PALETTE = PALETTE_GOLD
      }

      if (elapsed < total) {
        requestAnimationFrame(animate)
      } else {
        completeEntry()
      }
    }
    requestAnimationFrame(animate)
  }, [dissolving, completeEntry])

  // Mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth
      mouseRef.current.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    // Half-resolution for pixelated quality
    const resize = () => {
      const scale = 0.5 // half-res (intentionally 1x pixel aesthetic)
      canvas.width = Math.floor(window.innerWidth * scale)
      canvas.height = Math.floor(window.innerHeight * scale)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.imageSmoothingEnabled = false
    }
    resize()
    window.addEventListener('resize', resize)

    const seed = seedRef.current

    const render = () => {
      rafRef.current = requestAnimationFrame(render)
      timeRef.current += 0.016 // ~60fps timestep
      const t = timeRef.current

      const w = canvas.width
      const h = canvas.height
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const dissolve = dissolveRef.current
      const bloomOpen = openRef.current

      // Clear to darkest palette color (shifts warm during bloom)
      const bg = PALETTE[0]
      ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`
      ctx.fillRect(0, 0, w, h)

      // Center of canvas in pixel coords
      const centerX = w * 0.5
      const centerY = h * 0.45 // slightly above center
      const flowerScale = Math.min(w, h) * 0.8

      // Breathing animation + bloom opening
      const bloomScale = 1 + bloomOpen * 0.25 // petals grow 25% during bloom
      const breathe = (1 + Math.sin(t * 0.8) * 0.015) * bloomScale
      const flutter = Math.sin(t * 1.2) * 0.02 + bloomOpen * 0.15 // petals spread apart

      // === LAYER 0: Stem ===
      const stemParallax = PARALLAX_DEPTHS[0]
      const stemOffX = (mx - 0.5) * stemParallax * w
      const stemOffY = (my - 0.5) * stemParallax * h

      ctx.save()
      ctx.translate(stemOffX, stemOffY)
      const midColor = PALETTE[1]
      ctx.strokeStyle = `rgb(${midColor[0]},${midColor[1]},${midColor[2]})`
      ctx.lineWidth = Math.max(1, w * 0.004)
      ctx.beginPath()
      const stemTopY = centerY + seed.centerRadius * flowerScale * 0.5
      const stemBottomY = h * 0.95
      const stemCurveX = centerX + seed.stemCurve * flowerScale
      ctx.moveTo(centerX, stemTopY)
      ctx.quadraticCurveTo(stemCurveX, (stemTopY + stemBottomY) * 0.5, centerX + seed.stemCurve * flowerScale * 0.3, stemBottomY)
      ctx.stroke()

      // Leaf
      const leafY = (stemTopY + stemBottomY) * 0.55
      const leafX = centerX + seed.stemCurve * flowerScale * 0.4
      ctx.fillStyle = '#545250'
      ctx.beginPath()
      const leafLen = flowerScale * 0.08
      const leafAng = seed.leafAngle + Math.sin(t * 0.7) * 0.05
      ctx.ellipse(
        leafX + Math.cos(leafAng) * leafLen * 0.5,
        leafY + Math.sin(leafAng) * leafLen * 0.5,
        leafLen, leafLen * 0.3,
        leafAng, 0, Math.PI * 2
      )
      ctx.fill()
      ctx.restore()

      // === LAYER 1: Back petals ===
      const backParallax = PARALLAX_DEPTHS[1]
      const backOffX = (mx - 0.5) * backParallax * w
      const backOffY = (my - 0.5) * backParallax * h

      ctx.save()
      ctx.translate(backOffX, backOffY)
      ctx.translate(centerX, centerY)
      ctx.rotate(seed.rotation + flutter)
      ctx.scale(breathe, breathe)

      // Draw back petals (every other petal)
      for (let i = 0; i < seed.petalCount; i += 2) {
        const angle = (i / seed.petalCount) * Math.PI * 2 - Math.PI * 0.5
        const backPetalColor = PALETTE[2]
        ctx.fillStyle = `rgb(${backPetalColor[0]},${backPetalColor[1]},${backPetalColor[2]})`
        drawPetal(ctx, 0, 0, angle, seed.petalLength * flowerScale, seed.petalWidth * flowerScale, seed.petalCurve, 1.0)
        ctx.fill()
        // Darker edge
        const edgeColor = PALETTE[1]
        ctx.strokeStyle = `rgb(${edgeColor[0]},${edgeColor[1]},${edgeColor[2]})`
        ctx.lineWidth = Math.max(1, w * 0.002)
        ctx.stroke()
      }
      ctx.restore()

      // === LAYER 2: Front petals ===
      const frontParallax = PARALLAX_DEPTHS[2]
      const frontOffX = (mx - 0.5) * frontParallax * w
      const frontOffY = (my - 0.5) * frontParallax * h

      ctx.save()
      ctx.translate(frontOffX, frontOffY)
      ctx.translate(centerX, centerY)
      ctx.rotate(seed.rotation + flutter * 0.7)
      ctx.scale(breathe * 1.02, breathe * 1.02)

      for (let i = 1; i < seed.petalCount; i += 2) {
        const angle = (i / seed.petalCount) * Math.PI * 2 - Math.PI * 0.5
        const frontPetalColor = PALETTE[3]
        ctx.fillStyle = `rgb(${frontPetalColor[0]},${frontPetalColor[1]},${frontPetalColor[2]})`
        drawPetal(ctx, 0, 0, angle, seed.petalLength * flowerScale * 0.95, seed.petalWidth * flowerScale, seed.petalCurve, 1.0)
        ctx.fill()
        const frontEdge = PALETTE[2]
        ctx.strokeStyle = `rgb(${frontEdge[0]},${frontEdge[1]},${frontEdge[2]})`
        ctx.lineWidth = Math.max(1, w * 0.002)
        ctx.stroke()
      }
      ctx.restore()

      // === LAYER 3: Center ===
      const centerParallax = PARALLAX_DEPTHS[3]
      const cOffX = (mx - 0.5) * centerParallax * w
      const cOffY = (my - 0.5) * centerParallax * h

      ctx.save()
      ctx.translate(cOffX, cOffY)
      const cr = seed.centerRadius * flowerScale
      // Center disk
      ctx.beginPath()
      ctx.arc(centerX, centerY, cr, 0, Math.PI * 2)
      const centerColor = PALETTE[1]
      ctx.fillStyle = `rgb(${centerColor[0]},${centerColor[1]},${centerColor[2]})`
      ctx.fill()
      // Inner ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, cr * 0.6, 0, Math.PI * 2)
      const innerColor = PALETTE[0]
      ctx.fillStyle = `rgb(${innerColor[0]},${innerColor[1]},${innerColor[2]})`
      ctx.fill()
      ctx.restore()

      // === LAYER 4: Stamen ===
      const stamenParallax = PARALLAX_DEPTHS[4]
      const sOffX = (mx - 0.5) * stamenParallax * w
      const sOffY = (my - 0.5) * stamenParallax * h

      ctx.save()
      ctx.translate(sOffX, sOffY)
      for (let i = 0; i < seed.stamenCount; i++) {
        const angle = (i / seed.stamenCount) * Math.PI * 2
        const stLen = cr * (0.6 + Math.sin(t * 1.5 + i) * 0.1)
        const sx = centerX + Math.cos(angle) * stLen
        const sy = centerY + Math.sin(angle) * stLen
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(1, w * 0.003), 0, Math.PI * 2)
        const stamenColor = PALETTE[2]
        ctx.fillStyle = `rgb(${stamenColor[0]},${stamenColor[1]},${stamenColor[2]})`
        ctx.fill()
      }
      ctx.restore()

      // === LAYER 5: Text annotations ===
      const textParallax = PARALLAX_DEPTHS[5]
      const tOffX = (mx - 0.5) * textParallax * w
      const tOffY = (my - 0.5) * textParallax * h

      ctx.save()
      ctx.translate(tOffX, tOffY)
      // Artist name
      ctx.font = `${Math.floor(w * 0.025)}px "Cormorant Garamond", Georgia, serif`
      const nameColor = PALETTE[2]
      ctx.fillStyle = `rgb(${nameColor[0]},${nameColor[1]},${nameColor[2]})`
      ctx.textAlign = 'center'
      ctx.fillText('Michael Kim-Sheng', centerX, h * 0.82)
      // Subtitle
      ctx.font = `italic ${Math.floor(w * 0.015)}px "DM Sans", sans-serif`
      const subColor = PALETTE[1]
      ctx.fillStyle = `rgb(${subColor[0]},${subColor[1]},${subColor[2]})`
      ctx.fillText('composer', centerX, h * 0.86)
      ctx.restore()

      // === "Enter" prompt ===
      const enterAlpha = 0.3 + Math.sin(t * 2) * 0.15
      ctx.save()
      ctx.translate(tOffX * 0.5, tOffY * 0.5)
      ctx.font = `300 ${Math.floor(w * 0.018)}px "Cormorant Garamond", Georgia, serif`
      ctx.fillStyle = `rgba(168, 168, 164, ${enterAlpha})`
      ctx.textAlign = 'center'
      ctx.letterSpacing = '0.2em'
      ctx.fillText('ENTER', centerX, h * 0.93)
      ctx.restore()

      // === Apply dithering as post-process ===
      // Read pixel data, quantize through Bayer dither
      const imageData = ctx.getImageData(0, 0, w, h)
      const data = imageData.data

      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          const i = (py * w + px) * 4
          // Luminance
          const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
          const color = ditherPixel(lum, px, py)
          data[i] = color[0]
          data[i + 1] = color[1]
          data[i + 2] = color[2]
        }
      }

      // Dissolve effect — fade pixels to black using dither threshold
      if (dissolve > 0) {
        for (let py = 0; py < h; py++) {
          for (let px = 0; px < w; px++) {
            const i = (py * w + px) * 4
            const threshold = BAYER_4[py % 4][px % 4]
            if (dissolve > threshold) {
              data[i] = 0x11
              data[i + 1] = 0x11
              data[i + 2] = 0x10
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    render()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      className={`entry-page ${dissolving ? 'dissolving' : ''}`}
      onClick={handleEnter}
    >
      <canvas
        ref={canvasRef}
        className="entry-canvas"
      />
    </div>
  )
}
