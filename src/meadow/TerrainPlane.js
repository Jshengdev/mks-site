// src/meadow/TerrainPlane.js
// Per-world terrain algorithms — each world gets genuinely different geometry
import * as THREE from 'three'

const DEFAULT_TERRAIN_COLOR = new THREE.Color(0.16, 0.18, 0.07)

// ─── Height functions per terrain type ───

// Golden Meadow / Night Meadow — gentle rolling hills
function meadowHeight(x, z) {
  return Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
    + Math.sin(x * 0.05 + z * 0.03) * 0.5
}

// Ocean Cliff — high plateau dropping to ocean
// Cliff edge at z ≈ -30, camera stays on top, figure sits at edge
function oceanCliffHeight(x, z) {
  // Cliff-top plateau with gentle rolling
  const topBase = 8 + Math.sin(x * 0.03) * 1.5 + Math.cos(z * 0.04 + x * 0.02) * 1.0

  // Rocky detail intensifies near the cliff edge
  const edgeDist = Math.abs(z + 30)
  const rockyDetail = edgeDist < 10
    ? (Math.sin(x * 0.2) * Math.cos(z * 0.15) * 1.5) * (1 - edgeDist / 10)
    : 0

  // Steep sigmoid drop at z = -30 (cliff face)
  const cliffFactor = 1.0 / (1.0 + Math.exp(-(z + 30) * 2.0))

  // Below cliff: ocean floor at -1.5 (below water plane)
  return -1.5 + (topBase + rockyDetail + 1.5) * cliffFactor
}

// Storm Field — sharp angular peaks, high frequency, minimal smoothing
// abs(sin) creates V-shaped ridges instead of smooth waves
function stormFieldHeight(x, z) {
  // Sharp ridges via abs(sin) — V-shaped peaks
  const ridge1 = Math.abs(Math.sin(x * 0.08) * Math.cos(z * 0.06)) * 6
  const ridge2 = Math.abs(Math.sin(x * 0.15 + z * 0.12)) * 3
  // Broad undulation
  const base = Math.sin(x * 0.025) * Math.cos(z * 0.02) * 2
  // High-frequency sharp detail
  const detail = Math.abs(Math.sin(x * 0.3 + z * 0.25)) * 0.8
  return base + ridge1 + ridge2 + detail
}

// Ghibli Painterly — softer, rounder hills (fewer octaves, more stylized)
function ghibliHeight(x, z) {
  return Math.sin(x * 0.018) * Math.cos(z * 0.012) * 3.0
    + Math.sin(x * 0.04 + z * 0.025) * 1.0
}

// Volcanic Observatory — caldera crater with raised rim
// Inverted gaussian: deep center (lava lake), raised rim, gentle outer slopes
// Camera walks along the rim, looking down into fire and up at stars
function volcanicCalderaHeight(x, z) {
  // Distance from crater center (offset along camera path)
  const cx = x - 0  // crater centered at x=0
  const cz = z + 60 // crater centered at z=-60 (midpoint of camera path)
  const dist = Math.sqrt(cx * cx + cz * cz)

  // Caldera profile: gaussian rim with deep center
  const rimRadius = 35      // distance to rim peak
  const rimWidth = 12       // how wide the rim is
  const rimHeight = 10      // rim peak above base
  const craterDepth = -8    // how deep the crater floor is (lava lake sits here)

  // Gaussian rim — peaks at rimRadius, falls off both sides
  const rimFactor = Math.exp(-Math.pow(dist - rimRadius, 2) / (2 * rimWidth * rimWidth))
  const rim = rimFactor * rimHeight

  // Crater floor — flat bottom inside the rim
  const floorFactor = 1.0 / (1.0 + Math.exp((dist - rimRadius * 0.7) * 0.5))
  const floor = craterDepth * floorFactor

  // Outer slope — gentle descent outside the rim
  const outerSlope = dist > rimRadius ? -(dist - rimRadius) * 0.05 : 0

  // Rocky detail on the rim — irregular volcanic rock
  const rockDetail = dist < rimRadius + 15 && dist > rimRadius - 15
    ? (Math.sin(x * 0.3) * Math.cos(z * 0.25) * 0.8
      + Math.sin(x * 0.15 + z * 0.2) * 0.5)
      * rimFactor
    : 0

  return floor + rim + outerSlope + rockDetail
}

