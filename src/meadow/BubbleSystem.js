// BubbleSystem — Rising bubble particles for the Tide Pool world
// Small translucent spheres that slowly ascend toward the water surface.
// Architecture follows FireflySystem/DustMotes pattern.
import * as THREE from 'three'
import vertexShader from './shaders/bubble.vert.glsl?raw'
import fragmentShader from './shaders/bubble.frag.glsl?raw'

export default class BubbleSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 80

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uRiseSpeed: { value: config.riseSpeed ?? 0.5 },
        uWobbleFrequency: { value: config.wobbleFrequency ?? 2.0 },
        uWobbleAmplitude: { value: config.wobbleAmplitude ?? 0.3 },
        uSurfaceHeight: { value: config.surfaceHeight ?? 8.0 },
        uOpacity: { value: config.opacity ?? 0.3 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across pool floor — bubbles originate from rocks/anemones
      positions[i * 3 + 0] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = Math.random() * 0.5  // start near floor
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      scales[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random()
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

  setOpacity(v) {
    this.material.uniforms.uOpacity.value = v
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
