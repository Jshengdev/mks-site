// EmberSystem — Rising volcanic sparks from lava lake
// Stolen from simondevyoutube/ThreeJS_Tutorial_ParticleSystems (lifecycle + color ramp)
// + Alex-DG/vite-three-webxr-flowers (Points + ShaderMaterial pattern)
// Particles RISE from lava surface, cooling from white-yellow to dark red
import * as THREE from 'three'
import vertexShader from './shaders/ember.vert.glsl?raw'
import fragmentShader from './shaders/ember.frag.glsl?raw'

export default class EmberSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 1000
    const riseSpeed = config.riseSpeed ?? 0.15
    const spawnHeight = config.spawnHeight ?? -5.0  // lava surface Y
    const ceilingHeight = config.ceilingHeight ?? 20.0

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: config.size ?? 90 },
        uBrightness: { value: config.brightness ?? 1.5 },
        uRiseSpeed: { value: riseSpeed },
        uSpawnHeight: { value: spawnHeight },
        uCeilingHeight: { value: ceilingHeight },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)
    const lifetimes = new Float32Array(count)

    // Spawn spread — concentrated around crater center
    // Volcanic embers rise from a focused area (the lava lake)
    const spawnRadius = config.spawnRadius ?? 40
    const centerX = config.centerX ?? 0
    const centerZ = config.centerZ ?? -60 // crater center from env config

    for (let i = 0; i < count; i++) {
      // Gaussian-ish distribution — more embers near center
      const angle = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 0.5) * spawnRadius
      positions[i * 3 + 0] = centerX + Math.cos(angle) * r
      positions[i * 3 + 1] = spawnHeight + Math.random() * 2 // slight Y spread at spawn
      positions[i * 3 + 2] = centerZ + Math.sin(angle) * r

      scales[i] = 0.3 + Math.random() * 0.7
      phases[i] = Math.random()
      lifetimes[i] = 0.5 + Math.random() * 0.5 // 50-100% of base speed
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aLifetime', new THREE.BufferAttribute(lifetimes, 1))

    this.points = new THREE.Points(geometry, this.material)
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000 // ms for shader
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
