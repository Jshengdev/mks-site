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

// ─── Height function factory ───

const HEIGHT_FN_MAP = {
  'simplex-layers': meadowHeight,
  'simplex-layers-cliff': oceanCliffHeight,
  'diamond-square': stormFieldHeight,
  'simplex-layers-stylized': ghibliHeight,
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
  const segments = terrainConfig.type === 'simplex-layers-cliff' ? 192 : 128

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

  // Material — use vertex colors if available, otherwise flat color
  const hasVertexColors = geometry.attributes.color != null
  const baseColor = terrainConfig.vertexColor
    ? new THREE.Color().setRGB(...terrainConfig.vertexColor)
    : DEFAULT_TERRAIN_COLOR

  const material = new THREE.MeshLambertMaterial({
    color: hasVertexColors ? 0xffffff : baseColor,
    vertexColors: hasVertexColors,
    side: THREE.FrontSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  scene.add(mesh)

  return { mesh, getHeight: heightFn }
}
