// LavaCrack — Glowing fissures on volcanic terrain surface
// Stolen from Ppratik765/liquid-lava-effect (color ramp + FBM crust)
// + mrdoob/three.js webgl_shader_lava (channel overflow glow)
// PlaneGeometry strips placed on terrain with pulsing emissive glow
import * as THREE from 'three'
import vertexShader from './shaders/lavaCrack.vert.glsl?raw'
import fragmentShader from './shaders/lavaCrack.frag.glsl?raw'

const _dummy = new THREE.Object3D()

export default class LavaCrack {
  constructor(scene, getTerrainHeight, config = {}) {
    this.meshes = []

    const count = config.count ?? 40
    const pulseSpeed = config.pulseSpeed ?? 1.5
    const pulseIntensity = config.pulseIntensity ?? 0.4
    const crustColor = config.crustColor ?? [0.10, 0.04, 0.02]
    const moltenColor = config.moltenColor ?? [1.0, 0.27, 0.0]
    const glowColor = config.glowColor ?? [1.0, 0.53, 0.0]
    const spreadRadius = config.spreadRadius ?? 50
    const centerX = config.centerX ?? 0
    const centerZ = config.centerZ ?? -60

    // Shared material — all cracks pulse together (unified lava system)
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uPulseSpeed: { value: pulseSpeed },
        uPulseIntensity: { value: pulseIntensity },
        uMoltenColor: { value: new THREE.Vector3(...moltenColor) },
        uGlowColor: { value: new THREE.Vector3(...glowColor) },
        uCrustColor: { value: new THREE.Vector3(...crustColor) },
      },
      vertexShader,
      fragmentShader,
    })

    // Generate crack strip meshes on the terrain surface
    // Each crack = narrow PlaneGeometry, randomly placed and rotated
    for (let i = 0; i < count; i++) {
      // Random position within crater area
      const angle = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 0.7) * spreadRadius
      const x = centerX + Math.cos(angle) * r
      const z = centerZ + Math.sin(angle) * r
      const y = getTerrainHeight(x, z) + 0.05 // just above terrain surface

      // Random crack dimensions — long and thin
      const length = 2.0 + Math.random() * 6.0  // 2-8 units long
      const width = 0.15 + Math.random() * 0.35  // 0.15-0.5 units wide

      const geo = new THREE.PlaneGeometry(width, length, 1, 4)
      const mesh = new THREE.Mesh(geo, this.material)

      // Position on terrain, rotated to lie flat, with random Y rotation
      mesh.position.set(x, y, z)
      mesh.rotation.x = -Math.PI / 2 // flat on ground
      mesh.rotation.z = Math.random() * Math.PI * 2 // random orientation

      // Conform to terrain slope — sample nearby height for tilt
      const sampleDist = 1.0
      const hFwd = getTerrainHeight(x, z + sampleDist)
      const hRight = getTerrainHeight(x + sampleDist, z)
      const slopeX = Math.atan2(hRight - y, sampleDist) * 0.5
      const slopeZ = Math.atan2(hFwd - y, sampleDist) * 0.5
      mesh.rotation.x += slopeZ
      mesh.rotation.z += slopeX

      scene.add(mesh)
      this.meshes.push(mesh)
    }
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(value) {
    for (const mesh of this.meshes) {
      mesh.visible = value > 0.01
    }
    this.material.uniforms.uPulseIntensity.value = value * 0.4
  }

  dispose() {
    for (const mesh of this.meshes) {
      mesh.geometry.dispose()
    }
    this.material.dispose()
  }
}