// Paper World — origami landscape with sharp creases and flat planes
// abs(sin) creates V-folds (mountain creases), quantization creates flat paper planes
// Source technique: faceted low-poly + height quantization for discrete plateaus
function paperFoldHeight(x, z) {
  // Primary mountain folds — large V-creases running at diagonal angles
  const fold1 = Math.abs(Math.sin(x * 0.035 + z * 0.02)) * 5.0
  const fold2 = Math.abs(Math.cos(x * 0.025 - z * 0.04)) * 3.0
  // Perpendicular valley fold — creates paper valleys between peaks
  const valley = -Math.abs(Math.sin(x * 0.06 + z * 0.045)) * 1.5
  // Secondary crease detail — smaller folds within the large ones
  const crease = Math.abs(Math.sin(x * 0.12 - z * 0.08)) * 0.8

  const raw = fold1 + fold2 + valley + crease
  // Quantize to 1/3 unit steps — paper has flat planes, not curves
  return Math.round(raw * 3) / 3
}

// Floating Library — cloud floor, nearly flat billowing surface
// This is the "ground" far below the library shelves — clouds viewed from above
// Camera starts here and spirals upward through the stacks
function cloudFloorHeight(x, z) {
  // Very gentle billowing — this is a cloud bank, not terrain
  // Three octaves of low-frequency sine create soft undulation
  const billow = Math.sin(x * 0.01) * Math.cos(z * 0.008) * 0.3
  const ripple = Math.sin(x * 0.03 + z * 0.02) * 0.15
  const detail = Math.sin(x * 0.08 + z * 0.06) * 0.05
  return billow + ripple + detail
}

// Crystal Cavern — inverted terrain, camera descends into the earth
// Rocky cavern floor with jagged stalagmite bases and shallow depressions (pools)
// Height is NEGATIVE (underground) — floor at ~-58, entrance at ~+5
function cavernFloorHeight(x, z) {
  // Base floor — irregular rocky surface deep underground
  const floor = -58 + Math.sin(x * 0.04) * Math.cos(z * 0.035) * 2.0

  // Stalagmite mounds — sharp rises from the floor
  // Multiple overlapping max(0, sin*cos) for jagged rocky bases
  const mound1 = Math.max(0, Math.sin(x * 0.12 + 1.7) * Math.cos(z * 0.10 + 0.3)) * 4.0
  const mound2 = Math.max(0, Math.sin(x * 0.08 - 0.5) * Math.cos(z * 0.14 + 2.1)) * 3.0
  const mound3 = Math.max(0, Math.sin(x * 0.18 + 3.1) * Math.cos(z * 0.07 - 1.2)) * 2.5

  // High-frequency rock detail — sharp craggy texture
  const detail = Math.sin(x * 0.3 + z * 0.25) * 0.4
    + Math.abs(Math.sin(x * 0.5) * Math.cos(z * 0.45)) * 0.3

  // Pool depressions — shallow dips where still water collects
  const poolDip = Math.sin(x * 0.06 + 0.8) * Math.sin(z * 0.05 + 1.5)
  const pool = poolDip > 0.7 ? (poolDip - 0.7) * -3.0 : 0

  return floor + mound1 + mound2 + mound3 + detail + pool
}

