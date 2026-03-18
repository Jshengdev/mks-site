// JellyfishSystem — Instanced bioluminescent jellyfish with pulsing bells + trailing tentacles
// Adapted from arodic/Chrysaora (asymmetric pulse), holtsetio/aurelia (bell geometry),
// jpweeks/particulate-medusae (Fresnel translucency), otanodesignco (Fresnel rim glow)
// Geometry: hemisphere bell (inverted) + 8 thin cylinder tentacles, merged
// Vertex shader: radial bell pulse + depth-dependent tentacle wave
// Fragment shader: Fresnel bioluminescent glow, additive blending
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import vertexShader from './shaders/jellyfish.vert.glsl?raw'
import fragmentShader from './shaders/jellyfish.frag.glsl?raw'

export default class JellyfishSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 30

    // --- Build jellyfish geometry: bell + tentacles ---

    // Bell: hemisphere, 55% arc, flattened for bell shape, opening faces down
    // Adapted from aurelia: sin(PI - PI*0.55*t*1.8) bell profile
    const bell = new THREE.SphereGeometry(1, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55)
    bell.scale(1, 0.65, 1)   // flatten for bell shape
    bell.rotateX(Math.PI)     // flip so opening faces down
    bell.translate(0, 0.65, 0) // top of bell at ~0.65

    // 8 tentacles: thin tapered cylinders hanging below the bell
    // Adapted from aurelia: tentacleRadius=0.015, sqrt falloff width taper
    const tentacles = []
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const r = 0.3 + (i % 3) * 0.15     // radial offset from center
      const len = 1.5 + (i % 4) * 0.6     // varied tentacle lengths
      const tent = new THREE.CylinderGeometry(0.025, 0.006, len, 3)
      tent.translate(Math.cos(angle) * r, -len * 0.5, Math.sin(angle) * r)
      tentacles.push(tent)
    }

    const merged = mergeGeometries([bell, ...tentacles])
    bell.dispose()
    tentacles.forEach(t => t.dispose())

    // ShaderMaterial: Fresnel rim glow + translucent body
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uBellColor: { value: new THREE.Color().setRGB(...(config.bellColor ?? [0.05, 0.15, 0.25])) },
        uGlowColor: { value: new THREE.Color().setRGB(...(config.rimGlowColor ?? [0.20, 0.90, 0.80])) },
        uFresnelPower: { value: config.fresnelPower ?? 1.5 },
        uBrightness: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    })

    // Per-instance species variation (color + opacity + scale)
    // Controlled randomness: curated 5-species palette, power-law size distribution
    // Real deep-sea ecosystems: many small organisms, few massive ones
    const colorIndices = new Float32Array(count)
    const opacityScales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Species: random 0-1, mapped to 5 species bands in fragment shader
      // 35% cyan (Aequorea), 25% blue (Mnemiopsis), 15% red (Crossota),
      // 15% violet (Beroe), 10% ghost white (Leucothea)
      const ci = Math.random()
      colorIndices[i] = ci

      // Opacity correlated with species — ghost-white nearly invisible,
      // blood-red most opaque (absorbs all light at depth → appears solid)
      if (ci > 0.90) {
        opacityScales[i] = 0.25 + Math.random() * 0.25  // ghostly
      } else if (ci > 0.60 && ci <= 0.75) {
        opacityScales[i] = 0.65 + Math.random() * 0.35  // solid reds
      } else {
        opacityScales[i] = 0.40 + Math.random() * 0.45  // medium
      }
    }

    merged.setAttribute('aColorIndex',
      new THREE.InstancedBufferAttribute(colorIndices, 1))
    merged.setAttribute('aOpacityScale',
      new THREE.InstancedBufferAttribute(opacityScales, 1))

    // InstancedMesh — GPU instancing for 20-40 jellyfish
    this.mesh = new THREE.InstancedMesh(merged, this.material, count)
    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      // Spread jellyfish across the world volume
      const x = (Math.random() - 0.5) * 120
      const z = -Math.random() * 180 - 10 // along the descent path
      const y = 1.0 + Math.random() * 7.0 // 1-8 units above abyssal floor

      dummy.position.set(x, y, z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      // Power-law scale: many small (1-2.5), few massive (5-6)
      // pow(r, 2) → ~50% below 2.25, ~10% above 5.0
      // Creates "creature scale variation" — tiny plankton-jelly to deep-sea giants
      const scale = 1.0 + Math.pow(Math.random(), 2.0) * 5.0
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)
    }

    this.mesh.instanceMatrix.needsUpdate = true
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(value) {
    this.material.uniforms.uBrightness.value = value
    this.mesh.visible = value > 0.01
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
