// AshSystem — Slow-falling grey volcanic ash particles
// Adapted from DustMotes pattern + creativelifeform/three-nebula snow physics
// + hzy5000 campfire smoke emitter values
// NormalBlending (not additive) — ash occludes light, doesn't glow
import * as THREE from 'three'
import vertexShader from './shaders/ash.vert.glsl?raw'
import fragmentShader from './shaders/ash.frag.glsl?raw'

export default class AshSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 500
    const fallSpeed = config.fallSpeed ?? 0.8

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NormalBlending, // ash occludes, doesn't glow
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: config.size ?? 30 },
        uBrightness: { value: config.brightness ?? 1.0 },
        uFallSpeed: { value: fallSpeed },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)

    // Spawn across a wide area above the scene
    // Ash comes from everywhere — not concentrated like embers
    const spreadX = config.spreadX ?? 120
    const spreadZ = config.spreadZ ?? 120
    const baseHeight = config.baseHeight ?? 15

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spreadX
      positions[i * 3 + 1] = Math.random() * baseHeight + 2.0 // 2-17m height
      positions[i * 3 + 2] = -Math.random() * spreadZ - 20 // offset toward crater
      scales[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    this.points = new THREE.Points(geometry, this.material)
    this.scene = scene
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(value) {
    this.material.uniforms.uBrightness.value = value
    this.points.visible = value > 0.01
  }

  dispose() {
    if (this.points) this.scene.remove(this.points)
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