// Clockwork Forest — overlapping gear-tooth ridges + tree trunk mounds
// The ground IS a massive gear mechanism. Concentric tooth patterns at different scales,
// cylindrical tree-trunk bases rising through the gears, channels where steam vents.
// Source technique: polar repetition (Shadertoy sphere gears) + gaussian mounds (volcanic caldera)
function clockworkForestHeight(x, z) {
  // Camera path center ~z=-80, gear mechanism radiates from multiple centers
  // Gear center 1: large primary gear near entrance
  const cx1 = 0, cz1 = -25
  const d1 = Math.sqrt((x - cx1) * (x - cx1) + (z - cz1) * (z - cz1))
  const a1 = Math.atan2(z - cz1, x - cx1)
  const teeth1 = Math.abs(Math.sin(a1 * 16)) * 0.6 * Math.max(0, 1 - d1 / 35)

  // Gear center 2: smaller gear mid-path
  const cx2 = -6, cz2 = -65
  const d2 = Math.sqrt((x - cx2) * (x - cx2) + (z - cz2) * (z - cz2))
  const a2 = Math.atan2(z - cz2, x - cx2)
  const teeth2 = Math.abs(Math.sin(a2 * 24)) * 0.4 * Math.max(0, 1 - d2 / 25)

  // Gear center 3: large gear near exit
  const cx3 = 4, cz3 = -120
  const d3 = Math.sqrt((x - cx3) * (x - cx3) + (z - cz3) * (z - cz3))
  const a3 = Math.atan2(z - cz3, x - cx3)
  const teeth3 = Math.abs(Math.sin(a3 * 20)) * 0.5 * Math.max(0, 1 - d3 / 30)

  // Concentric rings — raised ridges like gear tracks
  const ring1 = Math.max(0, Math.sin(d1 * 0.3)) * 0.5
  const ring2 = Math.max(0, Math.sin(d2 * 0.4)) * 0.3
  const ring3 = Math.max(0, Math.sin(d3 * 0.35)) * 0.4

  // Tree trunk mounds — gaussian bumps where mechanical trees rise
  const mound = (mx, mz, r, h) => {
    const md = (x - mx) * (x - mx) + (z - mz) * (z - mz)
    return h * Math.exp(-md / (2 * r * r))
  }
  const trees = mound(3, -15, 3, 4) + mound(-7, -35, 3.5, 5)
    + mound(8, -55, 2.5, 3.5) + mound(-3, -80, 4, 5.5)
    + mound(6, -100, 3, 4) + mound(-5, -125, 3.5, 4.5)
    + mound(2, -145, 3, 3.5)

  // Steam channels — negative troughs between gear centers
  const channel1 = Math.sin(x * 0.08 + z * 0.05) * Math.cos(x * 0.06 - z * 0.04)
  const channels = Math.min(0, channel1) * 1.2

  // Base undulation — gentle terrain
  const base = Math.sin(x * 0.02) * Math.cos(z * 0.015) * 1.0

  return base + teeth1 + teeth2 + teeth3 + ring1 + ring2 + ring3 + trees + channels
}

// Infinite Staircase — spiral staircase carved into terrain
// Steps rise along -z (camera travel direction) with S-curve corridors
// Wider platforms at "landings" every 4 steps
// Central void drops away, balustrade hints at edges
// Source: TakashiL/Penrose-Stairs (step quantization), impossible-architecture-explorer (Y-warp)
function infiniteStaircaseHeight(x, z) {
  // Step parameters
  const stepPitch = 5.0     // z-distance per step
  const stepHeight = 0.5    // y-height per step
  const corridorWidth = 8   // default corridor width
  const landingWidth = 15   // wider at landings (every 4 steps)

  // Which step are we on? (increases as z decreases = camera moves forward)
  const rawStep = -z / stepPitch
  const stepIndex = Math.floor(rawStep)
  const frac = rawStep - stepIndex

  // Flat tread (85%) then smooth riser (15%)
  // Smoothstep for organic riser feel — not mechanical
  const riserT = frac > 0.85 ? (frac - 0.85) / 0.15 : 0
  const riserSmooth = riserT * riserT * (3 - 2 * riserT) // smoothstep
  const baseHeight = stepIndex * stepHeight + riserSmooth * stepHeight

  // Is this a landing? (every 4 steps = wider platform)
  const isLanding = (stepIndex % 4) === 0
  const effectiveWidth = isLanding ? landingWidth : corridorWidth

  // Gentle S-curve to the staircase — matches camera path curvature
  const curveOffset = Math.sin(z * 0.025) * 6.0
  const dx = x - curveOffset

  // Wall falloff — steep drop outside corridor
  const distFromCenter = Math.abs(dx)
  const wallDrop = distFromCenter > effectiveWidth
    ? -(distFromCenter - effectiveWidth) * 2.0
    : 0

  // Balustrade hint — slight rise at edges (banister feel)
  const edgeInner = effectiveWidth * 0.82
  const edgeOuter = effectiveWidth * 0.98
  const edgeRise = (distFromCenter > edgeInner && distFromCenter <= edgeOuter)
    ? 0.35 * ((distFromCenter - edgeInner) / (edgeOuter - edgeInner))
    : 0

  // Central void — a narrow gap along the center where you can see down
  // Only on non-landing sections (landings are solid platforms)
  const voidWidth = 1.2
  const voidDrop = (!isLanding && distFromCenter < voidWidth)
    ? -6 * (1 - distFromCenter / voidWidth)
    : 0

  // Stone texture — subtle high-frequency noise for worn stone surface
  const stoneNoise = Math.sin(x * 2.1) * Math.cos(z * 1.8) * 0.015
    + Math.sin(x * 5.3 + z * 3.7) * 0.008

  return baseHeight + wallDrop + edgeRise + voidDrop + stoneNoise
}

