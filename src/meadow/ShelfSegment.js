// ShelfSegment.js — Instanced floating bookshelves at impossible angles
// Escher-like geometry: shelves that shouldn't exist, spiraling upward
// Instancing pattern adapted from FlowerInstances.js
// Glacial rotation stolen from zadvorsky/three.bas quaternion technique
import * as THREE from 'three'
import vertexShader from './shaders/shelf.vert.glsl?raw'
import fragmentShader from './shaders/shelf.frag.glsl?raw'

export default class ShelfSegment {
  constructor(scene, config = {}) {
    const count = config.shelfCount ?? 12
    const woodColor = config.woodColor ?? [0.16, 0.10, 0.04]
    const goldAccent = config.goldAccent ?? [0.83, 0.63, 0.31]

    // Shelf plank geometry — long, thin, deep (dark aged wood)
    const baseWidth = 10 // will be randomly scaled per instance
    const shelfGeo = new THREE.BoxGeometry(baseWidth, 0.08, 0.45)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uWoodColor: { value: new THREE.Color(...woodColor) },
        uGoldAccent: { value: new THREE.Color(...goldAccent) },
        uLightColor: { value: new THREE.Color(0.95, 0.78, 0.42) },
        uAmbient: { value: 0.12 },
      },
    })

    this.mesh = new THREE.InstancedMesh(shelfGeo, this.material, count)

    const phases = new Float32Array(count)
    const rotSpeeds = new Float32Array(count)

    const dummy = new THREE.Object3D()
    const spacing = config.shelfSpacing ?? 4.0
    const widthRange = config.shelfWidth ?? [8, 15]

    for (let i = 0; i < count; i++) {
      // Position: spiral upward through the library volume
      // Alternating sides, varying radius — impossible geometry
      const angle = (i / count) * Math.PI * 3 // 1.5 full rotations
      const orbitRadius = 5 + Math.random() * 10

      dummy.position.set(
        Math.cos(angle) * orbitRadius,
        i * spacing + Math.random() * 2,
        Math.sin(angle) * orbitRadius - 15 // offset along Z path
      )

      // Impossible angles — tilted, rotated, defying gravity
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.6,        // slight pitch
        angle + Math.random() * 0.8,          // face inward + random
        (Math.random() - 0.5) * 0.3           // slight roll
      )

      // Random width within range
      const scaleX = (widthRange[0] + Math.random() * (widthRange[1] - widthRange[0])) / baseWidth
      dummy.scale.set(scaleX, 1.0, 1.0)

      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)

      phases[i] = Math.random() * Math.PI * 2
      rotSpeeds[i] = 0.0003 + Math.random() * 0.0005 // extremely slow glacial drift
    }

    this.mesh.instanceMatrix.needsUpdate = true

    shelfGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    shelfGeo.setAttribute('aRotSpeed', new THREE.InstancedBufferAttribute(rotSpeeds, 1))

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
