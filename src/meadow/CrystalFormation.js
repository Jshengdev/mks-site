// Instanced crystal formations — hexagonal prisms with emissive glow
// Adapted from FlowerInstances.js (InstancedMesh pattern)
// Geometry: CylinderGeometry with radialSegments=6 = hexagonal cross-section
// Shader sources:
//   spite — vertex displacement noise (hum/vibration)
//   stemkoski — Schlick's fresnel edge glow
//   Varun Vachhar — iquilez cosine palette iridescence
//   kamilprusko/prism — chromatic dispersion feel
import * as THREE from 'three'
import crystalVertexShader from './shaders/crystal.vert.glsl?raw'
import crystalFragmentShader from './shaders/crystal.frag.glsl?raw'
import { SECTION_T_VALUES } from './constants.js'

const CLEARING_RADIUS = 6 // keep clearings free for content visibility

// Reusable objects — no per-frame allocations (CLAUDE.md rule)
const _dummy = new THREE.Object3D()

export default class CrystalFormation {
  constructor(scene, cameraRig, crystalConfig, getTerrainHeight) {
    this._getTerrainHeight = getTerrainHeight
    this.meshes = []

    const types = crystalConfig.types ?? [{
      name: 'amethyst',
      color: [0.35, 0.10, 0.55],
      emissive: [0.15, 0.04, 0.25],
      count: 120,
      sizeRange: [0.3, 2.5],
      placement: 'floor',
    }]

    const sunDir = new THREE.Vector3(0.1, -1.0, -0.2).normalize()
    const sunColor = new THREE.Color().setRGB(
      ...(crystalConfig._sunColor ?? [0.25, 0.12, 0.70])
    )

    // Shared hexagonal prism geometry — all types use the same shape
    // Per-instance scaling via instanceMatrix handles size variation
    // CylinderGeometry with radialSegments=6 = hexagonal cross-section
    // heightSegments=8 for smooth vertex displacement in shader
    this._sharedGeo = new THREE.CylinderGeometry(
      0.15,  // radiusTop — tapered tip
      0.4,   // radiusBottom — wider base
      1.0,   // height (scaled per instance)
      6,     // radialSegments = hexagonal
      8,     // heightSegments for vertex displacement
      false  // openEnded
    )
    // Shift origin to base so crystals grow upward from placement point
    this._sharedGeo.translate(0, 0.5, 0)

    for (const type of types) {
      const [minSize, maxSize] = type.sizeRange ?? [0.3, 2.5]
      const count = type.count ?? 100

      const material = new THREE.ShaderMaterial({
        vertexShader: crystalVertexShader,
        fragmentShader: crystalFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uHumIntensity: { value: crystalConfig.resonance?.amplitudeScale ?? 0.02 },
          uHumFrequency: { value: 8.0 },
          uColor: { value: new THREE.Color().setRGB(...type.color) },
          uEmissive: { value: new THREE.Color().setRGB(...type.emissive) },
          uSunDirection: { value: sunDir },
          uSunColor: { value: sunColor },
          uBrightness: { value: 1.0 },
        },
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.InstancedMesh(this._sharedGeo, material, count)
      let placed = 0

      for (let i = 0; i < count * 4 && placed < count; i++) {
        const x = (Math.random() - 0.5) * 160
        const z = (Math.random() - 0.5) * 160

        // Skip content clearings
        if (this._inClearing(x, z, cameraRig)) continue

        const y = this._getTerrainHeight(x, z)

        // Random crystal scale within type's size range
        const scale = minSize + Math.random() * (maxSize - minSize)

        _dummy.position.set(x, y, z)
        // Random Y rotation + slight tilt off vertical (10-35 deg)
        // Crystals grow at angles — geological realism
        _dummy.rotation.set(
          (Math.random() - 0.5) * 0.6,   // X tilt: ±17 deg
          Math.random() * Math.PI * 2,    // Y rotation: full
          (Math.random() - 0.5) * 0.6,   // Z tilt: ±17 deg
        )
        // Elongated: taller than wide (crystal prisms are stretched)
        _dummy.scale.set(
          scale * (0.3 + Math.random() * 0.4),  // X: thinner
          scale * (1.5 + Math.random() * 2.0),  // Y: tall — elongated prism
          scale * (0.3 + Math.random() * 0.4),  // Z: thinner
        )
        _dummy.updateMatrix()
        mesh.setMatrixAt(placed, _dummy.matrix)
        placed++
      }

      mesh.count = placed
      mesh.instanceMatrix.needsUpdate = true
      scene.add(mesh)
      this.meshes.push({ mesh, material })
    }
  }

  _inClearing(x, z, cameraRig) {
    for (const t of SECTION_T_VALUES) {
      const clearingPos = cameraRig.curve.getPoint(t)
      const dx = x - clearingPos.x
      const dz = z - clearingPos.z
      if (dx * dx + dz * dz < CLEARING_RADIUS * CLEARING_RADIUS) return true
    }
    return false
  }

  update(elapsed) {
    for (const { material } of this.meshes) {
      material.uniforms.uTime.value = elapsed
    }
  }

  setBrightness(val) {
    for (const { material } of this.meshes) {
      material.uniforms.uBrightness.value = val
    }
  }

  dispose() {
    for (const { mesh, material } of this.meshes) {
      material.dispose()
    }
    this._sharedGeo.dispose()
  }
}
