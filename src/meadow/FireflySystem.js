// Adapted from Alex-DG/vite-three-webxr-flowers FirefliesMaterial
// + depth-density gradient for underwater plankton (more plankton deeper)
// + configurable color (amber meadow, teal-green underwater, etc.)
import * as THREE from 'three'
import vertexShader from './shaders/firefly.vert.glsl?raw'
import fragmentShader from './shaders/firefly.frag.glsl?raw'

export default class FireflySystem {
  constructor(scene, count = 500, config = {}) {
    const heightRange = config.heightRange ?? [0.3, 1.5]
    const surfaceY = config.surfaceY ?? 0.0
    const depthDensity = config.depthDensity ?? 0.0
    const color = config.color ?? [0.83, 0.79, 0.41] // warm amber default
    const spreadRange = config.spreadRange ?? 200

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 80 },
        uBrightness: { value: 1.0 },
        uSurfaceY: { value: surfaceY },
        uDepthDensity: { value: depthDensity },
        uColor: { value: new THREE.Color(...color) },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    const hMin = heightRange[0]
    const hMax = heightRange[1]

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spreadRange
      positions[i * 3 + 1] = Math.random() * (hMax - hMin) + hMin
      positions[i * 3 + 2] = (Math.random() - 0.5) * spreadRange
      scales[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    this.points = new THREE.Points(geometry, this.material)
    this.scene = scene
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000 // ms for Alex-DG shader
  }

  dispose() {
    if (this.points) this.scene.remove(this.points)
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
