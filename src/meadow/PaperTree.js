// Paper trees — low-poly folded paper tree instances
// Trunk = rectangular prism (box), Crown = 5 intersecting triangular planes
// Crown radius = treeHeight / 5 (cbotman/low-poly-fun pyramid ratio)
// Looks like origami trees — everything is flat surfaces, no curves
// Adapted from FlowerInstances.js InstancedMesh pattern
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import vertexShader from './shaders/paper-tree.vert.glsl?raw'
import fragmentShader from './shaders/paper-tree.frag.glsl?raw'

import { SECTION_T_VALUES } from './constants.js'
const CLEARING_RADIUS = 10

const _dummy = new THREE.Object3D()

function createPaperTreeGeometry(trunkHeight, crownRadius, crownApex) {
  // Trunk — rectangular prism (box) with uv stripped
  const hw = 0.12 // trunk half-width
  const trunkGeo = new THREE.BoxGeometry(hw * 2, trunkHeight, hw * 2)
  trunkGeo.translate(0, trunkHeight / 2, 0)
  trunkGeo.deleteAttribute('uv')

  // Crown — 5 intersecting triangular planes at different angles
  // Each is a flat isoceles triangle: base at trunk top, apex above
  const crownGeos = []
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI // 0 to π (semi-circle, planes intersect)
    const cos_a = Math.cos(angle)
    const sin_a = Math.sin(angle)
    const r = crownRadius

    // Triangle: left-base, right-base, apex
    const positions = new Float32Array([
      -r * cos_a, trunkHeight, -r * sin_a,
       r * cos_a, trunkHeight,  r * sin_a,
       0, crownApex, 0,
    ])

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.computeVertexNormals()
    crownGeos.push(geo)
  }

  const merged = mergeGeometries([trunkGeo, ...crownGeos])
  return merged
}

export default class PaperTree {
  constructor(scene, config, getTerrainHeight, cameraRig) {
    const count = config.count ?? 15
    const spread = config.spread ?? 140
    const trunkHeight = config.trunkHeight ?? 1.5
    const crownRadius = config.crownRadius ?? 0.9
    const crownApex = config.crownApex ?? 3.0
    const color = config.color ?? [0.97, 0.95, 0.90]
    const shadowColor = config.shadowColor ?? [0.86, 0.84, 0.80]

    const geometry = createPaperTreeGeometry(trunkHeight, crownRadius, crownApex)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTrunkHeight: { value: trunkHeight },
        uColor: { value: new THREE.Color().setRGB(...color) },
        uShadowColor: { value: new THREE.Color().setRGB(...shadowColor) },
        uSunDirection: { value: new THREE.Vector3(0.3, 0.6, -0.7).normalize() },
        uSunColor: { value: new THREE.Color(1.0, 0.97, 0.92) },
      },
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count)

    let placed = 0
    for (let i = 0; i < count * 5 && placed < count; i++) {
      const x = (Math.random() - 0.5) * spread
      const z = (Math.random() - 0.5) * spread

      // Skip clearings (adapted from FlowerInstances)
      if (cameraRig && this._inClearing(x, z, cameraRig)) continue

      const y = getTerrainHeight(x, z)

      _dummy.position.set(x, y, z)
      _dummy.rotation.y = Math.random() * Math.PI * 2
      // Size variation: 0.6x to 1.4x (small to large paper trees)
      _dummy.scale.setScalar(0.6 + Math.random() * 0.8)
      _dummy.updateMatrix()
      this.mesh.setMatrixAt(placed, _dummy.matrix)
      placed++
    }

    this.mesh.count = placed
    this.mesh.instanceMatrix.needsUpdate = true
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
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