// Frozen Tundra — wind-sculpted snow dunes, nearly flat
// The flatness IS the point — person against infinity, aurora above
// Subtle sastrugi (wind-carved ridges) + frozen river channels
function frozenTundraHeight(x, z) {
  // Very gentle wind-sculpted dunes — low amplitude, long wavelength
  const dune1 = Math.sin(x * 0.012 + z * 0.008) * 0.4
  const dune2 = Math.sin(x * 0.025 - z * 0.018) * 0.2
  // Sastrugi — wind-carved ridges perpendicular to prevailing wind
  // abs(sin) creates sharp-topped ridges (wind-hardened snow crests)
  const sastrugi = Math.abs(Math.sin(x * 0.06 + 0.7)) * 0.15
  // Frozen river channel — subtle depression along z-axis
  // Gaussian trough centered around x=1 (offset from camera path center)
  const riverDist = (x - 1) * (x - 1)
  const river = -0.3 * Math.exp(-riverDist / 50)
  // Micro-texture: very fine snow ripples
  const ripple = Math.sin(x * 0.15 + z * 0.12) * 0.05
  return dune1 + dune2 + sastrugi + river + ripple
}

// ─── Height function factory ───

const HEIGHT_FN_MAP = {
  'simplex-layers': meadowHeight,
  'simplex-layers-cliff': oceanCliffHeight,
  'diamond-square': stormFieldHeight,
  'simplex-layers-stylized': ghibliHeight,
  'volcanic-caldera': volcanicCalderaHeight,
  'cloud-floor': cloudFloorHeight,
  'paper-fold': paperFoldHeight,
  'cavern-floor': cavernFloorHeight,
  'clockwork-forest': clockworkForestHeight,
  'frozen-tundra': frozenTundraHeight,
  'infinite-staircase': infiniteStaircaseHeight,
}

function getHeightFn(terrainType) {
  return HEIGHT_FN_MAP[terrainType] ?? meadowHeight
}

// Backward-compatible default export (golden meadow)
export function getTerrainHeight(x, z) {
  return meadowHeight(x, z)
}

// ─── Terrain mesh creation ───

