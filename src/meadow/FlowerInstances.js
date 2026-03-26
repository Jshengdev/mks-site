// Instanced flowers with toon shading — BotW-inspired
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { getTerrainHeight as defaultGetTerrainHeight } from './TerrainPlane.js'
import flowerVertexShader from './shaders/flower.vert.glsl?raw'
import rimLight from './shaders/_rim-light.glsl?raw'
import flowerFragmentShaderSrc from './shaders/flower.frag.glsl?raw'
const flowerFragmentShader = rimLight + '\n' + flowerFragmentShaderSrc

import { SECTION_T_VALUES } from './constants.js'
const CLEARING_RADIUS = 8 // world units around clearing center

// Default BotW-inspired flower colors (6 types)
const DEFAULT_FLOWER_COLORS = [
  new THREE.Color(0.95, 0.9, 0.8),   // daisy (cream)
  new THREE.Color(0.85, 0.2, 0.15),  // poppy (red-orange)
  new THREE.Color(0.95, 0.75, 0.1),  // marigold (golden)
  new THREE.Color(0.3, 0.4, 0.8),    // cornflower (blue)
  new THREE.Color(0.95, 0.85, 0.2),  // buttercup (yellow)
  new THREE.Color(0.55, 0.65, 0.3),  // wildgrass (sage)
]

const SUN_DIR = new THREE.Vector3(0.0, 0.21, -1.0).normalize()
const SUN_COLOR = new THREE.Color(1.0, 1.0, 0.99)

export default class FlowerInstances {
  constructor(scene, cameraRig, count = 800, getTerrainHeight, flowerConfig = {}) {
    this.scene = scene
    this._getTerrainHeight = getTerrainHeight ?? defaultGetTerrainHeight
    this.meshes = []

    // Per-world flower palette
    const colors = flowerConfig.palette
      ? flowerConfig.palette.map(hex => new THREE.Color(hex))
      : DEFAULT_FLOWER_COLORS

    // Simple procedural flower geometry (cylinder stem + sphere head)
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.4, 4)
    stemGeo.translate(0, 0.2, 0)
    const headGeo = new THREE.SphereGeometry(0.08, 6, 4)
    headGeo.translate(0, 0.42, 0)

    // Merge into single geometry, dispose source geometries
    const merged = mergeGeometries([stemGeo, headGeo])
    stemGeo.dispose()
    headGeo.dispose()

    const flowersPerType = Math.floor(count / colors.length)
    const dummy = new THREE.Object3D()

    for (let t = 0; t < colors.length; t++) {
      const material = new THREE.ShaderMaterial({
        vertexShader: flowerVertexShader,
        fragmentShader: flowerFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: colors[t] },
          uSunDirection: { value: SUN_DIR },
          uSunColor: { value: SUN_COLOR },
        },
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.InstancedMesh(merged, material, flowersPerType)
      let placed = 0

      for (let i = 0; i < flowersPerType * 3 && placed < flowersPerType; i++) {
        const x = (Math.random() - 0.5) * 180
        const z = (Math.random() - 0.5) * 180

        // Skip clearings
        if (this._inClearing(x, z, cameraRig)) continue

        const y = this._getTerrainHeight(x, z)
        dummy.position.set(x, y, z)
        dummy.rotation.y = Math.random() * Math.PI * 2
        dummy.scale.setScalar(0.6 + Math.random() * 0.8)
        dummy.updateMatrix()
        mesh.setMatrixAt(placed, dummy.matrix)
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

  dispose() {
    for (const { mesh, material } of this.meshes) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      material.dispose()
    }
  }
}
