// FloatingPlatform.js — Escher-inspired floating stone slabs
// 30-50 instanced platforms in an ascending spiral, some tilted/inverted
// Stolen from: pailhead instancing (InstancedBufferAttribute + GPU bob),
// Minecraft End Cities (floating island arrangement),
// TakashiL/Penrose-Stairs (impossible geometry via orientation)
import * as THREE from 'three'
import vertexShader from './shaders/stone-platform.vert.glsl?raw'
import fragmentShader from './shaders/stone-platform.frag.glsl?raw'

export default class FloatingPlatform {
  constructor(scene, config = {}) {
    const count = config.count ?? 40
    const bobAmplitude = config.bobAmplitude ?? 0.3

    // Stone slab geometry — wide, thin rectangles
    // Varied sizes via per-instance scale, base is 3.5 x 0.35 x 3.5
    const geometry = new THREE.BoxGeometry(
      config.width ?? 3.5,
      config.thickness ?? 0.35,
      config.depth ?? 3.5
    )

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBobAmplitude: { value: bobAmplitude },
        uLightDir: { value: new THREE.Vector3(0.3, 0.7, 0.5).normalize() },
        uAmbient: { value: 0.15 },
      },
    })

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count)

    const phases = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const dummy = new THREE.Object3D()

    // Store positions for stair/portal placement later
    this.platformPositions = []

    for (let i = 0; i < count; i++) {
      const t = i / count

      // Ascending spiral — matches camera path z-range [0 to -160]
      // 2.5 full turns, expanding radius, randomized offsets
      const angle = t * Math.PI * 5
      const radius = 5 + t * 14 + (Math.random() - 0.5) * 5
      const x = Math.cos(angle) * radius
      const z = -t * 160
      const y = t * 20 + (Math.random() - 0.5) * 4

      dummy.position.set(x, y, z)
      this.platformPositions.push(new THREE.Vector3(x, y, z))

      // Escher rotations — impossible orientations
      // 25% upside down, 30% tilted, 45% near-normal
      const roll = Math.random()
      if (roll < 0.25) {
        // Upside down — platforms floating inverted overhead
        dummy.rotation.set(
          Math.PI + (Math.random() - 0.5) * 0.2,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.3
        )
      } else if (roll < 0.55) {
        // Tilted — angled platforms suggesting broken gravity
        dummy.rotation.set(
          (Math.random() - 0.5) * 0.7,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.5
        )
      } else {
        // Near-normal — subtle imperfection (never perfectly flat)
        dummy.rotation.set(
          (Math.random() - 0.5) * 0.12,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.12
        )
      }

      // Varied scale — mix of large landings and small stepping stones
      const scale = 0.5 + Math.random() * 1.2
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)

      // Per-instance phase for bob animation
      phases[i] = Math.random() * Math.PI * 2

      // Per-instance stone color — cool grey with subtle variation
      // Range: 0.08-0.16 grey, slightly blue-tinted
      const grey = 0.08 + Math.random() * 0.08
      colors[i * 3] = grey
      colors[i * 3 + 1] = grey
      colors[i * 3 + 2] = grey + 0.02
    }

    this.mesh.instanceMatrix.needsUpdate = true

    geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    geometry.setAttribute('aInstanceColor', new THREE.InstancedBufferAttribute(colors, 3))

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
