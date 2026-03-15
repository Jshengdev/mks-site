// RainSystem — Velocity-stretched rain particle streaks
// Adapted from three.quarks velocity-stretched billboards concept
// and standard particle rain techniques (seeded random phase offsets)
import * as THREE from 'three'
import vertexShader from './shaders/rain.vert.glsl?raw'
import fragmentShader from './shaders/rain.frag.glsl?raw'

export default class RainSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 2000
    // Research winner values: rainSpeed=15, windX=3, lengthFactor=30
    const velocity = config.velocity ?? [3.0, -15.0, 0.5]
    const lengthFactor = config.lengthFactor ?? 30.0

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uVelocity: { value: new THREE.Vector3(...velocity) },
        uLengthFactor: { value: lengthFactor },
        uBounds: { value: new THREE.Vector2(200, 200) },
        uBrightness: { value: 0.7 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across visible area
      positions[i * 3 + 0] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = Math.random() * 25  // random start height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200

      // Phase offset — desynchronizes particles
      phases[i] = Math.random()

      // Speed variation — some drops fall faster
      speeds[i] = 0.7 + Math.random() * 0.6
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))

    this.points = new THREE.Points(geometry, this.material)
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
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
