# Flower Field Reveal — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a four-phase scroll-driven landing page that transitions from dark crepuscular sky to a living wildflower meadow, where the scroll drives a wave reveal and generative flowers bloom as the primary visual layer over a real video backdrop.

**Architecture:** Scroll-driven phases using vanilla scroll events + requestAnimationFrame. A dark mask canvas is erased by a Perlin-noise wavefront as the user scrolls. Beneath the mask: a looping wildflower video provides atmospheric depth. On top: a generative flower canvas renders 150-300 persistent, audio-reactive flowers that bloom in clusters along the wavefront. Audio fades in at 30% wave progress.

**Tech Stack:** React 19, vanilla 2D Canvas (following existing FlowerVisual.jsx pattern), CSS keyframes, HTML5 video. No new dependencies — the codebase uses no framer-motion/p5.js/Three.js currently, and this plan keeps it that way for consistency.

---

## Task 1: Scaffold LandingSection Component + Scroll Infrastructure

**Files:**
- Create: `src/LandingSection.jsx`
- Create: `src/LandingSection.css`
- Modify: `src/App.jsx` (replace `HomePage` with `LandingSection` on home route)

**Step 1: Create LandingSection.jsx skeleton**

```jsx
// src/LandingSection.jsx
import { useState, useEffect, useRef } from 'react'
import './LandingSection.css'

export default function LandingSection() {
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const totalHeight = sectionRef.current.scrollHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / totalHeight))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={sectionRef} className="landing-section">
      {/* Phase 1: The Knowing — 100vh */}
      <div className="landing-phase landing-phase--knowing">
        <h1 className="landing-title">Michael Kim-Sheng</h1>
        <p className="landing-subtitle">a composer between musical worlds</p>
      </div>

      {/* Phase 2: The Warming — 100vh */}
      <div className="landing-phase landing-phase--warming" />

      {/* Phase 3: The First Note — 150vh */}
      <div className="landing-phase landing-phase--first-note" />

      {/* Phase 4: The Field — 100vh */}
      <div className="landing-phase landing-phase--field" />
    </div>
  )
}
```

**Step 2: Create LandingSection.css with phase layout**

```css
/* src/LandingSection.css */
.landing-section {
  position: relative;
  width: 100%;
}

.landing-phase {
  position: relative;
  width: 100%;
}

.landing-phase--knowing {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.landing-phase--warming {
  height: 100vh;
}

.landing-phase--first-note {
  height: 150vh;
}

.landing-phase--field {
  height: 100vh;
}

.landing-title {
  font-family: 'Birch Std', serif;
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #fff;
  opacity: 0;
  animation: titleReveal 2s cubic-bezier(0.22, 1, 0.36, 1) 3s forwards;
}

.landing-subtitle {
  font-family: 'PT Serif', serif;
  font-style: italic;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(200, 212, 232, 0.6);
  opacity: 0;
  animation: titleReveal 2s cubic-bezier(0.22, 1, 0.36, 1) 4s forwards;
}

@keyframes titleReveal {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Step 3: Wire LandingSection into App.jsx**

In `src/App.jsx`, replace the `HomePage` component usage:

- Add import: `import LandingSection from './LandingSection.jsx'`
- Replace `{page === 'home' && <HomePage />}` with `{page === 'home' && <LandingSection />}`

**Step 4: Run dev server to verify**

Run: `cd /Users/johnnysheng/mks/mks-site && npm run dev`

Expected: Page loads with scrollable landing section (4 phases). Title appears after 3s delay. Scrolling moves through empty phases.

**Step 5: Commit**

```bash
git add src/LandingSection.jsx src/LandingSection.css src/App.jsx
git commit -m "feat: scaffold LandingSection with scroll phases"
```

---

## Task 2: Perlin Noise Utility Module

The wave reveal and flower wind both need Perlin noise. Create a shared utility.

**Files:**
- Create: `src/utils/noise.js`

**Step 1: Implement simplex noise**

```js
// src/utils/noise.js
// 2D simplex noise — adapted from Stefan Gustavson's implementation
// Returns values in [-1, 1]

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

const grad3 = [
  [1,1],[-1,1],[1,-1],[-1,-1],
  [1,0],[-1,0],[0,1],[0,-1],
  [1,1],[-1,1],[1,-1],[-1,-1],
]

// Permutation table (256 entries, doubled to avoid wrapping)
const p = new Uint8Array(512)
const perm = new Uint8Array(512)

