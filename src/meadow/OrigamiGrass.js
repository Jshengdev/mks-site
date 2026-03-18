// Origami grass — angular paper blades replacing smooth grass
// Technique: flat-faceted zigzag geometry (hard folds, not curves)
// Adapted from Nitash-Biswas/grass-shader-glsl geometry pattern
// + daniel-ilett toon step-lighting for paper cutout feel
import * as THREE from 'three'
import vertexShader from './shaders/origami-grass.vert.glsl?raw'
import fragmentShader from './shaders/origami-grass.frag.glsl?raw'

const _dummy = new THREE.Object3D()

// Origami blade geometry — 3 segments with hard Z-folds
// Creates zigzag profile: each face is a flat paper surface
// Non-indexed so computeVertexNormals gives per-face flat normals
function createOrigamiBlade() {
  const W = 0.06     // half-width (wider than grass 0.035 — paper is flat)
  const H = 0.8      // total height
  const FZ = 0.035   // Z offset at fold points (creates visible crease)
  const T = 0.012    // width taper per segment

  const w0 = W, w1 = W - T, w2 = W - 2 * T
  const h1 = H / 3, h2 = 2 * H / 3

  // Three segments, alternating Z-fold direction
  // Each triangle has unique vertices = flat shading
  const positions = new Float32Array([
    // Segment 0: base quad (flat at Z=0, folds to Z=+FZ)
    -w0, 0, 0,      w0, 0, 0,      -w1, h1, FZ,
    -w1, h1, FZ,    w0, 0, 0,       w1, h1, FZ,

    // Segment 1: mid quad (folds back to Z=-FZ)
    -w1, h1, FZ,    w1, h1, FZ,    -w2, h2, -FZ,
    -w2, h2, -FZ,   w1, h1, FZ,     w2, h2, -FZ,

    // Segment 2: tip triangle (folds forward to Z=+FZ*0.5)
    -w2, h2, -FZ,   w2, h2, -FZ,    0, H, FZ * 0.5,
  ])

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.computeVertexNormals()
  return geometry
}

export default class OrigamiGrass {
  constructor(scene, config, getTerrainHeight) {
    const count = config.count ?? 400
    const spread = config.spread ?? 160
    const color = config.color ?? [0.96, 0.94, 0.89]
    const shadowColor = config.shadowColor ?? [0.88, 0.86, 0.82]

    const geometry = createOrigamiBlade()

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color().setRGB(...color) },
        uShadowColor: { value: new THREE.Color().setRGB(...shadowColor) },
        uSunDirection: { value: new THREE.Vector3(0.3, 0.6, -0.7).normalize() },
      },
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count)

    let placed = 0
    for (let i = 0; i < count * 3 && placed < count; i++) {
      const x = (Math.random() - 0.5) * spread
      const z = (Math.random() - 0.5) * spread
      const y = getTerrainHeight(x, z)

      _dummy.position.set(x, y, z)
      _dummy.rotation.y = Math.random() * Math.PI * 2
      // Imperfection: slight random tilt (1-3 deg) — paper isn't perfectly upright
      _dummy.rotation.z = (Math.random() - 0.5) * 0.06
      _dummy.scale.setScalar(0.7 + Math.random() * 0.6)
      _dummy.updateMatrix()
      this.mesh.setMatrixAt(placed, _dummy.matrix)
      placed++
    }

    this.mesh.count = placed
    this.mesh.instanceMatrix.needsUpdate = true
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
