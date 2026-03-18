// AnglerLight — Distant bobbing lure lights in the deep
// Adapted from paulrobello/par-term (floating particles, pendulum technique)
// + drahcc/ppgsoFinal (point light attenuation: 1/(1 + 0.09d + 0.032d^2))
// Warm amber-yellow points against blue-black void — the ONLY warmth in the abyss
// Each lure bobs on a pendulum swing + breathes in brightness
import * as THREE from 'three'
import vertexShader from './shaders/anglerLight.vert.glsl?raw'
import fragmentShader from './shaders/anglerLight.frag.glsl?raw'

export default class AnglerLight {
  constructor(scene, config = {}) {
    const count = config.count ?? 12

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: config.lureSize ? config.lureSize * 100 : 300 },
        uBrightness: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Place at distance from camera path center (30-80 units away)
      // Stolen from config: distance: [30, 80]
      const angle = Math.random() * Math.PI * 2
      const dist = 30 + Math.random() * 50
      positions[i * 3 + 0] = Math.cos(angle) * dist
      positions[i * 3 + 1] = 1.0 + Math.random() * 5.0 // 1-6 height
      positions[i * 3 + 2] = -Math.random() * 180 - 20  // spread along Z descent

      scales[i] = 0.5 + Math.random() * 0.5
      phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

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
