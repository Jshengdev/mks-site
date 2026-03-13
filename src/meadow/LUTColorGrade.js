import { LUT3DEffect } from 'postprocessing'
import * as THREE from 'three'
import lutData from '../assets/luts/slog3-base.cube?raw'

function parseCube(text) {
  const lines = text.split('\n')
  let size = 0
  const data = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('LUT_3D_SIZE')) {
      size = parseInt(trimmed.split(/\s+/)[1])
    } else if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('TITLE') && !trimmed.startsWith('DOMAIN')) {
      const parts = trimmed.split(/\s+/).map(Number)
      if (parts.length === 3 && !isNaN(parts[0])) {
        data.push(parts[0], parts[1], parts[2], 1.0)
      }
    }
  }

  return { size, data: new Float32Array(data) }
}

export function createLUTColorGrade() {
  const { size, data } = parseCube(lutData)

  const texture = new THREE.Data3DTexture(data, size, size, size)
  texture.format = THREE.RGBAFormat
  texture.type = THREE.FloatType
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.wrapR = THREE.ClampToEdgeWrapping
  texture.unpackAlignment = 1
  texture.needsUpdate = true

  const effect = new LUT3DEffect(texture)

  return {
    effect,
    setIntensity(v) { effect.blendMode.opacity.value = v },
    dispose() {
      texture.dispose()
      effect.dispose()
    },
  }
}