function seed(s) {
  // Simple seeded RNG (xorshift)
  let x = s | 0
  for (let i = 0; i < 256; i++) {
    x ^= x << 13; x ^= x >> 17; x ^= x << 5
    p[i] = (x >>> 0) % 256
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255]
  }
}

seed(42) // deterministic default

export function noise2D(xin, yin) {
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const t = (i + j) * G2
  const X0 = i - t
  const Y0 = j - t
  const x0 = xin - X0
  const y0 = yin - Y0

  let i1, j1
  if (x0 > y0) { i1 = 1; j1 = 0 }
  else { i1 = 0; j1 = 1 }

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2

  const ii = i & 255
  const jj = j & 255
  const gi0 = perm[ii + perm[jj]] % 12
  const gi1 = perm[ii + i1 + perm[jj + j1]] % 12
  const gi2 = perm[ii + 1 + perm[jj + 1]] % 12

  let n0 = 0, n1 = 0, n2 = 0

  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 >= 0) {
    t0 *= t0
    n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0)
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 >= 0) {
    t1 *= t1
    n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1)
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 >= 0) {
    t2 *= t2
    n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2)
  }

  // Scale to [0, 1] for convenience
  return (70 * (n0 + n1 + n2) + 1) / 2
}

export { seed }
```

**Step 2: Verify with dev server**

Import in LandingSection temporarily to confirm it works:
```js
import { noise2D } from './utils/noise.js'
console.log('noise test:', noise2D(0.5, 0.5)) // Should print a number 0-1
```

Remove the test log after confirming.

**Step 3: Commit**

```bash
git add src/utils/noise.js
git commit -m "feat: add simplex noise utility for wave and wind effects"
```

---

## Task 3: Video Layer + Dark Mask Canvas

**Files:**
- Modify: `src/LandingSection.jsx` — add video element + mask canvas
- Modify: `src/LandingSection.css` — layer stacking
- Add: video file to `public/` (placeholder initially)

**Step 1: Add video element and mask canvas to LandingSection**

Update `LandingSection.jsx`:

```jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { noise2D } from './utils/noise.js'
import './LandingSection.css'

