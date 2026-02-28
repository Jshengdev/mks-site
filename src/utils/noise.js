// src/utils/noise.js
// 2D simplex noise — returns values in [0, 1]

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

const grad3 = [
  [1,1],[-1,1],[1,-1],[-1,-1],
  [1,0],[-1,0],[0,1],[0,-1],
  [1,1],[-1,1],[1,-1],[-1,-1],
]

const p = new Uint8Array(512)
const perm = new Uint8Array(512)

function seed(s) {
  let x = s | 0
  for (let i = 0; i < 256; i++) {
    x ^= x << 13; x ^= x >> 17; x ^= x << 5
    p[i] = (x >>> 0) % 256
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255]
  }
}

seed(42)

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
  if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0) }

  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1) }

  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2) }

  return (70 * (n0 + n1 + n2) + 1) / 2
}

export { seed }
