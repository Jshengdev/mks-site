// IceSpike — Instanced translucent ice formations
// Hexagonal tapered cones with Fresnel rim + SSS translucency
// Stolen from Three.js SubsurfaceScatteringShader (GDC 2011 Dice/Frostbite)
// 50-100 instances, heights 2-15 units, dramatic variation
// Follows FlowerInstances pattern: InstancedMesh + custom ShaderMaterial
import * as THREE from 'three'
import vertexShader from './shaders/ice-spike.vert.glsl?raw'
import fragmentShader from './shaders/ice-spike.frag.glsl?raw'

export default class IceSpike {
  constructor(scene, getTerrainHeight, config = {}) {
    const count = config.count ?? 80
    const iceColor = config.color ?? [0.7, 0.8, 0.95]
    const sssColor = config.sssColor ?? [0.4, 0.6, 0.9]

    // Hexagonal cone — 6 sides for crystal-like cross-section
    const geometry = new THREE.ConeGeometry(1, 1, 6, 1)
    // Move origin to base so scaling works from ground up
    geometry.translate(0, 0.5, 0)

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uBrightness: { value: 1.0 },
        uSunDirection: { value: new THREE.Vector3(0.0, 0.21, -1.0).normalize() },
        uSunColor: { value: new THREE.Color(0.25, 0.30, 0.50) },
        uIceColor: { value: new THREE.Color(...iceColor) },
        uSSSColor: { value: new THREE.Color(...sssColor) },
        uFresnelPower: { value: 3.0 },
      },
      vertexShader,
      fragmentShader,
    })

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count)
    const dummy = new THREE.Object3D()
    let placed = 0

    for (let i = 0; i < count * 4 && placed < count; i++) {
      const x = (Math.random() - 0.5) * 300
      const z = (Math.random() - 0.5) * 300
      const y = getTerrainHeight(x, z)

      // Dramatic height variation: 2-15 units
      // pow(random, 0.7) biases toward taller spikes — more dramatic
      const height = 2 + Math.pow(Math.random(), 0.7) * 13
      // Base radius proportional to height (thinner = more crystalline)
      const radius = height * (0.05 + Math.random() * 0.07)

      dummy.position.set(x, y, z)
      // Slight random tilt (1-5 degrees) — frozen at angle
      dummy.rotation.x = (Math.random() - 0.5) * 0.09
      dummy.rotation.z = (Math.random() - 0.5) * 0.09
      dummy.rotation.y = Math.random() * Math.PI * 2
      dummy.scale.set(radius, height, radius)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(placed, dummy.matrix)
      placed++
    }

    this.mesh.count = placed
    this.mesh.instanceMatrix.needsUpdate = true
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(value) {
    this.material.uniforms.uBrightness.value = value
    this.mesh.visible = value > 0.01
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