export default function LandingSection() {
  const sectionRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const videoRef = useRef(null)
  const rafRef = useRef(null)
  const scrollRef = useRef(0) // avoid re-renders on scroll

  // Scroll tracking (no state — stored in ref for perf)
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const totalHeight = sectionRef.current.scrollHeight - window.innerHeight
      scrollRef.current = Math.max(0, Math.min(1, -rect.top / totalHeight))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mask canvas — draws the dark overlay that the wave erases
  useEffect(() => {
    const canvas = maskCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w, h
    const resize = () => {
      // Half resolution for performance
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

      // Phase 3 starts at ~44% of total scroll (200vh / 450vh)
      // Phase 3 ends at ~78% (350vh / 450vh)
      const phase3Start = 0.44
      const phase3End = 0.78
      const waveProgress = Math.max(0, Math.min(1,
        (progress - phase3Start) / (phase3End - phase3Start)
      ))

      // Fill entire canvas with dark overlay
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      if (waveProgress > 0) {
        // Wave position (left edge of reveal)
        const waveX = waveProgress * w

        // Clear pixels left of wave (reveal video)
        // Use ImageData for pixel-level Perlin noise edge
        const imageData = ctx.getImageData(0, 0, w, h)
        const data = imageData.data

        for (let y = 0; y < h; y++) {
          // Perlin noise edge offset — organic wavefront
          const noiseOffset = (noise2D(y * 0.008, time * 0.15) - 0.5) * 80
          const edgeX = waveX + noiseOffset
          const feather = 30 // px of soft edge (at half-res)

          for (let x = 0; x < Math.min(w, edgeX + feather); x++) {
            const idx = (y * w + x) * 4
            if (x < edgeX - feather) {
              // Fully transparent — video shows
              data[idx + 3] = 0
            } else if (x < edgeX) {
              // Feathered edge
              const t = (x - (edgeX - feather)) / feather
              data[idx + 3] = Math.floor(t * t * 255) // Quadratic falloff
            }
            // else: stays fully opaque (dark)
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
      {/* Video layer — atmospheric depth */}
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

      {/* Dark mask — wave erases this to reveal video */}
      <canvas ref={maskCanvasRef} className="landing-mask" />

      {/* Phase 1: The Knowing */}
      <div className="landing-phase landing-phase--knowing">
        <h1 className="landing-title">Michael Kim-Sheng</h1>
        <p className="landing-subtitle">a composer between musical worlds</p>
      </div>

      {/* Phase 2-4: scroll space */}
      <div className="landing-phase landing-phase--warming" />
      <div className="landing-phase landing-phase--first-note" />
      <div className="landing-phase landing-phase--field" />
    </div>
  )
}
```

**Step 2: Update CSS for layer stacking**

```css
/* Add to LandingSection.css */

.landing-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

.landing-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  image-rendering: auto; /* smooth upscale from half-res */
}
```

**Step 3: Add placeholder video**

For now, create a simple placeholder. The real video will be sourced later.

Run: `cd /Users/johnnysheng/mks/mks-site && echo "TODO: source wildflower meadow video" > public/VIDEO_TODO.md`

Use any stock meadow MP4 for development (or leave as broken — the mask canvas will still work visually over the dark background).

**Step 4: Test scroll behavior**

Run: `npm run dev`

Expected: Scrolling through the page, around 44% scroll the dark mask starts being erased left-to-right with a Perlin-noise wavefront edge. The edge is organic, not a straight line.

**Step 5: Commit**

```bash
git add src/LandingSection.jsx src/LandingSection.css public/VIDEO_TODO.md
git commit -m "feat: add video layer and scroll-driven dark mask with Perlin wave edge"
```

---

## Task 4: Generative Flower Rendering System

Build the flower drawing primitives — the core visual engine. This follows the existing `FlowerVisual.jsx` bezier petal pattern but with more variety and depth.

**Files:**
- Create: `src/utils/flowers.js` — flower generation + drawing functions

**Step 1: Create flower factory and drawing utilities**

```js
// src/utils/flowers.js

// Flower types with distinct visual characteristics
const FLOWER_TYPES = [
  { name: 'daisy',      petalCount: [10, 14], petalLen: [12, 18], petalWid: [3, 5],  hueRange: [45, 55],   sat: [5, 15],  light: [88, 96] },
  { name: 'cornflower', petalCount: [6, 8],   petalLen: [14, 20], petalWid: [5, 8],  hueRange: [220, 240], sat: [55, 75], light: [55, 70] },
  { name: 'marigold',   petalCount: [12, 18], petalLen: [8, 14],  petalWid: [4, 7],  hueRange: [30, 45],   sat: [80, 95], light: [55, 65] },
  { name: 'poppy',      petalCount: [4, 6],   petalLen: [16, 22], petalWid: [10, 15],hueRange: [5, 15],    sat: [70, 85], light: [50, 60] },
  { name: 'buttercup',  petalCount: [5, 6],   petalLen: [10, 14], petalWid: [6, 9],  hueRange: [48, 56],   sat: [85, 95], light: [58, 68] },
  { name: 'wildgrass',  petalCount: [0, 0],   petalLen: [0, 0],   petalWid: [0, 0],  hueRange: [90, 130],  sat: [30, 50], light: [35, 50] },
]

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1))
}

// Create a single flower object with all its visual data
export function createFlower(x, y, depthLayer) {
  const type = FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)]
  const scale = depthLayer === 0 ? rand(0.9, 1.3) :
                depthLayer === 1 ? rand(0.5, 0.8) :
                                   rand(0.2, 0.45)

  const petalCount = type.name === 'wildgrass' ? 0 : randInt(type.petalCount[0], type.petalCount[1])
  const hue = rand(type.hueRange[0], type.hueRange[1])
  const sat = rand(type.sat[0], type.sat[1])
  const light = rand(type.light[0], type.light[1])

  // Pre-generate petal shape variations
  const petals = []
  for (let i = 0; i < petalCount; i++) {
    petals.push({
      angle: (i / petalCount) * Math.PI * 2 + rand(-0.1, 0.1),
      length: rand(type.petalLen[0], type.petalLen[1]) * scale,
      width: rand(type.petalWid[0], type.petalWid[1]) * scale,
      curve: rand(-0.2, 0.2), // asymmetry
    })
  }

  return {
    x, y,
    type: type.name,
    depthLayer,
    scale,
    hue, sat, light,
    petalCount,
    petals,
    stemHeight: rand(20, 50) * scale,
    stemCurve: rand(-0.3, 0.3),
    rotation: rand(-0.15, 0.15),
    swayPhase: rand(0, Math.PI * 2),
    swaySpeed: rand(0.3, 0.8),
    bloomState: 0,    // 0 = seed, 1 = full bloom
    bloomTarget: 0,
    bloomDelay: 0,    // set when wave reaches this flower
  }
}

