// Instanced crystal formations — hexagonal prisms growing in CLUSTERS
// Adapted from FlowerInstances.js (InstancedMesh pattern)
// Geometry: CylinderGeometry with radialSegments=6 = hexagonal cross-section
//
// CLUSTER GROWTH: crystals grow in groups of 3-7 from a common base point,
// radiating outward at varied angles — like real geode interiors and Minecraft
// amethyst geodes. Each cluster has one dominant central crystal (tallest) with
// smaller satellites tilting outward. This is the #1 visual signature of the
// reference: scattered individuals → geological formations.
//
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

// Cluster generation constants
// Constrained randomness (creative coding principle #3):
//   cluster size 3-7, spread 0.3-1.2, tilt 15-45 deg
const CLUSTER_SIZE_MIN = 3
const CLUSTER_SIZE_MAX = 7
const CLUSTER_SPREAD_MIN = 0.3   // how close satellites sit to center
const CLUSTER_SPREAD_MAX = 1.2   // max radial offset from center
const SATELLITE_TILT_MIN = 0.26  // ~15 deg — slight lean outward
const SATELLITE_TILT_MAX = 0.78  // ~45 deg — dramatic splay
const CENTRAL_SCALE_BOOST = 1.4  // central crystal is 40% larger than range midpoint

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
          uPulseIntensity: { value: 0.0 },
        },
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.InstancedMesh(this._sharedGeo, material, count)
      let placed = 0

      // ─── Cluster-based placement ───
      // Instead of scattering individual crystals, generate cluster centers
      // and grow 3-7 crystals from each. Geode visual signature.
      const avgClusterSize = (CLUSTER_SIZE_MIN + CLUSTER_SIZE_MAX) / 2
      const numClusters = Math.ceil(count / avgClusterSize)
      let attempts = 0
      const maxAttempts = numClusters * 6

      while (placed < count && attempts < maxAttempts) {
        attempts++

        // Pick cluster center
        const cx = (Math.random() - 0.5) * 160
        const cz = (Math.random() - 0.5) * 160

        if (this._inClearing(cx, cz, cameraRig)) continue

        const cy = this._getTerrainHeight(cx, cz)

        // Cluster size: 3-7 crystals (constrained random)
        const clusterSize = CLUSTER_SIZE_MIN +
          Math.floor(Math.random() * (CLUSTER_SIZE_MAX - CLUSTER_SIZE_MIN + 1))
        // Shared Y rotation for the cluster base — geological consistency
        const clusterBaseYaw = Math.random() * Math.PI * 2
        // Cluster spread scales with crystal size — larger crystals spread more
        const spreadScale = minSize < 0.5 ? 0.6 : 1.0

        for (let c = 0; c < clusterSize && placed < count; c++) {
          const isCentral = c === 0

          // ─── Position within cluster ───
          let px, pz
          if (isCentral) {
            // Central crystal sits at cluster origin
            px = cx
            pz = cz
          } else {
            // Satellites radiate outward from center
            // Angle: evenly spaced around center + jitter for organic feel
            const baseAngle = clusterBaseYaw +
              (c / (clusterSize - 1)) * Math.PI * 2
            const jitter = (Math.random() - 0.5) * 0.5  // ±14 deg jitter
            const angle = baseAngle + jitter
            // Distance: between min and max spread, scaled by type
            const dist = (CLUSTER_SPREAD_MIN +
              Math.random() * (CLUSTER_SPREAD_MAX - CLUSTER_SPREAD_MIN)) * spreadScale
            px = cx + Math.cos(angle) * dist
            pz = cz + Math.sin(angle) * dist
          }

          const py = this._getTerrainHeight(px, pz)

          // ─── Scale within cluster ───
          let scale
          if (isCentral) {
            // Central crystal: largest in cluster — the anchor
            // Biased toward top of size range × boost
            const midScale = (minSize + maxSize) * 0.5
            scale = midScale * CENTRAL_SCALE_BOOST *
              (0.85 + Math.random() * 0.3) // 85-115% of boosted mid
          } else {
            // Satellites: smaller, more varied
            // Biased toward lower half of range (satellites are subordinate)
            const t = Math.random() * Math.random() // quadratic bias → smaller
            scale = minSize + t * (maxSize - minSize)
          }

          // ─── Rotation within cluster ───
          let tiltX, tiltZ
          if (isCentral) {
            // Central crystal: nearly vertical — slight organic wobble
            tiltX = (Math.random() - 0.5) * 0.15  // ±4 deg
            tiltZ = (Math.random() - 0.5) * 0.15
          } else {
            // Satellites tilt OUTWARD from cluster center
            // Tilt direction = away from center, magnitude = constrained range
            const awayAngle = Math.atan2(pz - cz, px - cx)
            const tiltMag = SATELLITE_TILT_MIN +
              Math.random() * (SATELLITE_TILT_MAX - SATELLITE_TILT_MIN)
            tiltX = Math.cos(awayAngle) * tiltMag
            tiltZ = Math.sin(awayAngle) * tiltMag
          }

          _dummy.position.set(px, py, pz)
          _dummy.rotation.set(
            tiltX,
            clusterBaseYaw + Math.random() * 0.8,  // shared base + variation
            tiltZ,
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

  setPulseIntensity(val) {
    for (const { material } of this.meshes) {
      material.uniforms.uPulseIntensity.value = val
    }
  }

  dispose() {
    for (const { mesh, material } of this.meshes) {
      material.dispose()
    }
    this._sharedGeo.dispose()
  }
}