export function createTerrain(scene, envConfig = {}) {
  const terrainConfig = envConfig.terrain ?? {}
  const size = terrainConfig.size ?? 400
  const heightFn = getHeightFn(terrainConfig.type)
  // Paper-fold uses fewer segments (64) — larger visible facets = paper faces
  const segments = terrainConfig.type === 'paper-fold' ? 64
    : (terrainConfig.type === 'simplex-layers-cliff' || terrainConfig.type === 'volcanic-caldera' || terrainConfig.type === 'cavern-floor' || terrainConfig.type === 'infinite-staircase') ? 192
    : 128

  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(-Math.PI / 2)

  // Displace vertices with per-world height function
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightFn(pos.getX(i), pos.getZ(i)))
  }
  geometry.computeVertexNormals()

  // ─── Ghibli: quantized vertex colors (3-4 bands) ───
  if (terrainConfig.type === 'simplex-layers-stylized' && terrainConfig.celShaded) {
    const bands = terrainConfig.colorBands ?? 4
    const colors = new Float32Array(pos.count * 3)

    // Find height range
    let minH = Infinity, maxH = -Infinity
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      if (y < minH) minH = y
      if (y > maxH) maxH = y
    }
    const range = maxH - minH || 1

    // Ghibli palette — deep green to bright green to golden tip
    const bandColors = [
      new THREE.Color(0.04, 0.12, 0.03),  // deep shadow green
      new THREE.Color(0.10, 0.28, 0.06),  // mid green
      new THREE.Color(0.22, 0.45, 0.12),  // bright green
      new THREE.Color(0.40, 0.55, 0.18),  // golden-green hilltop
    ]

    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) - minH) / range
      const bandIdx = Math.min(Math.floor(t * bands), bands - 1)
      const c = bandColors[bandIdx] ?? bandColors[bandColors.length - 1]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Ocean cliff: darker cliff face where slope is steep ───
  if (terrainConfig.type === 'simplex-layers-cliff') {
    const colors = new Float32Array(pos.count * 3)
    const normals = geometry.attributes.normal
    const cliffColor = new THREE.Color(0.06, 0.06, 0.04)   // dark rock
    const topColor = new THREE.Color(0.08, 0.12, 0.04)      // cliff-top earth

    for (let i = 0; i < pos.count; i++) {
      // Steepness from normal.y (1 = flat, 0 = vertical)
      const steepness = 1 - normals.getY(i)
      const c = steepness > 0.3 ? cliffColor : topColor
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Volcanic caldera: basalt rock with emissive glow near lava ───
  if (terrainConfig.type === 'volcanic-caldera') {
    const colors = new Float32Array(pos.count * 3)
    const normals = geometry.attributes.normal

    // Volcanic palette: dark basalt → warm glow near crater floor
    const basaltDark = new THREE.Color(0.04, 0.03, 0.03)   // cold dark rock
    const basaltMid = new THREE.Color(0.08, 0.06, 0.04)    // warm basalt
    const lavaGlow = new THREE.Color(0.25, 0.08, 0.02)     // deep orange glow

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      const steepness = 1 - Math.abs(normals.getY(i))

      // Low points near lava get warm glow, high points are cold basalt
      const lavaProximity = Math.max(0, 1 - (y + 6) / 8) // glows below y=-6
      const c = new THREE.Color()
      c.copy(steepness > 0.4 ? basaltDark : basaltMid)
      c.lerp(lavaGlow, lavaProximity * 0.6)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Cloud floor: warm amber gradient, denser toward center ───
  if (terrainConfig.type === 'cloud-floor') {
    const colors = new Float32Array(pos.count * 3)
    // Warm amber cloud haze — brighter near center (light from above), darker at edges
    const cloudBright = new THREE.Color(0.12, 0.08, 0.04) // warm amber haze
    const cloudDark = new THREE.Color(0.04, 0.03, 0.02)   // deep shadow

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      // Radial gradient — brighter near camera path center
      const dist = Math.sqrt(x * x + (z + 60) * (z + 60))
      const brightness = Math.max(0, 1 - dist / 120)
      const c = new THREE.Color().copy(cloudDark).lerp(cloudBright, brightness * 0.6)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Paper fold: cream/ivory vertex colors with slope-based shadow depth ───
  if (terrainConfig.type === 'paper-fold') {
    const colors = new Float32Array(pos.count * 3)
    const normals = geometry.attributes.normal
    // Paper palette: warm cream peaks, cool cream valleys, shadow in creases
    const peakCream = new THREE.Color(0.98, 0.95, 0.88)   // warm ivory peak
    const valleyCream = new THREE.Color(0.92, 0.93, 0.96)  // cool blue-white valley
    const creaseShadow = new THREE.Color(0.85, 0.83, 0.80) // warm shadow in folds

    let minH = Infinity, maxH = -Infinity
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      if (y < minH) minH = y
      if (y > maxH) maxH = y
    }
    const range = maxH - minH || 1

    for (let i = 0; i < pos.count; i++) {
      const heightT = (pos.getY(i) - minH) / range   // 0=valley, 1=peak
      const steepness = 1 - Math.abs(normals.getY(i)) // 0=flat, 1=vertical crease
      // Blend: height drives warm/cool, steepness drives shadow
      const c = new THREE.Color().copy(valleyCream).lerp(peakCream, heightT)
      c.lerp(creaseShadow, steepness * 0.6)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Crystal Cavern: dark stone with purple-teal mineral veins ───
  if (terrainConfig.type === 'cavern-floor') {
    const colors = new Float32Array(pos.count * 3)
    const normals = geometry.attributes.normal

    // Cavern palette: obsidian base with purple/teal mineral streaks
    const obsidian = new THREE.Color(0.04, 0.03, 0.06)      // dark purple-grey stone
    const mineralPurple = new THREE.Color(0.12, 0.04, 0.18)  // amethyst vein
    const mineralTeal = new THREE.Color(0.03, 0.10, 0.12)    // teal mineral deposit
    const poolEdge = new THREE.Color(0.06, 0.05, 0.10)       // slightly lighter near water

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = pos.getY(i)
      const steepness = 1 - Math.abs(normals.getY(i))

      // Base: dark obsidian stone
      const c = new THREE.Color().copy(obsidian)

      // Mineral veins — sine-based streaks across the rock face
      // Purple veins on steep surfaces (exposed mineral faces)
      const purpleVein = Math.abs(Math.sin(x * 0.15 + z * 0.12 + 2.3))
      if (steepness > 0.3 && purpleVein > 0.85) {
        c.lerp(mineralPurple, (purpleVein - 0.85) * 6.0)
      }

      // Teal deposits in lower areas (mineral-rich groundwater)
      const tealDeposit = Math.sin(x * 0.08 + z * 0.06 + 1.1)
      if (y < -56 && tealDeposit > 0.5) {
        c.lerp(mineralTeal, (tealDeposit - 0.5) * 0.4)
      }

      // Lighter stone near pool depressions
      if (y < -57.5) {
        c.lerp(poolEdge, Math.min(1, (-57.5 - y) * 0.5))
      }

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Frozen Tundra: snow white with blue shadows in valleys, aurora tint ───
  if (terrainConfig.type === 'frozen-tundra') {
    const colors = new Float32Array(pos.count * 3)
    const normals = geometry.attributes.normal

    // Snow palette: bright blue-white peaks, deeper blue in shadows/valleys
    const snowBright = new THREE.Color(0.80, 0.84, 0.92)    // blue-white snow
    const snowShadow = new THREE.Color(0.35, 0.42, 0.58)    // blue shadow in dips
    const snowRidge = new THREE.Color(0.85, 0.88, 0.95)     // crisp white ridge tops
    const iceBlue = new THREE.Color(0.45, 0.55, 0.72)       // exposed ice in channels

    let minH = Infinity, maxH = -Infinity
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      if (y < minH) minH = y
      if (y > maxH) maxH = y
    }
    const range = maxH - minH || 1

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      const heightT = (y - minH) / range
      const steepness = 1 - Math.abs(normals.getY(i))

      // Height-driven: valleys darker blue, ridges bright white
      const c = new THREE.Color().copy(snowShadow).lerp(snowBright, heightT)

      // Ridge tops get crisp white highlight
      if (heightT > 0.7) {
        c.lerp(snowRidge, (heightT - 0.7) * 3.0)
      }

      // Steep sastrugi edges show ice-blue
      if (steepness > 0.3) {
        c.lerp(iceBlue, steepness * 0.4)
      }

      // Frozen river channel (low areas near center) — exposed ice
      if (y < minH + range * 0.2) {
        c.lerp(iceBlue, 0.3)
      }

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Clockwork Forest: bronze/copper with patina green in troughs ───
  if (terrainConfig.type === 'clockwork-forest') {
    const colors = new Float32Array(pos.count * 3)
    const normals = geometry.attributes.normal

    // Clockwork palette: dark bronze base, bright copper peaks, patina green in channels
    const bronzeDark = new THREE.Color(0.14, 0.10, 0.05)    // dark bronze
    const copperBright = new THREE.Color(0.45, 0.28, 0.12)   // bright copper peaks
    const patinaGreen = new THREE.Color(0.08, 0.18, 0.10)    // verdigris in troughs
    const organicMoss = new THREE.Color(0.06, 0.22, 0.08)    // organic moss (end of path)

    let minH = Infinity, maxH = -Infinity
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      if (y < minH) minH = y
      if (y > maxH) maxH = y
    }
    const range = maxH - minH || 1

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = pos.getY(i)
      const heightT = (y - minH) / range
      const steepness = 1 - Math.abs(normals.getY(i))

      // Base: height-driven bronze gradient
      const c = new THREE.Color().copy(bronzeDark).lerp(copperBright, heightT * 0.8)

      // Patina in troughs (low areas get green oxidation)
      if (heightT < 0.3) {
        c.lerp(patinaGreen, (0.3 - heightT) * 1.5)
      }

      // Steep gear tooth faces get brighter (polished from friction)
      if (steepness > 0.4) {
        c.lerp(copperBright, steepness * 0.4)
      }

      // Organic transition: more moss/green as z decreases (further along path)
      // Nature reclaims the machine — gradual, not abrupt
      const organicT = Math.max(0, (-z - 80) / 80) // 0 at z=-80, 1 at z=-160
      c.lerp(organicMoss, organicT * 0.35)

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ─── Infinite Staircase: worn stone with moss in cracks, darker risers ───
  if (terrainConfig.type === 'infinite-staircase') {
    const colors = new Float32Array(pos.count * 3)
    const normals = geometry.attributes.normal

    // Stone palette: cool grey base, darker on risers (steep), moss in cracks (low flat)
    const stoneBase = new THREE.Color(0.12, 0.12, 0.14)     // cool grey stone
    const stoneDark = new THREE.Color(0.06, 0.06, 0.08)     // dark stone on risers
    const stoneMoss = new THREE.Color(0.05, 0.10, 0.06)     // dark moss in cracks
    const stoneWorn = new THREE.Color(0.16, 0.15, 0.14)     // lighter worn treads (foot traffic)

    for (let i = 0; i < pos.count; i++) {
      const xv = pos.getX(i)
      const zv = pos.getZ(i)
      const y = pos.getY(i)
      const steepness = 1 - Math.abs(normals.getY(i))

      // Base: cool grey stone
      const c = new THREE.Color().copy(stoneBase)

      // Risers (steep) — darker stone, shadow in the vertical face
      if (steepness > 0.4) {
        c.lerp(stoneDark, Math.min(1, (steepness - 0.4) * 2.5))
      }

      // Worn treads — lighter where feet would walk (center of corridor)
      const curveOffset = Math.sin(zv * 0.025) * 6.0
      const dx = Math.abs(xv - curveOffset)
      if (steepness < 0.15 && dx < 4) {
        c.lerp(stoneWorn, (1 - dx / 4) * 0.4)
      }

      // Moss in cracks — flat surfaces at void edges and balustrade bases
      const mossChance = Math.sin(xv * 0.8 + zv * 0.6 + 1.7)
      if (steepness < 0.1 && mossChance > 0.6) {
        c.lerp(stoneMoss, (mossChance - 0.6) * 1.5)
      }

      // Void edge — darkest where the central gap is
      if (y < -2) {
        c.lerp(stoneDark, Math.min(1, (-2 - y) * 0.15))
      }

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // Material — use vertex colors if available, otherwise flat color
  const hasVertexColors = geometry.attributes.color != null
  const baseColor = terrainConfig.vertexColor
    ? new THREE.Color().setRGB(...terrainConfig.vertexColor)
    : DEFAULT_TERRAIN_COLOR

  // Paper-fold uses MeshPhongMaterial with flatShading for crisp faceted faces
  // Other terrains use MeshLambertMaterial (smoother, cheaper)
  const useFlatShading = terrainConfig.flatShading === true
  const material = useFlatShading
    ? new THREE.MeshPhongMaterial({
        color: hasVertexColors ? 0xffffff : baseColor,
        vertexColors: hasVertexColors,
        flatShading: true,
        side: THREE.FrontSide,
        shininess: 5, // very subtle specular — paper has faint sheen
      })
    : new THREE.MeshLambertMaterial({
        color: hasVertexColors ? 0xffffff : baseColor,
        vertexColors: hasVertexColors,
        side: THREE.FrontSide,
      })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  scene.add(mesh)

  return { mesh, getHeight: heightFn }
}