// Draw a single flower onto a 2D canvas context
export function drawFlower(ctx, flower, time, energy) {
  const { x, y, type, scale, hue, sat, light, petals, stemHeight, stemCurve, rotation, swayPhase, swaySpeed, bloomState } = flower

  if (bloomState < 0.01) return // not visible yet

  const sway = Math.sin(time * swaySpeed + swayPhase) * (3 + energy * 8) * scale
  const headX = x + sway
  const headY = y - stemHeight * bloomState

  ctx.save()

  // Stem
  if (type !== 'wildgrass' || true) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(
      x + stemCurve * 20 * scale + sway * 0.5,
      y - stemHeight * 0.5 * bloomState,
      headX,
      headY
    )
    ctx.strokeStyle = `hsla(${100 + rand(-10, 10)}, 40%, 30%, ${0.5 * bloomState})`
    ctx.lineWidth = Math.max(1, 1.5 * scale)
    ctx.stroke()
  }

  if (type === 'wildgrass') {
    // Wildgrass: just the stem with a slight tip
    ctx.beginPath()
    ctx.moveTo(headX - 2 * scale, headY)
    ctx.lineTo(headX, headY - 4 * scale)
    ctx.lineTo(headX + 2 * scale, headY)
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${0.6 * bloomState})`
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.translate(headX, headY)
  ctx.rotate(rotation + sway * 0.02)

  // Petals
  const openAmount = bloomState
  for (const petal of petals) {
    ctx.save()
    ctx.rotate(petal.angle)

    const len = petal.length * openAmount
    const wid = petal.width * openAmount

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      -wid * 0.6 + petal.curve * wid, -len * 0.4,
      -wid * 0.3, -len * 0.9,
      0, -len
    )
    ctx.bezierCurveTo(
      wid * 0.3, -len * 0.9,
      wid * 0.6 - petal.curve * wid, -len * 0.4,
      0, 0
    )

    const petalLight = light + energy * 10
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${petalLight}%, ${0.85 * bloomState})`
    ctx.fill()
    ctx.restore()
  }

  // Center (pistil)
  const centerR = Math.max(1, 3 * scale * openAmount)
  ctx.beginPath()
  ctx.arc(0, 0, centerR, 0, Math.PI * 2)
  ctx.fillStyle = `hsla(${hue + 20}, ${sat - 10}%, ${Math.min(90, light + 20)}%, ${bloomState})`
  ctx.fill()

  // Subtle glow around center
  if (bloomState > 0.5) {
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, centerR * 3)
    glow.addColorStop(0, `hsla(${hue}, ${sat}%, ${light + 20}%, ${0.2 * bloomState})`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(-centerR * 3, -centerR * 3, centerR * 6, centerR * 6)
  }

  ctx.restore()
}

// Generate a field of flowers distributed across the viewport
export function generateFlowerField(width, height, count) {
  const flowers = []

  // Distribute across 3 depth layers
  // Near (60%), Mid (25%), Far (15%)
  const distribution = [
    { layer: 0, count: Math.floor(count * 0.6), yMin: 0.55, yMax: 0.98 },
    { layer: 1, count: Math.floor(count * 0.25), yMin: 0.35, yMax: 0.65 },
    { layer: 2, count: Math.floor(count * 0.15), yMin: 0.2, yMax: 0.45 },
  ]

  for (const { layer, count: layerCount, yMin, yMax } of distribution) {
    for (let i = 0; i < layerCount; i++) {
      const x = rand(0, width)
      const y = rand(yMin * height, yMax * height)
      flowers.push(createFlower(x, y, layer))
    }
  }

  // Sort by Y for painter's algorithm (far flowers drawn first)
  flowers.sort((a, b) => a.y - b.y)

  return flowers
}
```

**Step 2: Verify by importing and logging**

In LandingSection, temporarily:
```js
import { generateFlowerField } from './utils/flowers.js'
console.log('flowers:', generateFlowerField(1920, 1080, 10))
```

Check console — should see array of 10 flower objects with varied types, positions, petals.

Remove test log after confirming.

**Step 3: Commit**

```bash
git add src/utils/flowers.js
git commit -m "feat: generative flower factory with 6 types and depth layers"
```

---

## Task 5: Flower Canvas — Bloom Wave Rendering

Wire the flower system into the landing section as a persistent canvas layer.

**Files:**
- Modify: `src/LandingSection.jsx` — add flower canvas + bloom wave logic

**Step 1: Add flower canvas and bloom wave to LandingSection**

Add these to LandingSection.jsx:

- New refs: `flowerCanvasRef`, `flowersRef` (stores generated flower array)
- New useEffect for the flower canvas animation loop
- The flower bloom wave: flowers whose X position is behind the mask wave edge get their `bloomTarget` set to 1

```jsx
// Add to imports
import { generateFlowerField, drawFlower } from './utils/flowers.js'

