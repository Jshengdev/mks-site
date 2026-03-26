// PetalSystem — Falling cherry blossom petal particles
// Uses sine-wave flutter with spiral descent for natural petal motion
// Each petal has unique phase, size, and drift direction
import * as THREE from 'three'
import particleUtils from './shaders/_particle-utils.glsl?raw'
import vertexShaderSrc from './shaders/petal.vert.glsl?raw'
const vertexShader = particleUtils + '\n' + vertexShaderSrc
import fragmentShader from './shaders/petal.frag.glsl?raw'

export default class PetalSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 300

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uBaseSize: { value: 15.0 },
        uBrightness: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const sizes = new Float32Array(count)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Spread across visible area, starting at various heights
      positions[i * 3 + 0] = (Math.random() - 0.5) * 150
      positions[i * 3 + 1] = Math.random() * 20 + 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150

      phases[i] = Math.random()
      sizes[i] = 0.5 + Math.random() * 1.0

      // Per-petal drift direction
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 2
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))

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
