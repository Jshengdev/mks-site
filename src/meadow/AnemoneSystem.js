// AnemoneSystem — Instanced sea anemone tentacles, the "trees" of the Tide Pool
// Each anemone is a cluster of tube-geometry tentacles rooted to the pool floor.
// The vertex shader animates sine-based underwater current sway.
//
// Architecture follows FlowerInstances pattern:
//   - InstancedMesh per color type
//   - Per-instance attributes for phase, height, color
//   - Placement respects terrain height (getTerrainHeight)
//
// Stolen from:
//   Nitash-Biswas/grass-shader-glsl — multi-layer sine deformation
//   mattatz/unity-verlet-simulator — tentacle sway concept
//   Alex-DG — instanced point sprite pattern (adapted for mesh)
import * as THREE from 'three'
import vertexShader from './shaders/anemone.vert.glsl?raw'
import fragmentShader from './shaders/anemone.frag.glsl?raw'

// Module-level reusable objects (CLAUDE.md: avoid per-frame allocations)
const _dummy = new THREE.Object3D()
const _sunDir = new THREE.Vector3(0.1, -0.95, 0.05) // underwater: nearly vertical

export default class AnemoneSystem {
  constructor(scene, config = {}, getTerrainHeight) {
    this.scene = scene
    this._getTerrainHeight = getTerrainHeight
    this.meshes = []

    const clusterCount = config.count ?? 120
    const palette = config.palette ?? [
      [0.65, 0.15, 0.20],   // crimson
      [0.20, 0.55, 0.35],   // deep green
      [0.75, 0.35, 0.60],   // magenta-pink
      [0.30, 0.20, 0.50],   // purple
      [0.80, 0.60, 0.25],   // amber-orange
      [0.15, 0.40, 0.55],   // teal
    ]
    const tentaclesRange = config.tentaclesPerAnemone ?? [5, 12]
    const heightRange = config.tentacleHeight ?? [1.5, 4.0]
    const segments = config.tentacleSegments ?? 12
    const radius = config.tentacleRadius ?? 0.08

    // Total tentacles across all clusters
    const avgTentacles = (tentaclesRange[0] + tentaclesRange[1]) / 2
    const totalTentacles = Math.floor(clusterCount * avgTentacles)

    // Create tube geometry template (cylinder along Y axis)
    // Using CylinderGeometry with taper: wider at base, thinner at tip
    const tubeGeo = new THREE.CylinderGeometry(
      radius * 0.3,   // top radius (tip — thin)
      radius,          // bottom radius (base — thick)
      1.0,             // height=1, scaled per instance
      6,               // radial segments (6 = hexagonal, organic)
      segments,        // height segments (12 = smooth bend)
    )

    // Create shared material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uSwaySpeed: { value: config.swaySpeed ?? 0.4 },
        uSwayAmplitude: { value: config.swayAmplitude ?? 0.3 },
        uCurrentDir: { value: new THREE.Vector3(
          ...(config.currentDirection ?? [0.6, 0.0, 0.8])
        ).normalize() },
        uSunDirection: { value: _sunDir },
        uSunColor: { value: new THREE.Color(0.45, 0.65, 0.80) },
        uBrightness: { value: 1.0 },
      },
    })

    // Create InstancedMesh
    const mesh = new THREE.InstancedMesh(tubeGeo, this.material, totalTentacles)

    // Per-instance attributes
    const phases = new Float32Array(totalTentacles)
    const heights = new Float32Array(totalTentacles)
    const colors = new Float32Array(totalTentacles * 3)

    let tentacleIdx = 0

    // Place anemone clusters
    for (let c = 0; c < clusterCount && tentacleIdx < totalTentacles; c++) {
      // Random position on pool floor
      const cx = (Math.random() - 0.5) * 150
      const cz = (Math.random() - 0.5) * 150
      const cy = this._getTerrainHeight ? this._getTerrainHeight(cx, cz) : 0

      // Random tentacle count for this cluster
      const numTentacles = tentaclesRange[0] +
        Math.floor(Math.random() * (tentaclesRange[1] - tentaclesRange[0] + 1))

      // Random color for this cluster (from palette)
      const colorIdx = Math.floor(Math.random() * palette.length)
      const clusterColor = palette[colorIdx]

      for (let t = 0; t < numTentacles && tentacleIdx < totalTentacles; t++) {
        // Spread tentacles within cluster (0.3-0.8 unit radius)
        const angle = (t / numTentacles) * Math.PI * 2 + Math.random() * 0.5
        const spreadRadius = 0.3 + Math.random() * 0.5
        const tx = cx + Math.cos(angle) * spreadRadius
        const tz = cz + Math.sin(angle) * spreadRadius
        const ty = cy

        // Random height within range
        const h = heightRange[0] + Math.random() * (heightRange[1] - heightRange[0])

        // Position and scale the instance
        _dummy.position.set(tx, ty, tz)
        // Slight random lean (tentacles don't grow perfectly vertical)
        _dummy.rotation.set(
          (Math.random() - 0.5) * 0.3,  // lean X
          Math.random() * Math.PI * 2,    // random rotation
          (Math.random() - 0.5) * 0.3,   // lean Z
        )
        _dummy.scale.set(1.0, h, 1.0)   // scale Y = tentacle height
        _dummy.updateMatrix()
        mesh.setMatrixAt(tentacleIdx, _dummy.matrix)

        // Per-instance attributes
        phases[tentacleIdx] = Math.random() * Math.PI * 2
        heights[tentacleIdx] = h

        // Slight color variation within cluster
        const colorVariation = 0.9 + Math.random() * 0.2
        colors[tentacleIdx * 3 + 0] = clusterColor[0] * colorVariation
        colors[tentacleIdx * 3 + 1] = clusterColor[1] * colorVariation
        colors[tentacleIdx * 3 + 2] = clusterColor[2] * colorVariation

        tentacleIdx++
      }
    }

    mesh.count = tentacleIdx
    mesh.instanceMatrix.needsUpdate = true

    // Attach per-instance attributes
    mesh.geometry.setAttribute('aPhase',
      new THREE.InstancedBufferAttribute(phases.subarray(0, tentacleIdx), 1))
    mesh.geometry.setAttribute('aHeight',
      new THREE.InstancedBufferAttribute(heights.subarray(0, tentacleIdx), 1))
    mesh.geometry.setAttribute('aBaseColor',
      new THREE.InstancedBufferAttribute(colors.subarray(0, tentacleIdx * 3), 3))

    scene.add(mesh)
    this.meshes.push(mesh)
    this.tentacleCount = tentacleIdx
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(v) {
    this.material.uniforms.uBrightness.value = v
  }

  setSwaySpeed(v) {
    this.material.uniforms.uSwaySpeed.value = v
  }

  dispose() {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
    }
    this.material.dispose()
  }
}