// Add refs (inside component, near existing refs)
const flowerCanvasRef = useRef(null)
const flowersRef = useRef(null)

// Flower canvas effect — add after the mask canvas effect
useEffect(() => {
  const canvas = flowerCanvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let raf
  let w, h

  const resize = () => {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w
    canvas.height = h
    // Regenerate flowers on resize
    flowersRef.current = generateFlowerField(w, h, 200)
  }
  resize()
  window.addEventListener('resize', resize)

  // Audio energy (same pattern as FlowerVisual.jsx)
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
    if (!flowers) { raf = requestAnimationFrame(draw); return }

    // Calculate wave position (same as mask canvas)
    const phase3Start = 0.44
    const phase3End = 0.78
    const waveProgress = Math.max(0, Math.min(1,
      (progress - phase3Start) / (phase3End - phase3Start)
    ))
    const waveX = waveProgress * w

    // Audio energy
    const rawEnergy = getEnergy()
    smoothEnergy += (rawEnergy - smoothEnergy) * 0.05

    ctx.clearRect(0, 0, w, h)

    // Update bloom states based on wave position
    for (const flower of flowers) {
      // Flower blooms when wave passes its X position
      // Add noise offset for organic edge (matching mask)
      const noiseOffset = (noise2D(flower.y * 0.008, time * 0.15) - 0.5) * 80 * 2
      if (flower.x < waveX + noiseOffset) {
        flower.bloomTarget = 1
      }

      // Smooth bloom transition
      if (flower.bloomTarget > flower.bloomState) {
        flower.bloomState += (flower.bloomTarget - flower.bloomState) * 0.03
      }

      drawFlower(ctx, flower, time, smoothEnergy)
    }

    raf = requestAnimationFrame(draw)
  }

  draw()
  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }
}, [])
```

Add the canvas element to JSX (between mask and content):

```jsx
{/* Generative flowers — primary visual layer */}
<canvas ref={flowerCanvasRef} className="landing-flowers" />
```

**Step 2: Add CSS for flower canvas**

```css
.landing-flowers {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
}
```

**Step 3: Test the bloom wave**

Run: `npm run dev`

Expected: Scrolling to Phase 3 (around 44% of total page height), generative flowers begin blooming left-to-right following the same Perlin-noise wavefront as the mask reveal. Flowers stay after blooming and sway gently.

**Step 4: Commit**

```bash
git add src/LandingSection.jsx src/LandingSection.css
git commit -m "feat: generative flower canvas with scroll-driven bloom wave"
```

---

## Task 6: Phase 2 Sky Warming Effect

The transition from cold dark void to warm golden tones before the wave begins.

**Files:**
- Modify: `src/LandingSection.jsx` — add warming overlay logic
- Modify: `src/LandingSection.css` — warming gradient styles

**Step 1: Add warming overlay with scroll-driven opacity**

In `LandingSection.jsx`, add a warming overlay div and drive its opacity from scroll:

```jsx
// Inside the JSX, add between mask and flower canvases:
<div
  className="landing-warming-overlay"
  style={{
    opacity: (() => {
      // Phase 2: 22% to 44% of total scroll
      const warmStart = 0.22
      const warmEnd = 0.44
      const p = scrollRef.current // NOTE: this won't re-render!
      return 0 // See step 2 for the real approach
    })()
  }}
/>
```

Actually — since `scrollRef` doesn't trigger re-renders, use a separate state just for the warming opacity, updated in the mask canvas RAF loop:

Add state: `const [warmOpacity, setWarmOpacity] = useState(0)`

In the mask canvas `draw()` function, add:
```js
// Calculate warming (Phase 2: 22%-44% of total scroll)
const warmStart = 0.22
const warmEnd = 0.44
const warmProgress = Math.max(0, Math.min(1,
  (progress - warmStart) / (warmEnd - warmStart)
))
setWarmOpacity(warmProgress)
```

Then in JSX:
```jsx
<div
  className="landing-warming-overlay"
  style={{ opacity: warmOpacity * 0.6 }}
