// StylizedOcean — Cartoon ocean plane with simplex noise foam
// Adapted from thaslle/stylized-water (Ashima simplex, binary foam, wave lines)
// and spacejack/terra water.vert/frag (plane setup, fog integration)
import * as THREE from 'three'
import vertexShader from './shaders/ocean.vert.glsl?raw'
import fragmentShader from './shaders/ocean.frag.glsl?raw'

export default class StylizedOcean {
  constructor(scene, config = {}) {
    const size = config.size ?? 256

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
      uniforms: {
        uTime: { value: 0 },
        uColorNear: { value: new THREE.Color(config.colorNear ?? 0x0a2e3d) },
        uColorFar: { value: new THREE.Color(config.colorFar ?? 0x050d1a) },
        uFoamFreq: { value: config.foamFrequency ?? 2.8 },
        uFoamThreshold: { value: new THREE.Vector2(...(config.foamThreshold ?? [0.08, 0.001])) },
        uWaveLineThreshold: { value: config.waveLineThreshold ?? 0.6 },
        uBobAmplitude: { value: config.bobAmplitude ?? 0.1 },
        uBobSpeed: { value: config.bobSpeed ?? 1.2 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.PlaneGeometry(size, size, 64, 64)
    geometry.rotateX(-Math.PI / 2)

    this.mesh = new THREE.Mesh(geometry, this.material)
    // Position at water level (just below terrain sea level)
    this.mesh.position.y = config.waterLevel ?? -0.5
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
