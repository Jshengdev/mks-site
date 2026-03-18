// FloatingBook.js — Instanced floating books with gentle rotation + bob
// Minecraft Stronghold Library suspended in clouds
// Quaternion rotation stolen from zadvorsky/three.bas
// Instancing pattern adapted from FlowerInstances.js
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import vertexShader from './shaders/book.vert.glsl?raw'
import fragmentShader from './shaders/book.frag.glsl?raw'

const LIGHT_DIR = new THREE.Vector3(0.2, 0.8, 0.3).normalize()

export default class FloatingBook {
  constructor(scene, config = {}) {
    const count = config.floatingBookCount ?? 40
    const paperColor = config.paperColor ?? [0.91, 0.86, 0.78]
    const woodColor = config.woodColor ?? [0.16, 0.10, 0.04]

    // ─── Book geometry: spine + two angled covers + visible pages ───
    const openAngle = Math.PI * 0.18 // ~32 degrees half-open (from research: 27-45 sweet spot)

    // Spine (narrow box at center)
    const spineGeo = new THREE.BoxGeometry(0.04, 0.5, 0.35)

    // Left cover (hinged at spine left edge, opens outward)
    const leftCover = new THREE.PlaneGeometry(0.2, 0.5)
    leftCover.translate(0.1, 0, 0)   // pivot at left edge
    leftCover.rotateY(-openAngle)     // open outward
    leftCover.translate(-0.02, 0, 0)  // align with spine

    // Right cover (mirror of left)
    const rightCover = new THREE.PlaneGeometry(0.2, 0.5)
    rightCover.translate(-0.1, 0, 0)
    rightCover.rotateY(openAngle)
    rightCover.translate(0.02, 0, 0)

    // Pages visible at the opening (slightly recessed inside)
    const pagesGeo = new THREE.PlaneGeometry(0.16, 0.30)
    pagesGeo.rotateX(-Math.PI * 0.5)
    pagesGeo.translate(0, 0.02, 0.08)

    const bookGeo = mergeGeometries([spineGeo, leftCover, rightCover, pagesGeo])
    spineGeo.dispose()
    leftCover.dispose()
    rightCover.dispose()
    pagesGeo.dispose()

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uPageColor: { value: new THREE.Color(...paperColor) },
        uSpineColor: { value: new THREE.Color(...woodColor) },
        uLightDir: { value: LIGHT_DIR },
        uLightColor: { value: new THREE.Color(0.95, 0.78, 0.42) }, // warm incandescent amber
        uAmbient: { value: 0.15 },
      },
    })

    this.mesh = new THREE.InstancedMesh(bookGeo, this.material, count)

    // Per-instance animation attributes
    const phases = new Float32Array(count)
    const bobSpeeds = new Float32Array(count)
    const bobAmps = new Float32Array(count)
    const rotSpeeds = new Float32Array(count)

    const dummy = new THREE.Object3D()
    const rotSpeed = config.rotationSpeed ?? 0.001

    for (let i = 0; i < count; i++) {
      // Position: spread around the library volume
      // X: ±25 (around camera spiral), Y: 3-20 (above camera start), Z: 0 to -35 (along path)
      dummy.position.set(
        (Math.random() - 0.5) * 50,
        3 + Math.random() * 17,
        -Math.random() * 35
      )

      // Random initial rotation (books face all directions)
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.4,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.2
      )

      // Random scale (0.8-2.0x) — some books are large tomes, some are pocket-sized
      dummy.scale.setScalar(0.8 + Math.random() * 1.2)

      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)

      // Per-instance animation params
      phases[i] = Math.random() * Math.PI * 2
      bobSpeeds[i] = 0.3 + Math.random() * 0.4    // 0.3-0.7 (glacial bob)
      bobAmps[i] = 0.1 + Math.random() * 0.25      // 0.1-0.35 units
      rotSpeeds[i] = rotSpeed * (0.5 + Math.random()) // glacial rotation, varied per book
    }

    this.mesh.instanceMatrix.needsUpdate = true

    // InstancedBufferAttributes — GPU reads per-instance, not per-vertex
    bookGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    bookGeo.setAttribute('aBobSpeed', new THREE.InstancedBufferAttribute(bobSpeeds, 1))
    bookGeo.setAttribute('aBobAmp', new THREE.InstancedBufferAttribute(bobAmps, 1))
    bookGeo.setAttribute('aRotSpeed', new THREE.InstancedBufferAttribute(rotSpeeds, 1))

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