/>
```

**Step 2: CSS for warming overlay**

```css
.landing-warming-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 60%,
    rgba(232, 200, 120, 0.4) 0%,
    rgba(180, 120, 60, 0.2) 40%,
    transparent 70%
  );
  transition: opacity 0.1s linear;
}
```

**Step 3: Test**

Run: `npm run dev`

Expected: Scrolling through Phase 2, a warm golden radial gradient fades in over the dark background, creating the "golden flood" before the wave begins.

**Step 4: Commit**

```bash
git add src/LandingSection.jsx src/LandingSection.css
git commit -m "feat: add golden warming overlay for sky-to-meadow transition"
```

---

## Task 7: Audio Fade-In Trigger

When the wave crosses 30% of the viewport, begin fading in audio. At 50%, full volume.

**Files:**
- Modify: `src/LandingSection.jsx` — add audio volume control in RAF loop

**Step 1: Add audio volume ramp in the flower canvas draw loop**

In the flower canvas `draw()` function, after the waveProgress calculation:

```js
// Audio fade-in based on wave progress
const audio = document.querySelector('audio')
if (audio && !audio.paused) {
  // Wave at 30% → start fade. Wave at 50% → full volume.
  const audioProgress = Math.max(0, Math.min(1,
    (waveProgress - 0.3) / 0.2
  ))
  // Ease the volume curve
  const targetVol = audioProgress * audioProgress // quadratic ease-in
  audio.volume = Math.min(1, targetVol)
}
```

Note: This only applies if audio is already playing (user clicked play). We don't auto-play audio — that requires user interaction. The wave adjusts volume of already-playing audio.

**Step 2: Test**

Run: `npm run dev`

Expected: Start playing audio via MiniPlayer, then scroll into Phase 3. Audio volume dips and fades back in as the wave progresses. At wave 50%, volume is back to full.

**Step 3: Commit**

```bash
git add src/LandingSection.jsx
git commit -m "feat: audio volume ramps with wave progress"
```

---

## Task 8: Film Grain + Vignette Overlays

These are global overlays that should always be present (per design rules). They sit on top of everything.

**Files:**
- Create: `src/Overlays.jsx`
- Create: `src/Overlays.css`
- Modify: `src/App.jsx` — add `<Overlays />` component

**Step 1: Create Overlays component**

```jsx
// src/Overlays.jsx
import { useEffect, useRef } from 'react'
import './Overlays.css'

export default function Overlays() {
  const grainRef = useRef(null)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Generate a small grain tile (128x128) and repeat it
    const size = 128
    canvas.width = size
    canvas.height = size

    let frame = 0
    let raf

    const drawGrain = () => {
      const imageData = ctx.createImageData(size, size)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)

      frame++
      // Update grain at ~12fps (every other frame at 60fps → every 5th)
      setTimeout(() => { raf = requestAnimationFrame(drawGrain) }, 83)
    }

    drawGrain()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <canvas ref={grainRef} className="overlay-grain" />
      <div className="overlay-vignette" />
    </>
  )
}
```

**Step 2: Create Overlays.css**

```css
/* src/Overlays.css */
.overlay-grain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9990;
  pointer-events: none;
  opacity: 0.03;
  mix-blend-mode: overlay;
  /* Tile the small canvas across the viewport */
  image-rendering: pixelated;
}

