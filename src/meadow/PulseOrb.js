// PulseOrb — bass-pulse icosahedron spheres for Sonic Void
// Stolen from: stemkoski glow sphere, danieldelcore breathing icosahedron,
// ektogamat fake-glow-material Fresnel, stephanbogner fibonacci distribution
import * as THREE from 'three'
import vertexShader from './shaders/pulseOrb.vert.glsl?raw'
import fragmentShader from './shaders/pulseOrb.frag.glsl?raw'

export default class PulseOrb {
  constructor(scene, config = {}) {
    const count = config.count ?? 7
    const detail = config.detail ?? 2
    const baseRadius = config.baseRadius ?? 0.8
    const spread = config.spatialSpread ?? 30
    const vSpread = config.verticalSpread ?? 15

    const geometry = new THREE.IcosahedronGeometry(baseRadius, detail)

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uPulseIntensity: { value: 1.0 },
        uColor: { value: new THREE.Color(...(config.color ?? [0.545, 0.184, 0.788])) },
        uFresnelColor: { value: new THREE.Color(...(config.fresnelColor ?? [0.706, 0.353, 1.0])) },
        uEmissiveIntensity: { value: config.emissiveIntensity ?? 2.0 },
        uFresnelIntensity: { value: config.fresnelIntensity ?? 1.5 },
        uBrightness: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    })

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count)

    // Per-instance attributes
    const phases = new Float32Array(count)
    const baseScales = new Float32Array(count)
    const dummy = new THREE.Object3D()

    // Fibonacci-ish asymmetric cluster (stephanbogner golden angle)
    const golden = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < count; i++) {
      const y = ((i / count) * 2 - 1) * vSpread
      const r = Math.sqrt(1 - Math.pow(y / vSpread, 2)) * spread * 0.5

      const theta = i * golden
      dummy.position.set(
        Math.cos(theta) * r + (Math.random() - 0.5) * 5,
        y + (Math.random() - 0.5) * 3,
        Math.sin(theta) * r + (Math.random() - 0.5) * 5 - 50
      )
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)

      phases[i] = Math.random()
      baseScales[i] = 0.6 + Math.random() * 0.8
    }

    geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    geometry.setAttribute('aBaseScale', new THREE.InstancedBufferAttribute(baseScales, 1))
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
