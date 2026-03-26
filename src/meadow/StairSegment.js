// StairSegment.js — Impossible staircase segments connecting floating platforms
// 20-30 instanced stair segments with 4 steps each, random orientations
// Stolen from: cubanducko Stairway Generator (step geometry pattern),
// Three.js forum spiral stairs (step dimensions: 1.2 wide, 0.15 thick, 0.4 deep),
// Monument Valley (impossible geometry = same mesh, impossible orientations)
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import vertexShader from './shaders/stone-platform.vert.glsl?raw'
import fragmentShader from './shaders/stone-platform.frag.glsl?raw'

export default class StairSegment {
  constructor(scene, config = {}, platformPositions = []) {
    const count = config.count ?? 25
    const stepsPerSegment = config.stepsPerSegment ?? 4

    // Build a single stair segment — 4 steps ascending
    // Step dimensions stolen from cubanducko: width=1.2, height=0.15, depth=0.4
    const stepWidth = 1.2
    const stepHeight = 0.15
    const stepDepth = 0.4
    const stepRise = 0.25

    const stepGeos = []
    for (let s = 0; s < stepsPerSegment; s++) {
      const step = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth)
      step.translate(0, s * stepRise + stepHeight * 0.5, s * stepDepth)
      stepGeos.push(step)
    }
    const mergedGeo = mergeGeometries(stepGeos)
    for (const g of stepGeos) g.dispose()

    // Reuse stone platform shader — same material, lower bob amplitude
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBobAmplitude: { value: config.bobAmplitude ?? 0.15 },
        uLightDir: { value: new THREE.Vector3(0.3, 0.7, 0.5).normalize() },
        uAmbient: { value: 0.12 },
      },
    })

    this.mesh = new THREE.InstancedMesh(mergedGeo, this.material, count)

    const phases = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      const t = i / count

      // Place stairs between platform positions if available,
      // otherwise distribute along the spiral path
      if (platformPositions.length > 1) {
        // Pick two nearby platforms and place stairs between them
        const idxA = Math.floor(Math.random() * platformPositions.length)
        const idxB = Math.min(idxA + 1 + Math.floor(Math.random() * 3), platformPositions.length - 1)
        const posA = platformPositions[idxA]
        const posB = platformPositions[idxB]

        // Midpoint between platforms
        const mid = new THREE.Vector3().lerpVectors(posA, posB, 0.5)
        // Offset slightly for visual interest
        mid.x += (Math.random() - 0.5) * 3
        mid.y += (Math.random() - 0.5) * 2
        dummy.position.copy(mid)

        // Orient toward second platform (rough aim)
        dummy.lookAt(posB)
      } else {
        // Fallback: distribute along ascending spiral
        const angle = t * Math.PI * 5
        const radius = 4 + t * 10 + (Math.random() - 0.5) * 3
        dummy.position.set(
          Math.cos(angle) * radius,
          t * 18 + (Math.random() - 0.5) * 3,
          -t * 155
        )
      }

      // Impossible orientations — the disorientation IS the point
      // 20% upside down, 30% sideways, 50% roughly upright
      const orient = Math.random()
      if (orient < 0.2) {
        // Upside down stairs — gravity is wrong
        dummy.rotation.x += Math.PI
        dummy.rotation.z += (Math.random() - 0.5) * 0.5
      } else if (orient < 0.5) {
        // Sideways — stairs running along walls
        dummy.rotation.z = Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1)
        dummy.rotation.y += Math.random() * Math.PI * 2
      } else {
        // Roughly upright but with random yaw
        dummy.rotation.y = Math.random() * Math.PI * 2
        dummy.rotation.x += (Math.random() - 0.5) * 0.3
      }

      const scale = 0.8 + Math.random() * 0.8
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)

      phases[i] = Math.random() * Math.PI * 2

      // Darker stone than platforms — stairs are more worn
      const grey = 0.06 + Math.random() * 0.06
      colors[i * 3] = grey
      colors[i * 3 + 1] = grey
      colors[i * 3 + 2] = grey + 0.015
    }

    this.mesh.instanceMatrix.needsUpdate = true

    mergedGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    mergedGeo.setAttribute('aInstanceColor', new THREE.InstancedBufferAttribute(colors, 3))

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
