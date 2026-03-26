// Giant Anemone system — towering underwater tentacle clusters
// The "trees" of the tide pool world. You are TINY, they are HUGE.
// Each anemone = cluster of 5-12 tapered tentacles using InstancedMesh.
//
// Adapted from:
//   spite/codevember-2017 glow-worms — tube extrusion + parametric curves
//   clicktorelease.com — vertex displacement + noise deformation
//   FlowerInstances.js pattern — InstancedMesh with per-instance attributes
//
// Geometry: CylinderGeometry (unit height 0→1), instanceMatrix Y-scales to world height.
// Per-instance attributes: aPhase, aHeight, aBaseColor.
// Vertex shader: 3-layer sine deformation (base fixed, tips sway — spite's pow(t,2) weighting).
import * as THREE from 'three'
import vertexShader from './shaders/anemone.vert.glsl?raw'
import fragmentShader from './shaders/anemone.frag.glsl?raw'

const DEFAULT_PALETTE = [
  [0.65, 0.15, 0.20],   // crimson (Waratah anemone)
  [0.20, 0.55, 0.35],   // deep green (giant green)
  [0.75, 0.35, 0.60],   // magenta-pink (Dahlia anemone)
  [0.30, 0.20, 0.50],   // purple (plum anemone)
  [0.80, 0.60, 0.25],   // amber-orange (beadlet)
  [0.15, 0.40, 0.55],   // teal (snakelocks)
]

const _dummy = new THREE.Object3D()

export default class GiantAnemone {
  constructor(scene, config, getTerrainHeight) {
    const cfg = config.anemones ?? {}
    const count = cfg.count ?? 120
    const palette = cfg.palette ?? DEFAULT_PALETTE
    const tentaclesRange = cfg.tentaclesPerAnemone ?? [5, 12]
    const heightRange = cfg.tentacleHeight ?? [1.5, 4.0]
    const baseRadius = cfg.tentacleRadius ?? 0.08
    const segments = cfg.tentacleSegments ?? 12
    const swaySpeed = cfg.swaySpeed ?? 0.4
    const swayAmplitude = cfg.swayAmplitude ?? 0.3
    const currentDir = cfg.currentDirection ?? [0.6, 0.0, 0.8]

    // Tapered cylinder — wider base (baseRadius), thin tip (15% of base)
    // spite's taper for organic tentacles
    // Unit height (0→1), translated so base sits at y=0
    const geo = new THREE.CylinderGeometry(
      baseRadius * 0.15,  // radiusTop (tip — thin)
      baseRadius,          // radiusBottom (base — thick)
      1.0,                 // unit height (scaled per instance)
      5,                   // radialSegments (low poly = organic)
      segments,            // heightSegments (smooth bending)
    )
    geo.translate(0, 0.5, 0) // shift so base at y=0, top at y=1

    // Generate cluster base positions across pool floor
    const clusters = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 160
      const z = (Math.random() - 0.5) * 160
      const y = getTerrainHeight ? getTerrainHeight(x, z) : 0
      const numTentacles = Math.floor(
        tentaclesRange[0] + Math.random() * (tentaclesRange[1] - tentaclesRange[0])
      )
      clusters.push({ x, y, z, numTentacles })
    }

    // Count total tentacles for buffer allocation
    const totalTentacles = clusters.reduce((sum, c) => sum + c.numTentacles, 0)

    // Pre-generate all tentacle placement data in a single pass
    // (avoids double-random bug from two-pass approach)
    const tentacleData = []
    for (const cluster of clusters) {
      const colorIdx = Math.floor(Math.random() * palette.length)
      const clusterColor = palette[colorIdx]

      for (let t = 0; t < cluster.numTentacles; t++) {
        const angle = (t / cluster.numTentacles) * Math.PI * 2 + Math.random() * 0.5
        const dist = 0.1 + Math.random() * 0.4
        const h = heightRange[0] + Math.random() * (heightRange[1] - heightRange[0])
        const variation = 0.85 + Math.random() * 0.3
        tentacleData.push({
          x: cluster.x + Math.cos(angle) * dist,
          y: cluster.y,
          z: cluster.z + Math.sin(angle) * dist,
          h,
          rx: (Math.random() - 0.5) * 0.3,
          ry: Math.random() * Math.PI * 2,
          rz: (Math.random() - 0.5) * 0.3,
          phase: Math.random() * Math.PI * 2,
          cr: clusterColor[0] * variation,
          cg: clusterColor[1] * variation,
          cb: clusterColor[2] * variation,
        })
      }
    }

    // Per-instance attribute buffers
    const phases = new Float32Array(totalTentacles)
    const heights = new Float32Array(totalTentacles)
    const colors = new Float32Array(totalTentacles * 3)

    // Fill attributes and build matrices in one pass
    const matrices = []
    for (let i = 0; i < totalTentacles; i++) {
      const d = tentacleData[i]
      phases[i] = d.phase
      heights[i] = d.h
      colors[i * 3 + 0] = d.cr
      colors[i * 3 + 1] = d.cg
      colors[i * 3 + 2] = d.cb

      _dummy.position.set(d.x, d.y, d.z)
      _dummy.rotation.set(d.rx, d.ry, d.rz)
      _dummy.scale.set(1, d.h, 1)
      _dummy.updateMatrix()
      matrices.push(_dummy.matrix.clone())
    }

    // Add per-instance attributes to geometry
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    geo.setAttribute('aHeight', new THREE.InstancedBufferAttribute(heights, 1))
    geo.setAttribute('aBaseColor', new THREE.InstancedBufferAttribute(colors, 3))

    // Shared material for all tentacles (single draw call)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSwaySpeed: { value: swaySpeed },
        uSwayAmplitude: { value: swayAmplitude },
        uCurrentDir: { value: new THREE.Vector3(...currentDir).normalize() },
        uSunDirection: { value: new THREE.Vector3(0.1, -0.95, 0.05).normalize() },
        uSunColor: { value: new THREE.Color(0.45, 0.65, 0.80) },
        uBrightness: { value: 1.0 },
      },
      side: THREE.DoubleSide,
    })

    // Single InstancedMesh — one draw call for all tentacles
    this.mesh = new THREE.InstancedMesh(geo, this.material, totalTentacles)
    for (let i = 0; i < totalTentacles; i++) {
      this.mesh.setMatrixAt(i, matrices[i])
    }
    this.mesh.instanceMatrix.needsUpdate = true

    this.scene = scene
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose() {
    if (this.mesh) this.scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
