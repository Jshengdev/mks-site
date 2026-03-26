// Steam vents — ground-level particle emitters shooting white steam upward in bursts
// Particles rise, expand, drift laterally, fade — then loop
// Adapted from: stemkoski/ParticleEngine (lifecycle), SqrtPapere/SmokeGL (chaotic dispersal)
import * as THREE from 'three'
import particleUtils from './shaders/_particle-utils.glsl?raw'
import vertexShaderSrc from './shaders/steam-vent.vert.glsl?raw'
const vertexShader = particleUtils + '\n' + vertexShaderSrc
import fragmentShader from './shaders/steam-vent.frag.glsl?raw'

export default class SteamVent {
  constructor(scene, getTerrainHeight, config = {}) {
    const totalParticles = config.count ?? 400
    const ventCount = config.ventCount ?? 12
    const particlesPerVent = Math.floor(totalParticles / ventCount)
    const color = config.color ?? [0.85, 0.80, 0.75]

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 50 },
        uColor: { value: new THREE.Color().setRGB(...color) },
        uBrightness: { value: 0.4 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const count = ventCount * particlesPerVent
    const positions = new Float32Array(count * 3)
    const lifeOffsets = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let v = 0; v < ventCount; v++) {
      const vx = (Math.random() - 0.5) * 120
      const vz = (Math.random() - 0.5) * 120
      const vy = getTerrainHeight(vx, vz) + 0.1

      for (let p = 0; p < particlesPerVent; p++) {
        const idx = v * particlesPerVent + p
        // Slight spread around vent center
        positions[idx * 3 + 0] = vx + (Math.random() - 0.5) * 0.8
        positions[idx * 3 + 1] = vy
        positions[idx * 3 + 2] = vz + (Math.random() - 0.5) * 0.8
        lifeOffsets[idx] = Math.random()
        speeds[idx] = 0.7 + Math.random() * 0.6
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aLifeOffset', new THREE.BufferAttribute(lifeOffsets, 1))
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))

    this.points = new THREE.Points(geometry, this.material)
    this.scene = scene
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose() {
    if (this.points) this.scene.remove(this.points)
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