.overlay-vignette {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9991;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(0, 0, 0, 0.35) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .overlay-grain {
    /* Static grain — no animation */
    animation: none;
  }
}
```

**Step 3: Add to App.jsx**

Import and render `<Overlays />` inside the App component, at the end of the JSX (so it's on top of everything except cursor):

```jsx
import Overlays from './Overlays.jsx'
// In the render:
<Overlays />
<MoonlightCursor />  {/* cursor stays on top */}
```

**Step 4: Test**

Run: `npm run dev`

Expected: Subtle film grain texture visible over the entire page. Dark vignette around the edges. Both are always present, do not interact with scrolling.

**Step 5: Commit**

```bash
git add src/Overlays.jsx src/Overlays.css src/App.jsx
git commit -m "feat: add film grain and vignette overlays (always-on)"
```

---

## Task 9: prefers-reduced-motion Fallbacks

**Files:**
- Modify: `src/LandingSection.jsx` — check media query, skip animations
- Modify: `src/LandingSection.css` — reduced motion styles

**Step 1: Add motion preference check**

At the top of `LandingSection`, add:

```jsx
const prefersReducedMotion = useRef(
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
)
```

In the mask canvas effect and flower canvas effect, check this ref:

```js
// At start of draw():
if (prefersReducedMotion.current) {
  // Instant reveal — no wave animation
  // Mask: fully transparent
  ctx.clearRect(0, 0, w, h)
  // Flowers: all bloomed immediately
  for (const flower of flowers) {
    flower.bloomState = 1
    flower.bloomTarget = 1
  }
  // Draw flowers once then stop loop
  for (const flower of flowers) drawFlower(ctx, flower, 0, 0)
  return // don't requestAnimationFrame
}
```

**Step 2: CSS fallbacks**

```css
@media (prefers-reduced-motion: reduce) {
  .landing-title,
  .landing-subtitle {
    animation: none;
    opacity: 1;
  }

  .landing-mask {
    display: none; /* no mask — video always visible */
  }

  .landing-warming-overlay {
    opacity: 0.4 !important; /* always warm, no transition */
  }
}
```

**Step 3: Test**

Open System Preferences → Accessibility → Display → Reduce Motion (or use browser devtools to emulate). Reload the page.

Expected: No wave animation. Flowers are immediately visible and static. Video plays but flowers don't sway. Title appears instantly.

**Step 4: Commit**

```bash
git add src/LandingSection.jsx src/LandingSection.css
git commit -m "feat: prefers-reduced-motion fallbacks for all landing animations"
```

---

## Task 10: Mobile Fallback

On mobile, skip the heavy canvas rendering. Use a static image + CSS mask transition.

**Files:**
- Modify: `src/LandingSection.jsx` — detect mobile, render simpler version
- Modify: `src/LandingSection.css` — mobile-specific styles

**Step 1: Add mobile detection**

At the top of `LandingSection`:

```jsx
const isMobile = useRef(window.innerWidth < 768)
```

Wrap the mask and flower canvas effects with early returns:

```js
useEffect(() => {
  if (isMobile.current) return // skip canvas on mobile
  // ... existing mask canvas code
}, [])

