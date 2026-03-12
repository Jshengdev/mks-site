// Adapted from Alex-DG/vite-three-webxr-flowers FirefliesMaterial
import * as THREE from 'three'
import vertexShader from './shaders/firefly.vert.glsl?raw'
import fragmentShader from './shaders/firefly.frag.glsl?raw'

export default class FireflySystem {
  constructor(scene, count = 500) {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 80 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across the meadow, constrained low in grass
      positions[i * 3 + 0] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = Math.random() * 1.2 + 0.3  // 0.3→1.5 height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      scales[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    this.points = new THREE.Points(geometry, this.material)
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000 // ms for Alex-DG shader
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
