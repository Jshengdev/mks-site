// SnowParticle — Gentle falling snow with sinusoidal drift
// Adapted from SahilK-027/Elemental-Serenity SnowSystem
// Fall speed ~10x slower than rain, 3x more lateral drift, round flakes
// Uses same Points/ShaderMaterial pattern as FireflySystem and RainSystem
import * as THREE from 'three'
import vertexShader from './shaders/snow.vert.glsl?raw'
import fragmentShader from './shaders/snow.frag.glsl?raw'

export default class SnowParticle {
  constructor(scene, config = {}) {
    const count = config.count ?? 800
    const color = config.color ?? [0.9, 0.92, 1.0]
    const auroraResponse = config.auroraResponse ?? 0.3

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uBrightness: { value: 1.0 },
        uAuroraColor: { value: new THREE.Color(...color) },
        uAuroraResponse: { value: auroraResponse },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across wide area (matching terrain size)
      positions[i * 3 + 0] = (Math.random() - 0.5) * 260
      positions[i * 3 + 1] = Math.random() * 32
      positions[i * 3 + 2] = (Math.random() - 0.5) * 260

      // Phase offset — desynchronizes each flake
      phases[i] = Math.random()
      // Speed variation — some flakes drift faster
      // Range: 0.6→1.4 (Elemental-Serenity: -0.8 to -2.0 mapped)
      speeds[i] = 0.6 + Math.random() * 0.8
      // Size variation — 2→6 pixel range (larger than rain drops)
      sizes[i] = 2.0 + Math.random() * 4.0
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    this.points = new THREE.Points(geometry, this.material)
    this.scene = scene
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setAuroraColor(r, g, b) {
    this.material.uniforms.uAuroraColor.value.setRGB(r, g, b)
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
