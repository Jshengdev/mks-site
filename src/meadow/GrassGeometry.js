// src/meadow/GrassGeometry.js
// Blade geometry generator — adapted from Nitash-Biswas/grass-shader-glsl
import * as THREE from 'three'

const HALF_WIDTH = 0.035
const HEIGHT = 1.0
const TAPER = 0.003

// Reusable Object3D for instance matrix computation (avoids per-call allocation)
const _dummy = new THREE.Object3D()

/**
 * Creates a tapered triangle strip blade geometry.
 * @param {number} segments - Number of height segments (7 = high detail, 1 = low)
 * @returns {THREE.BufferGeometry}
 */
export function createBladeGeometry(segments) {
  const positions = []

  for (let i = 0; i < segments; i++) {
    const y0 = (i / segments) * HEIGHT
    const y1 = ((i + 1) / segments) * HEIGHT
    const w0 = HALF_WIDTH - TAPER * i
    const w1 = HALF_WIDTH - TAPER * (i + 1)

    if (i < segments - 1) {
      // Quad as two triangles
      positions.push(
        -w0, y0, 0,  w0, y0, 0,  -w1, y1, 0,
        -w1, y1, 0,  w0, y0, 0,   w1, y1, 0
      )
    } else {
      // Tip triangle
      positions.push(-w0, y0, 0, w0, y0, 0, 0, y1, 0)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Generates instance matrices for a chunk of grass.
 * @param {number} count - Number of blades
 * @param {number} chunkSize - World units per chunk side
 * @param {number} offsetX - Chunk world X offset
 * @param {number} offsetZ - Chunk world Z offset
 * @param {Function} getHeight - Function(x, z) → terrain height
 * @returns {Float32Array} Instance matrices (count × 16)
 */
export function generateInstanceMatrices(count, chunkSize, offsetX, offsetZ, getHeight) {
  const matrices = new Float32Array(count * 16)

  for (let i = 0; i < count; i++) {
    const x = offsetX + (Math.random() - 0.5) * chunkSize
    const z = offsetZ + (Math.random() - 0.5) * chunkSize
    const y = getHeight(x, z)

    _dummy.position.set(x, y, z)
    _dummy.rotation.y = Math.random() * Math.PI * 2
    _dummy.scale.setScalar(0.8 + Math.random() * 0.4)
    _dummy.updateMatrix()
    _dummy.matrix.toArray(matrices, i * 16)
  }

  return matrices
}
