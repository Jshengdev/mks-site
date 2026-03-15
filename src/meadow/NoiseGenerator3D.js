// NoiseGenerator3D.js — CPU-generated 128^3 3D Perlin-Worley noise texture
// Stolen from takram/three-clouds + Schneider GDC 2015 Perlin-Worley blend
// Winner: volumetric-cumulus-3d-noise (49/70)
// R = Perlin-Worley shape, G = Worley F1, B = Detail Worley, A = Worley FBM
import * as THREE from 'three'

// ─── Perlin noise (3D, gradient-based) ───
// Adapted from Stefan Gustavson's simplex noise implementation
function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(a, b, t) { return a + t * (b - a) }

// Permutation table (256 entries, doubled for wrapping)
const _p = new Uint8Array(512)
function _seedPermutation(seed) {
  const perm = new Uint8Array(256)
  for (let i = 0; i < 256; i++) perm[i] = i
  // Fisher-Yates shuffle with seed
  let s = seed
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    const tmp = perm[i]
    perm[i] = perm[j]
    perm[j] = tmp
  }
  for (let i = 0; i < 256; i++) {
    _p[i] = perm[i]
    _p[i + 256] = perm[i]
  }
}
_seedPermutation(42)

// 12 gradient vectors for 3D Perlin
const _grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
]

function grad3d(hash, x, y, z) {
  const g = _grad3[hash % 12]
  return g[0] * x + g[1] * y + g[2] * z
}

function perlin3d(x, y, z) {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const Z = Math.floor(z) & 255
  x -= Math.floor(x)
  y -= Math.floor(y)
  z -= Math.floor(z)
  const u = fade(x), v = fade(y), w = fade(z)
  const A = _p[X] + Y, AA = _p[A] + Z, AB = _p[A + 1] + Z
  const B = _p[X + 1] + Y, BA = _p[B] + Z, BB = _p[B + 1] + Z
  return lerp(
    lerp(
      lerp(grad3d(_p[AA], x, y, z), grad3d(_p[BA], x - 1, y, z), u),
      lerp(grad3d(_p[AB], x, y - 1, z), grad3d(_p[BB], x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(grad3d(_p[AA + 1], x, y, z - 1), grad3d(_p[BA + 1], x - 1, y, z - 1), u),
      lerp(grad3d(_p[AB + 1], x, y - 1, z - 1), grad3d(_p[BB + 1], x - 1, y - 1, z - 1), u),
      v
    ),
    w
  )
}

// FBM (fractal Brownian motion)
function perlinFBM(x, y, z, octaves, freq, lacunarity, gain) {
  let sum = 0, amp = 1, maxAmp = 0
  for (let i = 0; i < octaves; i++) {
    sum += perlin3d(x * freq, y * freq, z * freq) * amp
    maxAmp += amp
    freq *= lacunarity
    amp *= gain
  }
  return sum / maxAmp // normalize to ~[-1, 1]
}

// ─── Worley noise (F1 — distance to nearest feature point) ───
// 3D cellular noise, returns 0-1 (0 = on feature point, 1 = far)
function worley3d(x, y, z, freq) {
  const sx = x * freq, sy = y * freq, sz = z * freq
  const ix = Math.floor(sx), iy = Math.floor(sy), iz = Math.floor(sz)
  let minDist = 1e10

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        const cx = ix + dx, cy = iy + dy, cz = iz + dz
        // Hash cell to get feature point (deterministic pseudo-random)
        const h = ((cx * 73856093) ^ (cy * 19349663) ^ (cz * 83492791)) >>> 0
        const fx = cx + ((h & 0xFF) / 255)
        const fy = cy + (((h >> 8) & 0xFF) / 255)
        const fz = cz + (((h >> 16) & 0xFF) / 255)
        const ddx = sx - fx, ddy = sy - fy, ddz = sz - fz
        const dist = ddx * ddx + ddy * ddy + ddz * ddz
        if (dist < minDist) minDist = dist
      }
    }
  }
  return Math.min(1, Math.sqrt(minDist))
}

// Worley FBM
function worleyFBM(x, y, z, freq, octaves) {
  let sum = 0, amp = 1, maxAmp = 0, f = freq
  for (let i = 0; i < octaves; i++) {
    sum += worley3d(x, y, z, f) * amp
    maxAmp += amp
    f *= 2
    amp *= 0.5
  }
  return sum / maxAmp
}

// ─── Generate 128^3 RGBA 3D noise texture ───
// R = Perlin-Worley shape (Schneider remap)
// G = Worley F1 (cellular)
// B = Detail Worley (high-freq erosion)
// A = Worley FBM (secondary detail)
export function generate3DNoiseTexture(size = 128) {
  const data = new Uint8Array(size * size * size * 4)

  // Winner magic values
  const perlinFreq = 4.0
  const perlinOctaves = 4
  const worleyFreq = 6
  const detailWorleyFreq = 12
  const worleyFBMFreq = 8

  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = x / size, ny = y / size, nz = z / size

        // Perlin FBM — large cloud structure
        const perlin = perlinFBM(nx, ny, nz, perlinOctaves, perlinFreq, 2.0, 0.5) * 0.5 + 0.5

        // Worley F1 — cellular billowy edges
        const wF1 = worley3d(nx, ny, nz, worleyFreq)

        // Schneider remap: Perlin-Worley blend for natural cumulus
        // remap(perlin, 1 - worley, 1, 0, 1)
        const pw = Math.max(0, Math.min(1, (perlin - (1 - wF1)) / Math.max(wF1, 0.001)))

        // Detail worley — high-freq erosion
        const detailW = worley3d(nx, ny, nz, detailWorleyFreq)

        // Worley FBM — secondary detail
        const wFBM = worleyFBM(nx, ny, nz, worleyFBMFreq, 3)

        const idx = (z * size * size + y * size + x) * 4
        data[idx + 0] = Math.floor(pw * 255)
        data[idx + 1] = Math.floor(wF1 * 255)
        data[idx + 2] = Math.floor(detailW * 255)
        data[idx + 3] = Math.floor(wFBM * 255)
      }
    }
  }

  const texture = new THREE.Data3DTexture(data, size, size, size)
  texture.format = THREE.RGBAFormat
  texture.type = THREE.UnsignedByteType
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.wrapR = THREE.RepeatWrapping
  texture.needsUpdate = true

  return texture
}
