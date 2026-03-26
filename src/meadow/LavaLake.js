// LavaLake — Molten magma surface sitting in the caldera crater floor
// Uses lava.vert.glsl (viscous heave displacement) + lava.frag.glsl (simplex crust + pulse)
// The foundational visual of the volcanic observatory — "fire below"
// Adapted from thaslle/stylized-water (plane mesh pattern) + DenizTC/GLSL-Lava-Shader concepts
import * as THREE from 'three'
import vertexShader from './shaders/lava.vert.glsl?raw'
import fragmentShader from './shaders/lava.frag.glsl?raw'

export default class LavaLake {
  constructor(scene, config = {}) {
    const size = config.size ?? 80

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
      uniforms: {
        uTime: { value: 0 },
        uCrustColor: { value: new THREE.Vector3(...(config.crustColor ?? [0.10, 0.04, 0.02])) },
        uMoltenColor: { value: new THREE.Vector3(...(config.moltenColor ?? [1.0, 0.27, 0.0])) },
        uGlowColor: { value: new THREE.Vector3(...(config.glowColor ?? [1.0, 0.53, 0.0])) },
        uCrustFreq: { value: config.crustFreq ?? 1.8 },
        uCrustThreshold: { value: config.crustThreshold ?? 0.35 },
        uPulseSpeed: { value: config.pulseSpeed ?? 0.3 },
        uPulseIntensity: { value: config.pulseIntensity ?? 0.4 },
        uHeaveAmplitude: { value: config.heaveAmplitude ?? 0.3 },
        uHeaveSpeed: { value: config.heaveSpeed ?? 0.4 },
        uEmissive: { value: 1.5 },
      },
      vertexShader,
      fragmentShader,
    })

    // 48x48 segments gives enough resolution for visible heave displacement
    // without being excessive (2304 vertices — negligible GPU cost)
    const geometry = new THREE.PlaneGeometry(size, size, 48, 48)
    geometry.rotateX(-Math.PI / 2)

    this.mesh = new THREE.Mesh(geometry, this.material)
    // Position at crater floor — lava sits below the rim
    const lavaLevel = config.lavaLevel ?? -7.0
    this.mesh.position.set(0, lavaLevel, config.centerZ ?? -60)
    this.scene = scene
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setEmissive(value) {
    this.material.uniforms.uEmissive.value = value
    this.mesh.visible = value > 0.01
  }

  dispose() {
    if (this.mesh) this.scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
