// FogWisp — large soft billboard sprites creating patches of drifting fog
// Billboard technique from three.js sprite shader / Chinedufn particle tutorial
// Radial gradient + wispy noise from Inigo Quiléz hash noise
// 30 instances, slow horizontal drift, creates "beauty that can't hold itself together"
import * as THREE from 'three'
import vertexShader from './shaders/fog-wisp.vert.glsl?raw'
import fragmentShader from './shaders/fog-wisp.frag.glsl?raw'

export default class FogWisp {
  constructor(scene, count = 30, config = {}) {
    const fogColor = config.color
      ? new THREE.Color().setRGB(...config.color)
      : new THREE.Color(0.22, 0.17, 0.08) // warm amber fog matching memory-garden

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uFogColor: { value: fogColor },
        uOpacity: { value: config.opacity ?? 0.35 },
      },
    })

    // Billboard quad geometry (PlaneGeometry — will be camera-aligned in vertex shader)
    const planeGeo = new THREE.PlaneGeometry(1, 1)

    const mesh = new THREE.InstancedMesh(planeGeo, this.material, count)
    const dummy = new THREE.Object3D()
    const phases = new Float32Array(count)
    const wispScales = new Float32Array(count)

    const spreadX = config.spreadX ?? 120
    const spreadZ = config.spreadZ ?? 120
    const minHeight = config.minHeight ?? 0.5
    const maxHeight = config.maxHeight ?? 4.0
    const minScale = config.minScale ?? 8
    const maxScale = config.maxScale ?? 25

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spreadX
      const z = (Math.random() - 0.5) * spreadZ
      const y = minHeight + Math.random() * (maxHeight - minHeight)

      dummy.position.set(x, y, z)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      phases[i] = Math.random() // unique drift phase
      wispScales[i] = minScale + Math.random() * (maxScale - minScale)
    }

    mesh.instanceMatrix.needsUpdate = true

    // Per-instance attributes
    mesh.geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    mesh.geometry.setAttribute('aWispScale', new THREE.InstancedBufferAttribute(wispScales, 1))

    this.mesh = mesh
    scene.add(mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setOpacity(value) {
    this.material.uniforms.uOpacity.value = value
    this.mesh.visible = value > 0.01
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
