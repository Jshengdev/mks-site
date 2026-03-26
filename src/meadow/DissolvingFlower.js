// DissolvingFlower — flowers that bloom, dissolve, and respawn
// Dissolve technique stolen from transition.frag.glsl brushDissolve
// Edge glow from Harry Alisavakis dissolve shader
// Toon lighting from daniel-ilett/maya-ndljk
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { getTerrainHeight as defaultGetTerrainHeight } from './TerrainPlane.js'
import { SECTION_T_VALUES } from './constants.js'
import vertexShader from './shaders/dissolving-flower.vert.glsl?raw'
import fragmentShader from './shaders/dissolving-flower.frag.glsl?raw'

const CLEARING_RADIUS = 8
const SUN_DIR = new THREE.Vector3(0.0, 0.21, -1.0).normalize()
const SUN_COLOR = new THREE.Color(1.0, 1.0, 0.99)

export default class DissolvingFlower {
  constructor(scene, cameraRig, count = 200, getTerrainHeight, config = {}) {
    this.scene = scene
    this._getTerrainHeight = getTerrainHeight ?? defaultGetTerrainHeight
    this.meshes = []

    // Muted warm palette — fading golds, dusty roses, dried lavender
    const palette = config.palette
      ? config.palette.map(hex => new THREE.Color(hex))
      : [
        new THREE.Color(0.77, 0.63, 0.38), // faded gold
        new THREE.Color(0.72, 0.63, 0.47), // dried wheat
        new THREE.Color(0.75, 0.66, 0.50), // sand
        new THREE.Color(0.66, 0.60, 0.47), // dusty sage
        new THREE.Color(0.69, 0.63, 0.56), // warm grey
        new THREE.Color(0.77, 0.72, 0.60), // parchment
      ]

    const edgeColor = config.edgeColor
      ? new THREE.Color().setRGB(...config.edgeColor)
      : new THREE.Color(0.6, 0.4, 0.7) // lavender glow at dissolve edge
    const edgeWidth = config.edgeWidth ?? 0.08

    // Flower geometry — slightly larger than normal flowers (these are the focal point)
    const stemGeo = new THREE.CylinderGeometry(0.025, 0.04, 0.5, 4)
    stemGeo.translate(0, 0.25, 0)
    const headGeo = new THREE.SphereGeometry(0.10, 6, 4)
    headGeo.translate(0, 0.55, 0)
    const merged = mergeGeometries([stemGeo, headGeo])
    stemGeo.dispose()
    headGeo.dispose()

    const flowersPerType = Math.floor(count / palette.length)
    const dummy = new THREE.Object3D()

    for (let t = 0; t < palette.length; t++) {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: palette[t] },
          uSunDirection: { value: SUN_DIR },
          uSunColor: { value: SUN_COLOR },
          uEdgeColor: { value: edgeColor },
          uEdgeWidth: { value: edgeWidth },
        },
      })

      const mesh = new THREE.InstancedMesh(merged, material, flowersPerType)

      // Per-instance lifecycle phase (staggered so not all dissolve at once)
      const lifecyclePhases = new Float32Array(flowersPerType)
      let placed = 0

      for (let i = 0; i < flowersPerType * 3 && placed < flowersPerType; i++) {
        const x = (Math.random() - 0.5) * 160
        const z = (Math.random() - 0.5) * 160

        // Skip clearings
        if (this._inClearing(x, z, cameraRig)) continue

        const y = this._getTerrainHeight(x, z)
        dummy.position.set(x, y, z)
        dummy.rotation.y = Math.random() * Math.PI * 2
        dummy.scale.setScalar(0.7 + Math.random() * 0.9)
        dummy.updateMatrix()
        mesh.setMatrixAt(placed, dummy.matrix)
        lifecyclePhases[placed] = Math.random() // stagger phase
        placed++
      }

      mesh.count = placed
      mesh.instanceMatrix.needsUpdate = true

      // Attach lifecycle phase as instanced attribute
      mesh.geometry.setAttribute(
        'aLifecyclePhase',
        new THREE.InstancedBufferAttribute(lifecyclePhases.slice(0, placed), 1)
      )

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

  dispose() {
    for (const { mesh, material } of this.meshes) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      material.dispose()
    }
  }
}
