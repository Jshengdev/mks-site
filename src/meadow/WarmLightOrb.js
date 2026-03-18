// WarmLightOrb.js — Glowing warm light orbs (Stemkoski fresnel glow)
// "Lamplight from nowhere" — each is a reading lamp that doesn't exist
// Fresnel glow technique stolen from stemkoski/Shader-Glow.html
// Magic values c=0.2, p=1.4 for warm orb (from Stemkoski research)
// IcosahedronGeometry smoother than SphereGeometry at low poly (from research)
import * as THREE from 'three'
import vertexShader from './shaders/warm-orb.vert.glsl?raw'
import fragmentShader from './shaders/warm-orb.frag.glsl?raw'

export default class WarmLightOrb {
  constructor(scene, config = {}) {
    const count = config.count ?? 6
    const color = config.color ?? [0.95, 0.78, 0.42]
    const orbRadius = config.radius ?? 0.25

    // IcosahedronGeometry — smoother than SphereGeometry at low vertex count
    const orbGeo = new THREE.IcosahedronGeometry(orbRadius, 2)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
      uniforms: {
        uTime: { value: 0 },
        uGlowColor: { value: new THREE.Color(...color) },
        uIntensity: { value: config.intensity ?? 2.0 },
        uFresnelC: { value: 0.2 },  // Stemkoski magic: warm orb
        uFresnelP: { value: 1.4 },  // Stemkoski magic: warm orb
      },
    })

    this.mesh = new THREE.InstancedMesh(orbGeo, this.material, count)

    const phases = new Float32Array(count)
    const pulseSpeeds = new Float32Array(count)
    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      // Position: spread through library volume, near shelf tiers
      const angle = (i / count) * Math.PI * 2.5
      const orbitRadius = 3 + Math.random() * 8

      dummy.position.set(
        Math.cos(angle) * orbitRadius,
        2 + i * 4 + Math.random() * 3,  // vertical spread matching shelf layers
        Math.sin(angle) * orbitRadius - 12
      )

      // Scale variation (0.8-1.5x)
      dummy.scale.setScalar(0.8 + Math.random() * 0.7)

      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)

      phases[i] = Math.random() * Math.PI * 2
      pulseSpeeds[i] = 0.2 + Math.random() * 0.3 // slow breathing pulse
    }

    this.mesh.instanceMatrix.needsUpdate = true

    orbGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    orbGeo.setAttribute('aPulseSpeed', new THREE.InstancedBufferAttribute(pulseSpeeds, 1))

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
