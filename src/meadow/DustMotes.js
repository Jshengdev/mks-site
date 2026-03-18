// src/meadow/DustMotes.js
// Floating dust / petal particles catching sunlight
// + depth-density gradient for underwater marine snow
// Stolen from L16 particle patterns + Alex-DG firefly approach
import * as THREE from 'three'
import vertexShader from './shaders/dustMote.vert.glsl?raw'
import fragmentShader from './shaders/dustMote.frag.glsl?raw'

export default class DustMotes {
  constructor(scene, count = 300, config = {}) {
    const heightRange = config.heightRange ?? [0.5, 4.0]
    const surfaceY = config.surfaceY ?? 0.0
    const depthDensity = config.depthDensity ?? 0.0
    const color = config.color ?? [1.0, 0.95, 0.8] // warm white-gold default
    const spreadX = config.spreadX ?? 80
    const spreadZ = config.spreadZ ?? 160

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 35 },
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
    const phases = new Float32Array(count)

    const hMin = heightRange[0]
    const hMax = heightRange[1]

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spreadX
      positions[i * 3 + 1] = Math.random() * (hMax - hMin) + hMin
      positions[i * 3 + 2] = -Math.random() * spreadZ
      scales[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    this.points = new THREE.Points(geometry, this.material)
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
