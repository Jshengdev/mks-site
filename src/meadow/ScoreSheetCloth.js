// src/meadow/ScoreSheetCloth.js
// Wind-driven score sheet planes that tumble through the meadow
// Simplified cloth: billboard planes with vertex-shader wind distortion
import * as THREE from 'three'

const SHEET_VERT = `
  uniform float uTime;
  uniform float uWindStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Wind flutter — vertices offset by sine waves
    float flutter = sin(uTime * 2.0 + pos.x * 5.0) * 0.08 * uWindStrength;
    float tumble = sin(uTime * 0.7 + pos.y * 3.0) * 0.05 * uWindStrength;
    pos.z += flutter;
    pos.x += tumble;

    // Gentle curl at edges (fake cloth drape)
    float edgeDist = abs(uv.x - 0.5) * 2.0;
    pos.z -= edgeDist * edgeDist * 0.15;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const SHEET_FRAG = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    // Score sheets are mostly white paper with dark notation
    // Apply slight warmth from scene light
    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
  }
`

export default class ScoreSheetCloth {
  constructor(scene, count = 3) {
    this.meshes = []
    this.scene = scene
    this._windStrength = 1.0

    // Placeholder white texture until real score sheet image is loaded
    const placeholder = new THREE.DataTexture(
      new Uint8Array([255, 255, 240, 255]), 1, 1
    )
    placeholder.needsUpdate = true

    const geometry = new THREE.PlaneGeometry(1.2, 0.85, 8, 6) // A4-ish proportions

    for (let i = 0; i < count; i++) {
      const material = new THREE.ShaderMaterial({
        vertexShader: SHEET_VERT,
        fragmentShader: SHEET_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uWindStrength: { value: 1.0 },
          uTexture: { value: placeholder },
          uOpacity: { value: 0.85 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      const mesh = new THREE.Mesh(geometry, material)

      // Spread sheets along the camera path at different heights
      // They float above the grass, drifting with wind
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        1.5 + Math.random() * 2.5,
        -30 - i * 25  // Spread along the Z path
      )
      // Slight initial rotation for variety
      mesh.rotation.set(
        Math.random() * 0.3 - 0.15,
        Math.random() * Math.PI * 2,
        Math.random() * 0.2 - 0.1
      )

      // Store per-sheet animation offsets
      mesh.userData.phaseOffset = Math.random() * Math.PI * 2
      mesh.userData.driftSpeed = 0.3 + Math.random() * 0.5
      mesh.userData.tumbleSpeed = 0.15 + Math.random() * 0.3
      mesh.userData.baseY = mesh.position.y

      scene.add(mesh)
      this.meshes.push(mesh)
    }
  }

  // Call with a loaded texture when the score sheet image is available
  setTexture(texture) {
    for (const mesh of this.meshes) {
      mesh.material.uniforms.uTexture.value = texture
    }
  }

  update(elapsed) {
    for (const mesh of this.meshes) {
      const ud = mesh.userData
      const t = elapsed + ud.phaseOffset

      mesh.material.uniforms.uTime.value = elapsed
      mesh.material.uniforms.uWindStrength.value = this._windStrength

      // Gentle drift (horizontal)
      mesh.position.x += Math.sin(t * 0.3) * 0.002 * this._windStrength
      // Vertical bob
      mesh.position.y = ud.baseY + Math.sin(t * ud.driftSpeed) * 0.3
      // Slow tumble rotation
      mesh.rotation.y += ud.tumbleSpeed * 0.005
      mesh.rotation.z = Math.sin(t * 0.5) * 0.15
    }
  }

  // Called by AtmosphereController to sync wind
  setWindStrength(strength) {
    this._windStrength = strength
  }

  dispose() {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
  }
}
