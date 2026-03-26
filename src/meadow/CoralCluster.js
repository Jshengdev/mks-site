// CoralCluster.js — Branching coral formations for underwater worlds
// Geometry: L-system-inspired recursive branching tubes (yomboprime/coral-growth)
// Colors: warm bioluminescent palette (orange, pink, red, purple, amber)
// Instanced per coral type for GPU efficiency
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import vertexShader from './shaders/coral.vert.glsl?raw'
import fragmentShader from './shaders/coral.frag.glsl?raw'

const _dummy = new THREE.Object3D()
const _direction = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _up = new THREE.Vector3(0, 1, 0)

// Generate a single branching coral geometry
// L-system: F -> F[+F][-F] with random angle variation
// (adapted from Codrops/EZ-Tree taper + FrancescoGradi L-system grammar)
function createBranchingCoral(type, rng) {
  const geometries = []

  function addBranch(origin, direction, radius, length, depth, maxDepth) {
    if (depth > maxDepth || radius < 0.02) return

    // Create cylinder segment for this branch
    const seg = new THREE.CylinderGeometry(
      radius * 0.6,  // top radius (taper — Codrops taper technique)
      radius,         // bottom radius
      length,
      5,              // radial segments (low poly — underwater murk hides detail)
      1
    )

    // Orient cylinder along direction vector
    _direction.copy(direction)
    if (Math.abs(_direction.dot(_up)) > 0.999) {
      _quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0)
    } else {
      _quat.setFromUnitVectors(_up, _direction.normalize())
    }

    seg.applyQuaternion(_quat)
    seg.translate(
      origin.x + direction.x * length * 0.5,
      origin.y + direction.y * length * 0.5,
      origin.z + direction.z * length * 0.5
    )
    geometries.push(seg)

    // Tip position for child branches
    const tip = new THREE.Vector3(
      origin.x + direction.x * length,
      origin.y + direction.y * length,
      origin.z + direction.z * length
    )

    // Branch children (L-system: F[+F][-F][&F])
    const childCount = type === 'brain' ? 0 : (type === 'fan' ? 2 : Math.floor(2 + rng() * 2))
    const angleSpread = type === 'fan' ? 0.35 : 0.5  // fan coral spreads less

    for (let i = 0; i < childCount; i++) {
      const childDir = direction.clone()
      // Random angle deviation (yomboprime: growth field direction + noise)
      const pitchAngle = (rng() - 0.5) * angleSpread
      const yawAngle = (rng() - 0.5) * angleSpread + (i / childCount) * Math.PI * 2

      // Apply rotation via euler
      childDir.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitchAngle)
      childDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawAngle)
      // Bias upward (coral grows toward light)
      childDir.y = Math.max(childDir.y, 0.2)
      childDir.normalize()

      addBranch(
        tip,
        childDir,
        radius * (type === 'tube' ? 0.5 : 0.65),   // radius taper per level
        length * (0.55 + rng() * 0.2),               // length shrinks
        depth + 1,
        maxDepth
      )
    }
  }

  // Type-specific starting parameters
  const configs = {
    brain: { radius: 0.4, length: 0.3, depth: 0 },      // round blob (no branches)
    branching: { radius: 0.15, length: 0.8, depth: 3 },  // tall branching
    tube: { radius: 0.1, length: 0.6, depth: 2 },        // tube clusters
    fan: { radius: 0.12, length: 0.9, depth: 3 },        // flat fan coral
  }
  const cfg = configs[type] ?? configs.branching

  if (type === 'brain') {
    // Brain coral: bumpy sphere, not branches
    const sphere = new THREE.SphereGeometry(
      cfg.radius + rng() * 0.3,
      8, 6
    )
    // Deform vertices for organic bumpiness
    const pos = sphere.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const noise = Math.sin(x * 8) * Math.cos(z * 6) * 0.05 + Math.sin(y * 10) * 0.03
      pos.setXYZ(i, x + noise, y + Math.abs(noise), z + noise)
    }
    sphere.computeVertexNormals()
    return sphere
  }

  const startDir = new THREE.Vector3(0, 1, 0)
  addBranch(new THREE.Vector3(0, 0, 0), startDir, cfg.radius, cfg.length, 0, cfg.depth)

  if (geometries.length === 0) return new THREE.BufferGeometry()
  const merged = mergeGeometries(geometries)
  for (const g of geometries) g.dispose()
  return merged
}

// Seeded PRNG (mulberry32) — deterministic coral shapes
function mulberry32(seed) {
  let s = seed | 0
  return function () {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default class CoralCluster {
  constructor(scene, getTerrainHeight, coralConfig = {}) {
    this.scene = scene
    this._getTerrainHeight = getTerrainHeight
    this.meshes = []

    const types = coralConfig.types ?? [
      { name: 'brain', count: 15, size: [0.5, 1.2], glowColor: [0.1, 0.6, 0.8], glowIntensity: 0.4 },
      { name: 'branching', count: 25, size: [0.3, 1.5], glowColor: [0.2, 0.9, 0.5], glowIntensity: 0.6 },
      { name: 'tube', count: 20, size: [0.2, 0.8], glowColor: [0.8, 0.3, 0.9], glowIntensity: 0.5 },
      { name: 'fan', count: 10, size: [0.8, 2.0], glowColor: [0.9, 0.6, 0.2], glowIntensity: 0.3 },
    ]

    // Warm coral color palette (per-type base colors)
    const baseColors = {
      brain: [0.8, 0.35, 0.25],     // warm orange-red
      branching: [0.9, 0.45, 0.3],  // coral orange
      tube: [0.7, 0.25, 0.55],      // magenta-pink
      fan: [0.85, 0.55, 0.2],       // amber-gold
    }

    for (const typeConfig of types) {
      const rng = mulberry32(typeConfig.name.length * 7919)
      const geometry = createBranchingCoral(typeConfig.name, rng)

      const coralColor = baseColors[typeConfig.name] ?? [0.8, 0.4, 0.3]

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uCoralColor: { value: new THREE.Color(...coralColor) },
          uGlowColor: { value: new THREE.Color(...typeConfig.glowColor) },
          uGlowIntensity: { value: typeConfig.glowIntensity },
          uWaterFogColor: { value: new THREE.Color(0.02, 0.08, 0.12) },
          uFogDensity: { value: 0.015 },
          uLightDir: { value: new THREE.Vector3(0.0, 1.0, 0.2).normalize() },
          uLightColor: { value: new THREE.Color(0.15, 0.35, 0.55) },
          uAmbientStrength: { value: 0.12 },
        },
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.InstancedMesh(geometry, material, typeConfig.count)
      let placed = 0
      const spreadRadius = 85

      for (let i = 0; i < typeConfig.count * 3 && placed < typeConfig.count; i++) {
        const x = (Math.random() - 0.5) * spreadRadius * 2
        const z = (Math.random() - 0.5) * spreadRadius * 2
        const y = this._getTerrainHeight(x, z)

        _dummy.position.set(x, y, z)
        _dummy.rotation.y = Math.random() * Math.PI * 2
        // Size variation from config
        const sizeMin = typeConfig.size[0]
        const sizeMax = typeConfig.size[1]
        const scale = sizeMin + Math.random() * (sizeMax - sizeMin)
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

  update(elapsed) {
    for (const { material } of this.meshes) {
      material.uniforms.uTime.value = elapsed
    }
  }

  dispose() {
    for (const { mesh, material } of this.meshes) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      material.dispose()
    }
  }
}
