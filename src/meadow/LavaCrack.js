// LavaCrack — Glowing fissures on volcanic terrain surface
// Stolen from Ppratik765/liquid-lava-effect (color ramp + FBM crust)
// + mrdoob/three.js webgl_shader_lava (channel overflow glow)
// InstancedMesh of PlaneGeometry strips with pulsing emissive glow
import * as THREE from 'three'
import vertexShader from './shaders/lavaCrack.vert.glsl?raw'
import fragmentShader from './shaders/lavaCrack.frag.glsl?raw'

const _dummy = new THREE.Object3D()

export default class LavaCrack {
  constructor(scene, getTerrainHeight, config = {}) {
    const count = config.count ?? 40
    const pulseSpeed = config.pulseSpeed ?? 1.5
    const pulseIntensity = config.pulseIntensity ?? 0.4
    const crustColor = config.crustColor ?? [0.10, 0.04, 0.02]
    const moltenColor = config.moltenColor ?? [1.0, 0.27, 0.0]
    const glowColor = config.glowColor ?? [1.0, 0.53, 0.0]
    const spreadRadius = config.spreadRadius ?? 50
    const centerX = config.centerX ?? 0
    const centerZ = config.centerZ ?? -60

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

    // Shared geometry — widest/longest crack; per-instance scale handles variation
    const geo = new THREE.PlaneGeometry(0.5, 8.0, 1, 4)

    this.mesh = new THREE.InstancedMesh(geo, this.material, count)
    this.mesh.frustumCulled = false

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 0.7) * spreadRadius
      const x = centerX + Math.cos(angle) * r
      const z = centerZ + Math.sin(angle) * r
      const y = getTerrainHeight(x, z) + 0.05

      // Per-instance scale variation: length 25-100%, width 30-100%
      const lengthScale = 0.25 + Math.random() * 0.75
      const widthScale = 0.30 + Math.random() * 0.70

      _dummy.position.set(x, y, z)
      _dummy.rotation.set(-Math.PI / 2, 0, Math.random() * Math.PI * 2) // flat + random yaw

      // Conform to terrain slope
      const sampleDist = 1.0
      const hFwd = getTerrainHeight(x, z + sampleDist)
      const hRight = getTerrainHeight(x + sampleDist, z)
      _dummy.rotation.x += Math.atan2(hFwd - y, sampleDist) * 0.5
      _dummy.rotation.z += Math.atan2(hRight - y, sampleDist) * 0.5

      _dummy.scale.set(widthScale, lengthScale, 1)
      _dummy.updateMatrix()
      this.mesh.setMatrixAt(i, _dummy.matrix)
    }

    this.mesh.instanceMatrix.needsUpdate = true
    this.scene = scene
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(value) {
    this.mesh.visible = value > 0.01
    this.material.uniforms.uPulseIntensity.value = value * 0.4
  }

  dispose() {
    if (this.mesh) this.scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