useEffect(() => {
  if (isMobile.current) return // skip canvas on mobile
  // ... existing flower canvas code
}, [])
```

**Step 2: Mobile-specific CSS**

```css
@media (max-width: 767px) {
  .landing-mask,
  .landing-flowers {
    display: none;
  }

  .landing-video {
    /* Simple fade-in on mobile, controlled by scroll */
    opacity: 0;
    transition: opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .landing-video.is-revealed {
    opacity: 1;
  }

  .landing-title {
    font-size: clamp(1.8rem, 8vw, 3rem);
    letter-spacing: 0.15em;
  }

  .landing-phase--knowing {
    height: 80vh;
  }

  .landing-phase--warming {
    height: 60vh;
  }

  .landing-phase--first-note {
    height: 80vh;
  }

  .landing-phase--field {
    height: 60vh;
  }
}
```

**Step 3: Add mobile video reveal class toggle**

In the scroll handler, for mobile:

```js
// In scroll handler:
if (isMobile.current && videoRef.current) {
  const revealThreshold = 0.35
  videoRef.current.classList.toggle('is-revealed', scrollRef.current > revealThreshold)
}
```

**Step 4: Test with mobile viewport**

In browser devtools, toggle device toolbar to mobile size (375px width). Reload.

Expected: No canvas layers. Video fades in via CSS transition at ~35% scroll. Simpler but still functional experience.

**Step 5: Commit**

```bash
git add src/LandingSection.jsx src/LandingSection.css
git commit -m "feat: mobile fallback — CSS-only video reveal, no canvas"
```

---

## Task 11: Polish Pass — Flower Cluster Blooming

Currently flowers bloom individually. Add cluster behavior: nearby flowers trigger in rapid succession for a more organic "garden waking up" feel.

**Files:**
- Modify: `src/LandingSection.jsx` — add cluster delay logic in flower canvas draw

**Step 1: Add cluster bloom delays**

In the flower canvas `draw()` function, replace the simple bloom trigger with cluster logic:

```js
// Update bloom states based on wave position
for (const flower of flowers) {
  const noiseOffset = (noise2D(flower.y * 0.008, time * 0.15) - 0.5) * 80 * 2

  if (flower.x < waveX + noiseOffset && flower.bloomTarget === 0) {
    // Bloom delay based on distance from wave edge — creates cluster stagger
    const distFromEdge = waveX + noiseOffset - flower.x
    flower.bloomDelay = Math.max(0, 0.5 - distFromEdge * 0.005) + Math.random() * 0.3
    flower.bloomTarget = 1
    flower.bloomStartTime = time
  }

  // Apply bloom with delay
  if (flower.bloomTarget === 1) {
    const elapsed = time - (flower.bloomStartTime || 0)
    if (elapsed > flower.bloomDelay) {
      // Spring-like bloom (overshoot then settle)
      const t = elapsed - flower.bloomDelay
      const spring = 1 - Math.exp(-t * 3) * Math.cos(t * 4)
      flower.bloomState = Math.min(1, spring)
    }
  }
}
```

This creates:
- Flowers near the wave edge bloom with a slight delay (cluster feel)
- Flowers further behind the wave bloom faster (they've been "waiting")
- Spring physics give a natural overshoot-and-settle animation
- Random jitter (0-0.3s) within each cluster prevents uniformity

**Step 2: Test**

Run: `npm run dev`

Expected: As the wave sweeps, flowers bloom in organic clusters rather than a uniform wavefront. Some bloom slightly before others in the same area. The bloom has a slight bounce (spring overshoot).

**Step 3: Commit**

```bash
git add src/LandingSection.jsx
git commit -m "feat: cluster bloom with spring physics for organic flower reveal"
```

---

## Task 12: Final Integration Test + Cleanup

**Files:**
- Modify: `src/App.jsx` — ensure all layers compose correctly
- Modify: `src/LandingSection.jsx` — any final z-index / ordering fixes

**Step 1: Verify full layer stack**

Check that the z-index ordering is correct across all components:

```
z-0:     Video (.landing-video)
z-0:     Warming overlay (.landing-warming-overlay)
z-1:     Dark mask canvas (.landing-mask)
z-2:     Flower canvas (.landing-flowers)
z-3-9:   Content layers (.landing-phase, .nav, etc.)
z-5:     FlowerVisual.jsx (existing — may need to disable on landing)
z-1000:  MiniPlayer
z-9990:  Film grain overlay
z-9991:  Vignette overlay
z-9999:  MoonlightCursor
```

**Step 2: Disable FlowerVisual on landing page**

The existing `FlowerVisual.jsx` renders its own flowers over the whole page. On the landing page, the new landing flowers should take over. In `App.jsx`, conditionally render:

```jsx
{page !== 'home' && <FlowerVisual />}
```

Or keep both and let the landing flowers layer on top (they have higher z-index context). Decide based on visual result.

**Step 3: Full scroll test**

Run: `npm run dev`

Walk through the entire flow:
1. Page loads → dark void, title fades in after 3s
2. Scroll → warming overlay fades in (golden glow)
3. Continue scrolling → wave begins, mask erases left-to-right with organic edge
4. Behind the wave → video visible, flowers bloom in clusters
5. Wave completes → full meadow, flowers sway, respond to audio
6. Play audio → flowers react to energy, volume adjusts with wave

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete landing page — sky to flower field reveal"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Scaffold + scroll infrastructure | `LandingSection.jsx`, `.css`, `App.jsx` |
| 2 | Perlin noise utility | `utils/noise.js` |
| 3 | Video layer + dark mask canvas | `LandingSection.jsx`, `.css` |
| 4 | Flower rendering system | `utils/flowers.js` |
| 5 | Flower canvas + bloom wave | `LandingSection.jsx` |
| 6 | Sky warming overlay | `LandingSection.jsx`, `.css` |
| 7 | Audio fade-in trigger | `LandingSection.jsx` |
| 8 | Film grain + vignette | `Overlays.jsx`, `.css`, `App.jsx` |
| 9 | prefers-reduced-motion | `LandingSection.jsx`, `.css` |
| 10 | Mobile fallback | `LandingSection.jsx`, `.css` |
| 11 | Cluster bloom polish | `LandingSection.jsx` |
| 12 | Integration test + cleanup | `App.jsx`, `LandingSection.jsx` |

**No new dependencies.** All canvas work uses vanilla 2D context, following the existing `FlowerVisual.jsx` pattern. The only external asset needed is a wildflower meadow video (MP4/WebM) placed at `public/meadow.mp4`.
