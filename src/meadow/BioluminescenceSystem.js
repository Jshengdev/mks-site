// BioluminescenceSystem — Glowing plankton particles for the Tide Pool world
// Replaces fireflies as the primary living light source.
// Architecture follows FireflySystem exactly (THREE.Points with ShaderMaterial).
//
// Key differences from FireflySystem:
//   - Multi-color palette (cyan, blue-violet, green, purple) vs single amber
//   - 3D drift (not just vertical bob) — plankton float in all directions
//   - Pulsing brightness (chemical bioluminescence cycle) vs flickering
//   - Current-driven drift direction
//   - Concentrated at depth (more in deep zones, fewer at surface)
//
// Stolen from: Alex-DG/vite-three-webxr-flowers (particle architecture)
import * as THREE from 'three'
import vertexShader from './shaders/bioluminescence.vert.glsl?raw'
import fragmentShader from './shaders/bioluminescence.frag.glsl?raw'

export default class BioluminescenceSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 300
    const colors = config.colors ?? [
      [0.15, 0.75, 0.90],   // cyan
      [0.30, 0.45, 0.85],   // blue-violet
      [0.10, 0.90, 0.60],   // green
      [0.50, 0.20, 0.80],   // deep purple
    ]

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: config.sizeRange?.[1] ?? 6.0 },
        uBrightness: { value: config.brightness ?? 1.5 },
        uDriftSpeed: { value: config.driftSpeed ?? 0.15 },
        uCurrentDir: { value: new THREE.Vector3(0.6, 0.0, 0.8).normalize() },
        uColor0: { value: new THREE.Color(...colors[0]) },
        uColor1: { value: new THREE.Color(...(colors[1] ?? colors[0])) },
        uColor2: { value: new THREE.Color(...(colors[2] ?? colors[0])) },
        uColor3: { value: new THREE.Color(...(colors[3] ?? colors[0])) },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)
    const colorIndices = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across the pool — concentrated at depth
      positions[i * 3 + 0] = (Math.random() - 0.5) * 120
      // Y: biased toward lower half (more bioluminescence at depth)
      // pow(random, 0.5) biases toward higher values → more near floor
      positions[i * 3 + 1] = Math.pow(Math.random(), 0.5) * 7.0 + 0.3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120

      scales[i] = 0.4 + Math.random() * 0.6
      phases[i] = Math.random()   // 0-1, mapped to 0-2PI in shader
      colorIndices[i] = Math.floor(Math.random() * colors.length)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aColorIndex', new THREE.BufferAttribute(colorIndices, 1))

    this.points = new THREE.Points(geometry, this.material)
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000  // ms for shader
  }

  setBrightness(v) {
    this.material.uniforms.uBrightness.value = v
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
