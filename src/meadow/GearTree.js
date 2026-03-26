// Gear trees — steampunk procedural trees with rotating gears at branch tips
// Trunk: tapered cylinder. Branches: horizontal cylinders. Gears: extruded toothed discs.
// Techniques stolen from: EmptySamurai/GearTrain (gear profile), mattatz/THREE.Tree (branching)
// PBR values from: physicallybased.info (copper 0.955/0.638/0.538, brass 0.910/0.778/0.423)
import * as THREE from 'three'
import { SECTION_T_VALUES } from './constants.js'
import treeVertexShader from './shaders/gear-tree.vert.glsl?raw'
import treeFragmentShader from './shaders/gear-tree.frag.glsl?raw'
import gearVertexShader from './shaders/gear.vert.glsl?raw'

const CLEARING_RADIUS = 10
const SUN_DIR = new THREE.Vector3(0.3, 0.21, -1.0).normalize()
const SUN_COLOR = new THREE.Color(0.85, 0.72, 0.50)

function makeMetal(vertShader, fragShader, color, roughness, metalness, extras = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: vertShader,
    fragmentShader: fragShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: color },
      uSunDirection: { value: SUN_DIR },
      uSunColor: { value: SUN_COLOR },
      uRoughness: { value: roughness },
      uMetalness: { value: metalness },
    },
    ...extras,
  })
}

export default class GearTree {
  constructor(scene, cameraRig, getTerrainHeight, config = {}) {
    this.scene = scene
    this.meshes = []
    this.treePositions = [] // exposed for CopperLeaf placement

    const treeCount = config.count ?? 20
    const trunkColor = new THREE.Color().setRGB(...(config.trunkColor ?? [0.72, 0.45, 0.20]))
    const branchColor = new THREE.Color().setRGB(...(config.branchColor ?? [0.91, 0.78, 0.42]))
    const gearColor = new THREE.Color().setRGB(...(config.gearColor ?? [0.96, 0.64, 0.54]))
    const gearTeeth = config.gearTeeth ?? 12
    const maxGearSpeed = config.maxGearSpeed ?? 0.5

    // --- Geometries ---
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.22, 5.0, 8)
    const branchGeo = new THREE.CylinderGeometry(0.05, 0.08, 2.5, 6)
    branchGeo.rotateZ(Math.PI / 2) // horizontal
    const gearGeo = this._createGearGeometry(gearTeeth, 0.5, 0.35, 0.06)

    // --- Materials ---
    const trunkMat = makeMetal(treeVertexShader, treeFragmentShader, trunkColor, 0.55, 0.85)
    const branchMat = makeMetal(treeVertexShader, treeFragmentShader, branchColor, 0.40, 0.90)
    const gearMat = makeMetal(gearVertexShader, treeFragmentShader, gearColor, 0.30, 0.95, {
      side: THREE.DoubleSide,
    })

    // --- Generate tree layout ---
    const dummy = new THREE.Object3D()
    const treeData = []

    let placed = 0
    for (let attempt = 0; attempt < treeCount * 5 && placed < treeCount; attempt++) {
      const x = (Math.random() - 0.5) * 160
      const z = (Math.random() - 0.5) * 160

      let inClearing = false
      for (const t of SECTION_T_VALUES) {
        const cp = cameraRig.curve.getPoint(t)
        const dx = x - cp.x, dz = z - cp.z
        if (dx * dx + dz * dz < CLEARING_RADIUS * CLEARING_RADIUS) {
          inClearing = true; break
        }
      }
      if (inClearing) continue

      const y = getTerrainHeight(x, z)
      const branchCount = 2 + Math.floor(Math.random() * 3) // 2-4
      const branches = []

      for (let b = 0; b < branchCount; b++) {
        const branchY = 1.5 + Math.random() * 3.0
        const branchAngle = (b / branchCount) * Math.PI * 2 + Math.random() * 0.5
        const gearSpeed = (0.2 + Math.random() * 0.8) * maxGearSpeed * (Math.random() > 0.5 ? 1 : -1)
        branches.push({ y: branchY, angle: branchAngle, gearSpeed })
      }

      treeData.push({ x, y, z, branches, scale: 0.8 + Math.random() * 0.5 })
      this.treePositions.push(new THREE.Vector3(x, y, z))
      placed++
    }

