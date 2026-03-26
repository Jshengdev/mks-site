// VoidParticle — 3000 tiny points in fibonacci sphere, glacial rotation
// Stolen from: stephanbogner fibonacci sphere distribution,
// Alex-DG firefly approach, codecruzer starfield depth sizing
import * as THREE from 'three'
import vertexShader from './shaders/voidParticle.vert.glsl?raw'
import fragmentShader from './shaders/voidParticle.frag.glsl?raw'

export default class VoidParticle {
  constructor(scene, config = {}) {
    const count = config.count ?? 3000
    const spread = config.spread ?? 150
    const color = config.color ?? [0.690, 0.784, 0.878]

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: config.sizeRange?.[1] ?? 40 },
        uBrightness: { value: config.brightness ?? 0.4 },
        uColor: { value: new THREE.Color(...color) },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)

    // Fibonacci sphere distribution (stephanbogner pattern)
    // Golden angle = PI * (3 - sqrt(5)) ≈ 2.39996 — even distribution, no polar clumping
    const golden = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < count; i++) {
      const y = (i / count) * 2 - 1
      const r = Math.sqrt(1 - y * y)
      const theta = i * golden
      // Shell thickness: radius between 30-100% of spread
      const radius = spread * (0.3 + Math.random() * 0.7)

      positions[i * 3] = Math.cos(theta) * r * radius
      positions[i * 3 + 1] = y * radius
      positions[i * 3 + 2] = Math.sin(theta) * r * radius - 50 // offset along camera path

      scales[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    this.points = new THREE.Points(geometry, this.material)

    // Slow rotation group — the whole sphere rotates glacially
    this.group = new THREE.Group()
    this.group.add(this.points)
    this.scene = scene
    scene.add(this.group)

    this._rotationSpeed = config.rotationSpeed ?? 0.01
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000
    // Glacial rotation — barely perceptible, creates sense of floating
    this.group.rotation.y = elapsed * this._rotationSpeed
    this.group.rotation.x = Math.sin(elapsed * 0.05) * 0.1
  }

  dispose() {
    if (this.group) this.scene.remove(this.group)
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
