// MarineSnow — The endless rain of organic detritus from the surface
// Adapted from jpweeks/particulate-medusae (looping fall + sinusoidal wander)
// + madmappersoftware/MadMapper-Materials MarineSnow.fs (3D hash field, 10% cell density)
// 2000 tiny white particles drifting DOWNWARD very slowly
// Barely visible — you notice them only when you stop looking
// The only connection to the sunlit surface world
import * as THREE from 'three'
import vertexShader from './shaders/marineSnow.vert.glsl?raw'
import fragmentShader from './shaders/marineSnow.frag.glsl?raw'

export default class MarineSnow {
  constructor(scene, config = {}) {
    const count = config.count ?? 2000

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: config.size ?? 15 },
        uBrightness: { value: 0.3 },
        uFallSpeed: { value: config.fallSpeed ?? 0.15 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across the full world volume
      positions[i * 3 + 0] = (Math.random() - 0.5) * 160
      positions[i * 3 + 1] = Math.random() * 20         // 0-20 height
      positions[i * 3 + 2] = -Math.random() * 200       // along descent

      // Size: tiny specks (0.02-0.08 world units equivalent)
      scales[i] = 0.2 + Math.random() * 0.8
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