    // --- Trunk InstancedMesh ---
    const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, treeData.length)
    for (let i = 0; i < treeData.length; i++) {
      const td = treeData[i]
      dummy.position.set(td.x, td.y + 2.5 * td.scale, td.z)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      dummy.scale.setScalar(td.scale)
      dummy.updateMatrix()
      trunkMesh.setMatrixAt(i, dummy.matrix)
    }
    trunkMesh.instanceMatrix.needsUpdate = true
    scene.add(trunkMesh)
    this.meshes.push({ mesh: trunkMesh, material: trunkMat })

    // --- Branch + Gear InstancedMeshes ---
    const totalBranches = treeData.reduce((sum, td) => sum + td.branches.length, 0)
    const branchMesh = new THREE.InstancedMesh(branchGeo, branchMat, totalBranches)
    const gearMesh = new THREE.InstancedMesh(gearGeo, gearMat, totalBranches)

    // Pre-allocate per-instance rotation speeds
    const rotationSpeeds = new Float32Array(totalBranches)
    gearGeo.setAttribute('aRotationSpeed', new THREE.InstancedBufferAttribute(rotationSpeeds, 1))

    let bi = 0
    for (const td of treeData) {
      for (const branch of td.branches) {
        const bx = td.x + Math.cos(branch.angle) * 1.25 * td.scale
        const bz = td.z + Math.sin(branch.angle) * 1.25 * td.scale
        const by = td.y + branch.y * td.scale

        dummy.position.set(bx, by, bz)
        dummy.rotation.set(0, branch.angle, 0)
        dummy.scale.setScalar(td.scale)
        dummy.updateMatrix()
        branchMesh.setMatrixAt(bi, dummy.matrix)

        // Gear at branch tip — face perpendicular to branch direction
        const gx = td.x + Math.cos(branch.angle) * 2.5 * td.scale
        const gz = td.z + Math.sin(branch.angle) * 2.5 * td.scale
        dummy.position.set(gx, by, gz)
        dummy.lookAt(gx + Math.cos(branch.angle), by, gz + Math.sin(branch.angle))
        dummy.scale.setScalar(td.scale * 0.8)
        dummy.updateMatrix()
        gearMesh.setMatrixAt(bi, dummy.matrix)

        rotationSpeeds[bi] = branch.gearSpeed
        bi++
      }
    }

    branchMesh.instanceMatrix.needsUpdate = true
    gearMesh.instanceMatrix.needsUpdate = true
    gearGeo.attributes.aRotationSpeed.needsUpdate = true

    scene.add(branchMesh)
    scene.add(gearMesh)
    this.meshes.push({ mesh: branchMesh, material: branchMat })
    this.meshes.push({ mesh: gearMesh, material: gearMat })
  }

  // Adapted from EmptySamurai/GearTrain — simplified stylized gear profile
  // Uses THREE.Shape + ExtrudeGeometry for proper front/back/side faces
  _createGearGeometry(teeth, outerR, innerR, thickness) {
    const shape = new THREE.Shape()

    for (let i = 0; i < teeth; i++) {
      const toothArc = (Math.PI * 2) / teeth
      const base = i * toothArc
      const a1 = base + toothArc * 0.20
      const a2 = base + toothArc * 0.35
      const a3 = base + toothArc * 0.65
      const a4 = base + toothArc * 0.80

      const px = (a, r) => Math.cos(a) * r
      const py = (a, r) => Math.sin(a) * r

      if (i === 0) shape.moveTo(px(base, innerR), py(base, innerR))
      shape.lineTo(px(a1, innerR), py(a1, innerR))
      shape.lineTo(px(a2, outerR), py(a2, outerR))
      shape.lineTo(px(a3, outerR), py(a3, outerR))
      shape.lineTo(px(a4, innerR), py(a4, innerR))
    }
    shape.closePath()

    // Center hole — axle
    const hole = new THREE.Path()
    const holeR = innerR * 0.3
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 2
      if (i === 0) hole.moveTo(Math.cos(a) * holeR, Math.sin(a) * holeR)
      else hole.lineTo(Math.cos(a) * holeR, Math.sin(a) * holeR)
    }
    shape.holes.push(hole)

    return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
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
