// Copper leaves — small metallic leaf-shaped instances attached near gear trees
// PBR metallic material (roughness 0.3, metalness 0.9) with wind wobble
// Adapted from: FlowerInstances.js pattern + physicallybased.info copper values
import * as THREE from 'three'
import vertexShader from './shaders/copper-leaf.vert.glsl?raw'
import fragmentShader from './shaders/copper-leaf.frag.glsl?raw'

const SUN_DIR = new THREE.Vector3(0.3, 0.21, -1.0).normalize()
const SUN_COLOR = new THREE.Color(0.85, 0.72, 0.50)

export default class CopperLeaf {
  constructor(scene, gearTrees, config = {}) {
    const count = config.count ?? 400
    const color = config.color ?? [0.96, 0.64, 0.54]

    // Diamond/rhombus leaf shape — 4 verts, 2 triangles
    const leafGeo = new THREE.BufferGeometry()
    const verts = new Float32Array([
       0.00, 0.00,  0.00,   // base
      -0.04, 0.08,  0.00,   // left edge
       0.00, 0.18,  0.01,   // tip (slight Z for volume)
       0.04, 0.08,  0.00,   // right edge
    ])
    const idx = new Uint16Array([0, 1, 2, 0, 2, 3])
    leafGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    leafGeo.setIndex(new THREE.BufferAttribute(idx, 1))
    leafGeo.computeVertexNormals()

    // Per-instance phase for staggered wobble
    const phases = new Float32Array(count)
    leafGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setRGB(...color) },
        uSunDirection: { value: SUN_DIR },
        uSunColor: { value: SUN_COLOR },
      },
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.InstancedMesh(leafGeo, material, count)
    const dummy = new THREE.Object3D()
    const treePositions = gearTrees?.treePositions ?? []

    for (let i = 0; i < count; i++) {
      if (treePositions.length > 0) {
        // Cluster near a random gear tree
        const tree = treePositions[Math.floor(Math.random() * treePositions.length)]
        const angle = Math.random() * Math.PI * 2
        const dist = 0.5 + Math.random() * 3.0
        dummy.position.set(
          tree.x + Math.cos(angle) * dist,
          tree.y + 1.5 + Math.random() * 4.0,
          tree.z + Math.sin(angle) * dist,
        )
      } else {
        dummy.position.set(
          (Math.random() - 0.5) * 160,
          0.5 + Math.random() * 4.0,
          (Math.random() - 0.5) * 160,
        )
      }

      dummy.rotation.set(
        Math.random() * 0.5 - 0.25,
        Math.random() * Math.PI * 2,
        Math.random() * 0.3 - 0.15,
      )
      dummy.scale.setScalar(0.5 + Math.random() * 1.0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      phases[i] = Math.random()
    }

    mesh.instanceMatrix.needsUpdate = true
    leafGeo.attributes.aPhase.needsUpdate = true

    scene.add(mesh)
    this.mesh = mesh
    this.material = material
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
