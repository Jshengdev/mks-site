// KelpStrand.js — Instanced kelp forest for underwater worlds
// Adapted from GrassGeometry.js blade pattern (5x taller, wider ribbon)
// + al-ro/spacejack vertex sway for underwater current
// + FlowerInstances.js placement/instancing pattern
import * as THREE from 'three'
import vertexShader from './shaders/kelp.vert.glsl?raw'
import fogUtils from './shaders/_fog-utils.glsl?raw'
import fragmentShaderSrc from './shaders/kelp.frag.glsl?raw'
const fragmentShader = fogUtils + '\n' + fragmentShaderSrc
import { SECTION_T_VALUES } from './constants.js'

const CLEARING_RADIUS = 8
const _dummy = new THREE.Object3D()

// Kelp blade geometry — tall tapered ribbon strip
// (adapted from GrassGeometry.createBladeGeometry, 5x height, wider)
function createKelpBladeGeometry(height, segments) {
  const halfWidth = 0.12   // wider than grass (0.035)
  const taper = halfWidth / segments
  const positions = []

  for (let i = 0; i < segments; i++) {
    const y0 = (i / segments) * height
    const y1 = ((i + 1) / segments) * height
    const w0 = halfWidth - taper * i
    const w1 = halfWidth - taper * (i + 1)

    if (i < segments - 1) {
      positions.push(
        -w0, y0, 0, w0, y0, 0, -w1, y1, 0,
        -w1, y1, 0, w0, y0, 0, w1, y1, 0
      )
    } else {
      // Tip triangle
      positions.push(-w0, y0, 0, w0, y0, 0, 0, y1, 0)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.computeVertexNormals()
  return geometry
}

export default class KelpStrand {
  constructor(scene, cameraRig, getTerrainHeight, kelpConfig = {}) {
    this._getTerrainHeight = getTerrainHeight

    const count = kelpConfig.bladeCount ?? 2000
    const height = kelpConfig.bladeHeight ?? 10.0
    const segments = 14  // smooth bending along tall stalk

    const baseColor = kelpConfig.baseColor ?? [0.02, 0.08, 0.04]
    const tipColor = kelpConfig.tipColor ?? [0.05, 0.18, 0.08]
    const swaySpeed = kelpConfig.swaySpeed ?? 0.15
    const currentDir = kelpConfig.currentDir ?? [0.7, 0.7]

    const geometry = createKelpBladeGeometry(height, segments)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uKelpHeight: { value: height },
        uCurrentSpeed: { value: swaySpeed },
        uCurrentDir: { value: new THREE.Vector2(...currentDir).normalize() },
        uBaseColor: { value: new THREE.Color(...baseColor) },
        uTipColor: { value: new THREE.Color(...tipColor) },
        uWaterFogColor: { value: new THREE.Color(0.02, 0.08, 0.12) },
        uFogDensity: { value: 0.015 },
        uLightDir: { value: new THREE.Vector3(0.0, 1.0, 0.2).normalize() },
        uLightColor: { value: new THREE.Color(0.15, 0.35, 0.55) },
        uAmbientStrength: { value: 0.08 },
      },
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count)
    let placed = 0
    const spreadRadius = 90  // half of terrain size (200/2 - margin)

    for (let i = 0; i < count * 3 && placed < count; i++) {
      const x = (Math.random() - 0.5) * spreadRadius * 2
      const z = (Math.random() - 0.5) * spreadRadius * 2

      // Skip clearings near camera path
      if (cameraRig && this._inClearing(x, z, cameraRig)) continue

      const y = this._getTerrainHeight(x, z)
      _dummy.position.set(x, y, z)
      _dummy.rotation.y = Math.random() * Math.PI * 2
      // Height variation: 0.6x to 1.4x (organic, not uniform)
      _dummy.scale.set(
        0.8 + Math.random() * 0.4,
        0.6 + Math.random() * 0.8,
        0.8 + Math.random() * 0.4
      )
      _dummy.updateMatrix()
      this.mesh.setMatrixAt(placed, _dummy.matrix)
      placed++
    }

    this.mesh.count = placed
    this.mesh.instanceMatrix.needsUpdate = true
    this.scene = scene
    scene.add(this.mesh)
  }

  _inClearing(x, z, cameraRig) {
    for (const t of SECTION_T_VALUES) {
      const pos = cameraRig.curve.getPoint(t)
      const dx = x - pos.x
      const dz = z - pos.z
      if (dx * dx + dz * dz < CLEARING_RADIUS * CLEARING_RADIUS) return true
    }
    return false
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
