// Instanced bioluminescent mushrooms — hemisphere cap + thin stem
// Adapted from FlowerInstances.js (InstancedMesh pattern)
// Shader sources:
//   stemkoski — Schlick's fresnel edge glow
//   ektogamat/fake-glow-material — glowInternalRadius, falloffAmount
//   Alex-DG — bioluminescent pulse cycling (sin with phase offset)
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import mushroomVertexShader from './shaders/mushroom.vert.glsl?raw'
import mushroomFragmentShader from './shaders/mushroom.frag.glsl?raw'
import { SECTION_T_VALUES } from './constants.js'

const CLEARING_RADIUS = 6

// Reusable objects — no per-frame allocations
const _dummy = new THREE.Object3D()

// Default bioluminescent mushroom palette — purple-blue-teal
const DEFAULT_MUSHROOM_COLORS = [
  { glow: [0.35, 0.10, 0.55], stem: [0.06, 0.03, 0.10] },  // deep purple
  { glow: [0.15, 0.25, 0.65], stem: [0.04, 0.05, 0.10] },  // blue
  { glow: [0.10, 0.45, 0.50], stem: [0.03, 0.08, 0.08] },  // teal
  { glow: [0.45, 0.15, 0.60], stem: [0.08, 0.03, 0.10] },  // violet
]

export default class GlowMushroom {
  constructor(scene, cameraRig, mushroomConfig, getTerrainHeight) {
    this._getTerrainHeight = getTerrainHeight
    this.meshes = []

    const count = mushroomConfig.count ?? 300
    const colors = mushroomConfig.palette ?? DEFAULT_MUSHROOM_COLORS
    const mushroomsPerColor = Math.floor(count / colors.length)

    // Mushroom geometry: hemisphere cap + thin cylinder stem
    // Cap: SphereGeometry hemisphere (top half only)
    const capGeo = new THREE.SphereGeometry(0.08, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5)
    capGeo.translate(0, 0.15, 0) // sit on top of stem

    // Stem: thin cylinder
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.15, 4)
    stemGeo.translate(0, 0.075, 0) // base at origin

    this._sharedGeo = mergeGeometries([stemGeo, capGeo])
    stemGeo.dispose()
    capGeo.dispose()

    for (let c = 0; c < colors.length; c++) {
      const { glow, stem } = colors[c]

      const material = new THREE.ShaderMaterial({
        vertexShader: mushroomVertexShader,
        fragmentShader: mushroomFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPulseSpeed: { value: mushroomConfig.pulseSpeed ?? 1.5 },
          uGlowColor: { value: new THREE.Color().setRGB(...glow) },
          uStemColor: { value: new THREE.Color().setRGB(...stem) },
          uBrightness: { value: 1.0 },
          uPulseIntensity: { value: mushroomConfig.pulseIntensity ?? 0.4 },
        },
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.InstancedMesh(this._sharedGeo, material, mushroomsPerColor)
      let placed = 0

      for (let i = 0; i < mushroomsPerColor * 4 && placed < mushroomsPerColor; i++) {
        const x = (Math.random() - 0.5) * 140
        const z = (Math.random() - 0.5) * 140

        // Skip content clearings
        if (this._inClearing(x, z, cameraRig)) continue

        const y = this._getTerrainHeight(x, z)

        _dummy.position.set(x, y, z)
        _dummy.rotation.set(
          (Math.random() - 0.5) * 0.2,  // slight X tilt
          Math.random() * Math.PI * 2,   // random Y rotation
          (Math.random() - 0.5) * 0.2,  // slight Z tilt
        )
        // Small — mushrooms are ground cover between crystals
        const scale = 0.5 + Math.random() * 1.5
        _dummy.scale.setScalar(scale)
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
    for (const { material } of this.meshes) {
      material.dispose()
    }
    this._sharedGeo.dispose()
  }
}
